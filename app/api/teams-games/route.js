import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with Service Role Key for Admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * GET handler to retrieve all games, their teams, and team members.
 * Fetches: Games -> Teams -> Users (players assigned to the team)
 */
export async function GET() {
  try {
    const { data: games, error } = await supabase
      .from("games")
      .select(
        `
        id,
        name,
        max_players_per_team,
        teams (
          id,
          name,
          users ( 
            id,
            username,
            role
          )
        )
      `
      )
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "[TEAMS-GAMES ROUTE] ❌ Supabase fetch failed:",
        error.message
      );
      return NextResponse.json(
        {
          success: false,
          message: "Could not fetch games and teams data.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: games }, { status: 200 });
  } catch (error) {
    console.error("[TEAMS-GAMES ROUTE] 🛑 Error fetching data:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new game or a new team.
 * Expects { action: "CREATE_GAME" | "CREATE_TEAM", payload: {...} }
 */
export async function POST(request) {
  try {
    const { action, payload } = await request.json();

    if (action === "CREATE_GAME") {
      const { name, max_players_per_team } = payload;
      if (!name || !max_players_per_team) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing required fields for game creation.",
          },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("games")
        .insert([{ name, max_players_per_team }])
        .select();

      if (error) {
        console.error(
          "[TEAMS-GAMES ROUTE] ❌ Game insert failed:",
          error.message
        );
        return NextResponse.json(
          {
            success: false,
            message: "Failed to create game. (Possibly duplicate name)",
            error: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Game created successfully.", data: data[0] },
        { status: 201 }
      );
    }

    if (action === "CREATE_TEAM") {
      const { name, game_id } = payload;
      if (!name || !game_id) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing required fields for team creation.",
          },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("teams")
        .insert([{ name, game_id }])
        .select();

      if (error) {
        console.error(
          "[TEAMS-GAMES ROUTE] ❌ Team insert failed:",
          error.message
        );
        const message =
          error.code === "23505"
            ? "A team with this name already exists for the selected game."
            : "Failed to create team.";
        return NextResponse.json(
          { success: false, message, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Team created successfully.", data: data[0] },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action specified for POST request." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[TEAMS-GAMES ROUTE] 🛑 Error in POST:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler to assign or unassign a user from a team.
 * Expects { user_id: 'uuid', team_id: 'uuid' | null }
 */
export async function PATCH(request) {
  try {
    const { user_id, team_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Missing user_id for update." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({ team_id: team_id || null })
      .eq("id", user_id)
      .select("id, username, team_id");

    if (error) {
      console.error(
        "[TEAMS-GAMES ROUTE] ❌ User assignment failed:",
        error.message
      );
      const message =
        error.code === "23503"
          ? "The specified team does not exist."
          : "Failed to update user's team assignment.";
      return NextResponse.json(
        { success: false, message, error: error.message },
        { status: 500 }
      );
    }

    const message = team_id
      ? `User ${user_id} assigned to team ${team_id}.`
      : `User ${user_id} unassigned from team.`;

    return NextResponse.json(
      { success: true, message, data: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TEAMS-GAMES ROUTE] 🛑 Error in PATCH:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing games or teams.
 * Expects { action: "DELETE_GAME" | "DELETE_TEAM", payload: { id: string } }
 */
export async function DELETE(request) {
  try {
    const { action, payload } = await request.json();
    const { id } = payload || {};

    if (!action || !id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing action or id for delete operation.",
        },
        { status: 400 }
      );
    }

    if (action === "DELETE_GAME") {
      // Delete game (and cascade to its teams if foreign key is ON DELETE CASCADE)
      const { error } = await supabase.from("games").delete().eq("id", id);

      if (error) {
        console.error(
          "[TEAMS-GAMES ROUTE] ❌ Game deletion failed:",
          error.message
        );
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete game.",
            error: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: `Game ${id} deleted successfully.` },
        { status: 200 }
      );
    }

    if (action === "DELETE_TEAM") {
      // Unassign users from team before deleting (to avoid FK constraint)
      const { error: userError } = await supabase
        .from("users")
        .update({ team_id: null })
        .eq("team_id", id);

      if (userError) {
        console.error(
          "[TEAMS-GAMES ROUTE] ⚠️ User unassignment failed:",
          userError.message
        );
      }

      const { error } = await supabase.from("teams").delete().eq("id", id);

      if (error) {
        console.error(
          "[TEAMS-GAMES ROUTE] ❌ Team deletion failed:",
          error.message
        );
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete team.",
            error: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: `Team ${id} deleted successfully.` },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action for DELETE request." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[TEAMS-GAMES ROUTE] 🛑 Error in DELETE:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
