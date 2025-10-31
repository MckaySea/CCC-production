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
                      onClick={() =>
                        (window.location.href = `mailto:${a.email}`)
                      }
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

function GameManagementTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGameName, setNewGameName] = useState("");
  const [newGameMax, setNewGameMax] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teams-games");
      const data = await res.json();
      if (!data.success)
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
    if (!newGameName || !newGameMax) return alert("Please fill all fields.");
    setIsCreating(true);
    const res = await fetch("/api/teams-games", {
      method: "POST",
      body: JSON.stringify({
        action: "CREATE_GAME",
        payload: {
          name: newGameName,
          max_players_per_team: Number(newGameMax),
        },
      }),
    });
    const data = await res.json();
    setIsCreating(false);
    if (!data.success) return alert(data.message);
    setNewGameName("");
    setNewGameMax("");
    fetchGames();
  };

  const deleteGame = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    const res = await fetch("/api/teams-games", {
      method: "DELETE",
      body: JSON.stringify({ action: "DELETE_GAME", payload: { id } }),
    });
    const data = await res.json();
    if (!data.success) return alert(data.message);
    fetchGames();
  };

  if (isLoading) return <LoadingIndicator text="Loading games..." />;
  if (error) return <ErrorIndicator message={error} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Gamepad2 className="w-5 h-5" /> Game Management
            </CardTitle>
            <CardDescription>Manage all games and their rules.</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Game</DialogTitle>
              </DialogHeader>
              <Label>Game Name</Label>
              <Input
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
              />
              <Label>Max Players per Team</Label>
              <Input
                type="number"
                value={newGameMax}
                onChange={(e) => setNewGameMax(e.target.value)}
              />
              <DialogFooter>
                <Button onClick={createGame} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Game"}
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
                        onClick={() => deleteGame(g.id)}
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
    </motion.div>
  );
}

function TeamManagementTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teams-games");
      const data = await res.json();
      if (!data.success)
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
    if (!newTeamName || !selectedGame) return alert("Please fill all fields.");
    setIsCreating(true);
    const res = await fetch("/api/teams-games", {
      method: "POST",
      body: JSON.stringify({
        action: "CREATE_TEAM",
        payload: { name: newTeamName, game_id: selectedGame },
      }),
    });
    const data = await res.json();
    setIsCreating(false);
    if (!data.success) return alert(data.message);
    setNewTeamName("");
    setSelectedGame(null);
    fetchGames();
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    const res = await fetch("/api/teams-games", {
      method: "DELETE",
      body: JSON.stringify({ action: "DELETE_TEAM", payload: { id } }),
    });
    const data = await res.json();
    if (!data.success) return alert(data.message);
    fetchGames();
  };

  if (isLoading) return <LoadingIndicator text="Loading teams..." />;
  if (error) return <ErrorIndicator message={error} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users2 className="w-5 h-5" /> Team Management
            </CardTitle>
            <CardDescription>Manage teams for each game.</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Team</DialogTitle>
              </DialogHeader>
              <Label>Team Name</Label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <Label className="mt-2">Select Game</Label>
              <Select onValueChange={setSelectedGame}>
                <SelectTrigger>
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
              <DialogFooter>
                <Button onClick={createTeam} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Team"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {games.map((game) => (
            <div
              key={game.id}
              className="mb-6 border p-4 rounded-lg bg-muted/20"
            >
              <h2 className="font-semibold text-lg mb-2">{game.name}</h2>
              {game.teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No teams for this game yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {game.teams.map((team) => (
                    <li
                      key={team.id}
                      className="flex justify-between items-center p-2 bg-background border rounded"
                    >
                      <span>{team.name}</span>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteTeam(team.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

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
      </CardContent>
    </Card>
  );
}

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
    default:
      return null;
  }
}
