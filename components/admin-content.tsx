"use client";

import { motion } from "framer-motion";
import { AdminTab } from "./admin-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  Loader2,
  Mail,
  Plus,
  Gamepad2,
  Users2,
  Users,
  ChevronDown,
  ChevronUp,
  UserMinus,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  discord_handle: string;
  phone_number: string;
  is_over_18: boolean;
  created_at: string;
}

interface Team {
  id: string;
  name: string;
  users?: User[];
}

interface Game {
  id: string;
  name: string;
  max_players_per_team: number;
  teams: Team[];
}

interface AdminContentProps {
  activeTab: AdminTab;
  users: User[];
  currentUserId: string;
  isLoading: boolean;
  setDeleteUserId: (id: string | null) => void;
  setToggleRoleUserId: (id: string | null) => void;
}

// -------------------- LOADING & ERROR --------------------
const LoadingIndicator = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex justify-center items-center py-16 text-primary">
    <Loader2 className="w-8 h-8 animate-spin mr-2" />
    <p className="text-lg">{text}</p>
  </div>
);

const ErrorIndicator = ({ message }: { message: string }) => (
  <div className="text-center py-16 text-destructive">
    <p className="text-xl font-semibold mb-2">Error Loading Data</p>
    <p className="text-sm">{message}</p>
  </div>
);

