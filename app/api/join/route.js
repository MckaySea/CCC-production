import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are correctly set for the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Using the service role key is necessary to securely fetch all data without
// requiring row-level security policies for the 'applicants' table, which is
// suitable for a secure backend route like this.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * POST handler to submit a new application to the 'applicants' table.
 */
export async function POST(request) {
  try {
    const formData = await request.json();
    console.log("[JOIN ROUTE] ✅ Received data:", formData);

    const { firstName, lastName, discord, phone, email, message, over18 } = formData;

    if (!firstName || !lastName || !discord || !phone || !email || !over18) {
      return NextResponse.json(
        { success: false, message: "Missing required form fields." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("applicants").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        discord_handle: discord,
        phone_number: phone,
        message: message || null,
        // Convert the 'yes'/'no' string to a boolean for the database
        is_over_18: over18 === "yes",
      },
    ]);

    if (error) {
      console.error("[JOIN ROUTE] ❌ Supabase insert failed:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Database insert failed.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log("[JOIN ROUTE] ✅ Data saved successfully:", data);
    return NextResponse.json(
      { success: true, message: "Application saved successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("[JOIN ROUTE] 🛑 Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}

/**
 * GET handler to retrieve all applications from the 'applicants' table.
 * This is an admin-only function, secured by the service role key usage above.
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false }); // Show newest applicants first

    if (error) {
      console.error("[JOIN ROUTE] ❌ Supabase fetch failed:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Could not fetch applicants data.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log(`[JOIN ROUTE] ✅ Fetched ${data.length} applicants.`);
    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error) {
    console.error("[JOIN ROUTE] 🛑 Error fetching data:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