// -------------------- APPLICANTS TAB --------------------
function ApplicantsManagementTab() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/join");
        const result = await response.json();
        if (response.ok && result.success) {
          setApplicants(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch applicants.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  // Custom modal instead of alert/confirm
  const handleMailTo = (email: string) => {
    // In a real application, you'd use a custom dialog/modal here.
    window.location.href = `mailto:${email}`;
  };

  if (isLoading) return <LoadingIndicator text="Loading applicants..." />;
  if (error) return <ErrorIndicator message={error} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="w-6 h-6" /> Applicant Queue
          </CardTitle>
          <CardDescription>
            Review and process all incoming user applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Discord</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Over 18</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((a, index) => (
                <TableRow key={a.id ? String(a.id) : `applicant-${index}`}>
                  <TableCell>
                    {a.first_name} {a.last_name}
                  </TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.discord_handle}</TableCell>
                  <TableCell>{a.phone_number}</TableCell>
                  <TableCell>
                    <Badge variant={a.is_over_18 ? "default" : "destructive"}>
                      {a.is_over_18 ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMailTo(a.email)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// -------------------- GAMES TAB --------------------
function GameManagementTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGameName, setNewGameName] = useState("");
  const [newGameMax, setNewGameMax] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teams-games");
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to fetch games.");
      setGames(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createGame = async () => {
    if (!newGameName || !newGameMax)
      return console.error("Please fill all fields.");
    setIsCreating(true);
    try {
      const res = await fetch("/api/teams-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_GAME",
          payload: {
            name: newGameName,
            max_players_per_team: Number(newGameMax),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to create game.");

      setNewGameName("");
      setNewGameMax("");
      setShowCreateDialog(false);
      fetchGames();
    } catch (e: any) {
      console.error(e.message);
      // In a real app, display error in a toast/modal
    } finally {
      setIsCreating(false);
    }
  };

  const deleteGame = async (id: string) => {
    setShowConfirmDelete(null);
    try {
      const res = await fetch("/api/teams-games", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE_GAME", payload: { id } }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to delete game.");
      fetchGames();
    } catch (e: any) {
      console.error(e.message);
      // In a real app, display error in a toast/modal
    }
  };

  if (isLoading) return <LoadingIndicator text="Loading games..." />;
  if (error) return <ErrorIndicator message={error} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Gamepad2 className="w-5 h-5" /> Game Management
            </CardTitle>
            <CardDescription>Manage all games and their rules.</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gameName">Game Name</Label>
                  <Input
                    id="gameName"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPlayers">Max Players per Team</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    value={newGameMax}
                    onChange={(e) => setNewGameMax(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createGame} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    "Create Game"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No games yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Max Players</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.name}</TableCell>
                    <TableCell>{g.max_players_per_team}</TableCell>
                    <TableCell>{g.teams.length}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setShowConfirmDelete(g.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {/* Simple Delete Confirmation Modal (replace with shadcn/ui Dialog if possible) */}
                      {showConfirmDelete === g.id && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                          <Card className="p-6">
                            <h3 className="font-semibold mb-3">
                              Confirm Deletion
                            </h3>
                            <p className="text-sm mb-4">
                              Are you sure you want to delete the game "{g.name}
                              "?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setShowConfirmDelete(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteGame(g.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </Card>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// -------------------- TEAMS TAB --------------------
function TeamManagementTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null
  );
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [removingPlayer, setRemovingPlayer] = useState<string | null>(null);

  const toggleTeamExpanded = (teamId: string) => {
    setExpandedTeams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teams-games");
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to fetch teams.");
      setGames(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createTeam = async () => {
    if (!newTeamName || !selectedGame)
      return console.error("Please fill all fields.");
    setIsCreating(true);
    try {
      const res = await fetch("/api/teams-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_TEAM",
          payload: { name: newTeamName, game_id: selectedGame },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to create team.");

      setNewTeamName("");
      setSelectedGame(null);
      setShowCreateDialog(false);
      fetchGames();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTeam = async (id: string) => {
    setShowConfirmDelete(null);
    try {
      const res = await fetch("/api/teams-games", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE_TEAM", payload: { id } }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to delete team.");
      fetchGames();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const removePlayerFromTeam = async (userId: string) => {
    setRemovingPlayer(userId);
    try {
      const res = await fetch("/api/teams-games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          team_id: null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to remove player.");
      fetchGames();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setRemovingPlayer(null);
    }
  };

  if (isLoading) return <LoadingIndicator text="Loading teams..." />;
  if (error) return <ErrorIndicator message={error} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Users2 className="w-5 h-5" /> Team Management
            </CardTitle>
            <CardDescription className="text-sm">Manage teams and their rosters for each game.</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" /> Add Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="selectGame" className="mt-2">
                    Select Game
                  </Label>
                  <Select onValueChange={setSelectedGame}>
                    <SelectTrigger id="selectGame">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent>
                      {games.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createTeam} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No games defined yet.
            </p>
          ) : (
            <div className="space-y-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="border p-4 rounded-lg bg-muted/20 shadow-sm"
                >
                  <h2 className="font-bold text-lg sm:text-xl mb-3 border-b pb-2 text-primary flex flex-wrap items-center gap-2">
                    <Gamepad2 className="w-5 h-5 flex-shrink-0" /> 
                    <span className="flex-1 min-w-0">{game.name}</span>
                    <Badge variant="outline" className="font-normal text-xs sm:text-sm">
                      {game.teams.length} team{game.teams.length !== 1 ? "s" : ""}
                    </Badge>
                  </h2>
                  {game.teams.length === 0 ? (
                    <p className="text-sm text-muted-foreground pt-2">
                      No teams for this game yet.
                    </p>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {game.teams.map((team) => {
                        const isExpanded = expandedTeams.has(team.id);
                        const memberCount = team.users?.length || 0;
                        const isFull = memberCount >= game.max_players_per_team;

                        return (
                          <div
                            key={team.id}
                            className="border rounded-lg bg-background shadow-sm overflow-hidden"
                          >
                            {/* Team Header - Always Visible */}
                            <div
                              className="flex flex-wrap items-center justify-between gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => toggleTeamExpanded(team.id)}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="font-semibold truncate">{team.name}</span>
                                <Badge
                                  variant={isFull ? "default" : "secondary"}
                                  className={`text-xs ${isFull ? "bg-green-600" : ""}`}
                                >
                                  {memberCount}/{game.max_players_per_team}
                                </Badge>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowConfirmDelete(team.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Expanded Team Members */}
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t bg-muted/30"
                              >
                                <div className="p-3">
                                  {memberCount === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-2">
                                      No players assigned to this team yet.
                                    </p>
                                  ) : (
                                    <ul className="space-y-2">
                                      {team.users?.map((user) => (
                                        <li
                                          key={user.id}
                                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-background rounded-md border"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <span className="font-medium truncate">{user.username}</span>
                                            <Badge
                                              variant={user.role === "ADMIN" ? "default" : "outline"}
                                              className="text-xs flex-shrink-0"
                                            >
                                              {user.role}
                                            </Badge>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                            onClick={() => removePlayerFromTeam(user.id)}
                                            disabled={removingPlayer === user.id}
                                          >
                                            {removingPlayer === user.id ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                              <>
                                                <UserMinus className="w-4 h-4 mr-1" />
                                                Remove
                                              </>
                                            )}
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </motion.div>
                            )}

                            {/* Delete Confirmation Dialog */}
                            {showConfirmDelete === team.id && (
                              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <Card className="p-4 sm:p-6 w-full max-w-md">
                                  <h3 className="font-semibold mb-3">
                                    Confirm Deletion
                                  </h3>
                                  <p className="text-sm mb-4">
                                    Are you sure you want to delete team "
                                    {team.name}"? This will remove all player
                                    assignments.
                                  </p>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowConfirmDelete(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => deleteTeam(team.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// -------------------- USERS TAB --------------------
function UserManagementTab({
  users,
  currentUserId,
  isLoading,
  setDeleteUserId,
  setToggleRoleUserId,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingIndicator text="Fetching users..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setToggleRoleUserId(user.id)}
                      disabled={user.id === currentUserId || isLoading}
                    >
                      Toggle Role
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteUserId(user.id)}
                      disabled={user.id === currentUserId || isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// -------------------- PLAYERS TAB --------------------
// FIX: Accepting 'users' as a prop and removing internal user fetch
function PlayersManagementTab({ users }: { users: User[] }) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false); // Loading state for assignment
  const [isRemoving, setIsRemoving] = useState<string | null>(null); // Loading state for removal (store user ID)

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const gamesRes = await fetch("/api/teams-games");
      const gamesData = await gamesRes.json();

      if (!gamesRes.ok || !gamesData.success)
        throw new Error(gamesData.message || "Failed to fetch games data");

      setGames(gamesData.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignPlayer = async () => {
    if (!selectedUserId || !selectedTeamId)
      return console.error("Select both fields.");
    setIsAssigning(true); // Set loading
    try {
      const res = await fetch("/api/teams-games", {
        // CHANGED URL
        method: "PATCH", // CHANGED METHOD
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUserId,
          team_id: selectedTeamId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to assign player.");

      fetchData(); // Refetch games to show updated team composition
      setSelectedUserId(null);
      setSelectedTeamId(null);
    } catch (e: any) {
      console.error(e.message);
      // In a real app, display error in a toast/modal
    } finally {
      setIsAssigning(false); // Unset loading
    }
  };

  // NEW FUNCTION to remove a player
  const removePlayer = async (userId: string) => {
    setIsRemoving(userId); // Set loading for this specific user
    try {
      const res = await fetch("/api/teams-games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          team_id: null, // Set team_id to null to unassign
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to remove player.");

      fetchData(); // Refetch games to show updated team composition
    } catch (e: any) {
      console.error(e.message);
      // In a real app, display error in a toast/modal
    } finally {
      setIsRemoving(null); // Unset loading
    }
  };

  if (isLoading)
    return <LoadingIndicator text="Loading teams and players..." />;
  if (error) return <ErrorIndicator message={error} />;

  const availableTeams = games.flatMap((g) => g.teams);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="w-6 h-6" /> Players Management
          </CardTitle>
          <CardDescription>
            Assign users to specific teams for each game.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="selectUser">User to Assign</Label>
              <Select
                onValueChange={setSelectedUserId}
                value={selectedUserId || ""}
              >
                <SelectTrigger id="selectUser">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full">
              <Label htmlFor="selectTeam">Target Team</Label>
              <Select
                onValueChange={setSelectedTeamId}
                value={selectedTeamId || ""}
              >
                <SelectTrigger id="selectTeam">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map((t) => {
                    const game = games.find((g) =>
                      g.teams.some((team) => team.id === t.id)
                    );
                    return (
                      <SelectItem key={t.id} value={t.id}>
                        {game?.name || "Unknown Game"} - {t.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={assignPlayer}
              className="w-full md:w-auto"
              disabled={isAssigning}
            >
              {isAssigning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Assign Player"
              )}
            </Button>
          </div>

          <div className="space-y-8 pt-4">
            <h3 className="text-xl font-semibold border-b pb-2">
              Team Rosters
            </h3>
            {games.map((game) => (
              <div
                key={game.id}
                className="border p-4 rounded-lg bg-background shadow-md"
              >
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-primary">
                  <Gamepad2 className="w-4 h-4" /> {game.name} (Max:{" "}
                  {game.max_players_per_team} per team)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.teams.map((team) => (
                    <Card key={team.id} className="bg-muted/30">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          {team.name}
                          <Badge variant="secondary">
                            {team.users?.length || 0} /{" "}
                            {game.max_players_per_team}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-3">
                        {team.users && team.users.length > 0 ? (
                          <ul className="space-y-2 text-sm">
                            {team.users.map((user) => (
                              <li
                                key={user.id}
                                className="flex items-center justify-between p-1 bg-background rounded shadow-sm"
                              >
                                <span className="text-muted-foreground truncate">
                                  {user.username}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removePlayer(user.id)}
                                  disabled={isRemoving === user.id}
                                >
                                  {isRemoving === user.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  )}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-center text-gray-500">
                            No players assigned yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// -------------------- MAIN EXPORT --------------------
export function AdminContent({
  activeTab,
  users,
  currentUserId,
  isLoading,
  setDeleteUserId,
  setToggleRoleUserId,
}: AdminContentProps) {
  switch (activeTab) {
    case "Users":
      return (
        <UserManagementTab
          users={users}
          currentUserId={currentUserId}
          isLoading={isLoading}
          setDeleteUserId={setDeleteUserId}
          setToggleRoleUserId={setToggleRoleUserId}
        />
      );
    case "Applicants":
      return <ApplicantsManagementTab />;
    case "Games":
      return <GameManagementTab />;
    case "Teams":
      return <TeamManagementTab />;
    case "Players":
      // FIX APPLIED: Pass the users prop to PlayersManagementTab
      return <PlayersManagementTab users={users} />;
    default:
      return null;
  }
}
