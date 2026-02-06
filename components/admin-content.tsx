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
  Search,
  UserPlus,
  User as UserIcon,
  Upload,
  Pencil,
  Download,
  FileSpreadsheet,
  Phone,
  Shield,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  profile_image?: string | null;
  bio?: string | null;
  preferred_role?: string | null;
  assigned_role?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  profile_completed?: boolean;
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
  description?: string | null;
  image_url?: string | null;
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

  // Export to CSV function
  const exportToCSV = () => {
    if (applicants.length === 0) return;

    const headers = ["Name", "Email", "Discord", "Phone", "Over 18", "Applied On"];
    const rows = applicants.map((a) => [
      `${a.first_name} ${a.last_name}`,
      a.email,
      a.discord_handle,
      a.phone_number,
      a.is_over_18 ? "Yes" : "No",
      new Date(a.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ccc-esports-applicants-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <LoadingIndicator text="Loading applicants..." />;
  if (error) return <ErrorIndicator message={error} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="w-6 h-6" /> Applicant Queue
              </CardTitle>
              <CardDescription>
                Review and process all incoming user applications.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={applicants.length === 0}
              className="cursor-pointer gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export to CSV
              <Download className="w-4 h-4" />
            </Button>
          </div>
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
  const [newGameDescription, setNewGameDescription] = useState("");
  const [newGameImage, setNewGameImage] = useState<File | null>(null);
  const [newGameImagePreview, setNewGameImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit state
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editName, setEditName] = useState("");
  const [editMax, setEditMax] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = (file: File) => {
    setNewGameImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setNewGameImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleImageSelect(file);
  };

  // Edit image handlers
  const handleEditImageSelect = (file: File) => {
    setEditImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setEditImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleEditImageSelect(file);
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleEditImageSelect(file);
  };

  const openEditDialog = (game: Game) => {
    setEditingGame(game);
    setEditName(game.name);
    setEditMax(String(game.max_players_per_team));
    setEditDescription(game.description || "");
    setEditImagePreview(game.image_url || null);
    setEditImage(null);
  };

  const closeEditDialog = () => {
    setEditingGame(null);
    setEditName("");
    setEditMax("");
    setEditDescription("");
    setEditImage(null);
    setEditImagePreview(null);
  };

  const createGame = async () => {
    if (!newGameName || !newGameMax)
      return console.error("Please fill required fields.");
    setIsCreating(true);
    try {
      // First create the game
      const res = await fetch("/api/teams-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_GAME",
          payload: {
            name: newGameName,
            max_players_per_team: Number(newGameMax),
            description: newGameDescription || null,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to create game.");

      // If image was selected, upload it
      if (newGameImage && data.data?.id) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", newGameImage);
        formData.append("gameId", data.data.id);

        await fetch("/api/games/upload", {
          method: "POST",
          body: formData,
        });
      }

      // Reset form
      setNewGameName("");
      setNewGameMax("");
      setNewGameDescription("");
      setNewGameImage(null);
      setNewGameImagePreview(null);
      setShowCreateDialog(false);
      fetchGames();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsCreating(false);
      setIsUploading(false);
    }
  };

  const updateGame = async () => {
    if (!editingGame || !editName || !editMax) return;
    setIsUpdating(true);
    try {
      // Update game info
      const res = await fetch("/api/teams-games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingGame.id,
          name: editName,
          max_players_per_team: Number(editMax),
          description: editDescription || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to update game.");

      // If new image was selected, upload it
      if (editImage) {
        const formData = new FormData();
        formData.append("file", editImage);
        formData.append("gameId", editingGame.id);

        await fetch("/api/games/upload", {
          method: "POST",
          body: formData,
        });
      }

      closeEditDialog();
      fetchGames();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsUpdating(false);
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
    }
  };

  if (isLoading) return <LoadingIndicator text="Loading games..." />;
  if (error) return <ErrorIndicator message={error} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Gamepad2 className="w-5 h-5" /> Game Management
            </CardTitle>
            <CardDescription>Manage all games, descriptions, and images.</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Game
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gameName">Game Name *</Label>
                  <Input
                    id="gameName"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    placeholder="e.g. Valorant, League of Legends"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPlayers">Max Players per Team *</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    value={newGameMax}
                    onChange={(e) => setNewGameMax(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <Label htmlFor="gameDescription">Description</Label>
                  <textarea
                    id="gameDescription"
                    className="w-full min-h-[80px] p-3 text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    value={newGameDescription}
                    onChange={(e) => setNewGameDescription(e.target.value)}
                    placeholder="Describe the game and your team's involvement..."
                  />
                </div>
                <div>
                  <Label>Game Image</Label>
                  <div
                    className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {newGameImagePreview ? (
                      <div className="relative">
                        <img
                          src={newGameImagePreview}
                          alt="Preview"
                          className="max-h-32 mx-auto rounded-lg object-cover"
                        />
                        <p className="text-xs text-muted-foreground mt-2">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click or drag image to upload</p>
                        <p className="text-xs">JPEG, PNG, WebP, GIF (max 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createGame} disabled={isCreating || isUploading} className="cursor-pointer">
                  {isCreating || isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Creating..."}
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
              No games yet. Click "Add Game" to create one.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((g) => (
                <Card key={g.id} className="overflow-hidden group">
                  {g.image_url ? (
                    <div className="h-32 overflow-hidden bg-muted">
                      <img
                        src={g.image_url}
                        alt={g.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Gamepad2 className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEditDialog(g)}>
                        <h3 className="font-bold text-lg truncate">{g.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {g.teams?.length || 0} teams • Max {g.max_players_per_team} players
                        </p>
                        {g.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {g.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                          onClick={() => openEditDialog(g)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                          onClick={() => setShowConfirmDelete(g.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  {showConfirmDelete === g.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      onClick={() => setShowConfirmDelete(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Card className="p-6 max-w-sm">
                          <h3 className="font-semibold mb-3">Confirm Deletion</h3>
                          <p className="text-sm mb-4">
                            Are you sure you want to delete "{g.name}"? This will also delete all teams and unassign players.
                          </p>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowConfirmDelete(null)} className="cursor-pointer">
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => deleteGame(g.id)} className="cursor-pointer">
                              Delete
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Game Dialog */}
      {editingGame && (
        <Dialog open={!!editingGame} onOpenChange={(open) => !open && closeEditDialog()}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Game</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editGameName">Game Name *</Label>
                <Input
                  id="editGameName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Valorant, League of Legends"
                />
              </div>
              <div>
                <Label htmlFor="editMaxPlayers">Max Players per Team *</Label>
                <Input
                  id="editMaxPlayers"
                  type="number"
                  value={editMax}
                  onChange={(e) => setEditMax(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <Label htmlFor="editGameDescription">Description</Label>
                <textarea
                  id="editGameDescription"
                  className="w-full min-h-[80px] p-3 text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe the game and your team's involvement..."
                />
              </div>
              <div>
                <Label>Game Image</Label>
                <div
                  className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => editFileInputRef.current?.click()}
                  onDrop={handleEditDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {editImagePreview ? (
                    <div className="relative">
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-lg object-cover"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Click or drag image to upload</p>
                      <p className="text-xs">JPEG, PNG, WebP, GIF (max 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEditFileChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog} className="cursor-pointer">
                Cancel
              </Button>
              <Button onClick={updateGame} disabled={isUpdating} className="cursor-pointer">
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
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
  const [showConfirmDeleteGame, setShowConfirmDeleteGame] = useState<string | null>(null);
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

  const deleteGame = async (id: string) => {
    setShowConfirmDeleteGame(null);
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer hover:scale-110 transition-all"
                      onClick={() => setShowConfirmDeleteGame(game.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </h2>

                  {/* Delete Game Confirmation Dialog */}
                  {showConfirmDeleteGame === game.id && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      onClick={() => setShowConfirmDeleteGame(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Card className="p-6 w-full max-w-md border-destructive/30 shadow-2xl">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                              <Gamepad2 className="w-6 h-6 text-destructive" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2">
                                Delete Game
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{game.name}&quot;</span>?
                              </p>
                              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
                                <p className="text-sm text-destructive font-medium">⚠️ This will permanently:</p>
                                <ul className="text-sm text-muted-foreground mt-1 ml-4 list-disc">
                                  <li>Delete all {game.teams.length} team(s) in this game</li>
                                  <li>Remove {game.teams.reduce((acc, t) => acc + (t.users?.length || 0), 0)} player(s) from their teams</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-2">Players will remain in the system but won&apos;t be on any team.</p>
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => setShowConfirmDeleteGame(null)}
                                  className="cursor-pointer hover:bg-muted transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => deleteGame(game.id)}
                                  className="cursor-pointer hover:bg-destructive/90 transition-all hover:scale-105"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Game
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
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
                                className="h-8 w-8 cursor-pointer hover:scale-110 transition-all"
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
                                          <div className="flex flex-wrap items-center gap-2 min-w-0">
                                            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <span className="font-medium truncate">{user.username}</span>
                                            <Badge
                                              variant={user.role === "ADMIN" ? "default" : "outline"}
                                              className="text-xs flex-shrink-0"
                                            >
                                              {user.role}
                                            </Badge>
                                            {user.assigned_role && (
                                              <Badge variant="secondary" className="text-xs">
                                                🎮 {user.assigned_role}
                                              </Badge>
                                            )}
                                            {user.preferred_role && !user.assigned_role && (
                                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                                Prefers: {user.preferred_role}
                                              </Badge>
                                            )}
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
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                onClick={() => setShowConfirmDelete(null)}
                              >
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                  animate={{ scale: 1, opacity: 1, y: 0 }}
                                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                  transition={{ type: "spring", duration: 0.3 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Card className="p-6 w-full max-w-md border-destructive/30 shadow-2xl">
                                    <div className="flex items-start gap-4">
                                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                                        <Trash2 className="w-6 h-6 text-destructive" />
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-2">
                                          Delete Team
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                          Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{team.name}&quot;</span>? 
                                          This will remove all {team.users?.length || 0} player(s) from this team. This action cannot be undone.
                                        </p>
                                        <div className="flex justify-end gap-3">
                                          <Button
                                            variant="outline"
                                            onClick={() => setShowConfirmDelete(null)}
                                            className="cursor-pointer hover:bg-muted transition-colors"
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            onClick={() => deleteTeam(team.id)}
                                            className="cursor-pointer hover:bg-destructive/90 transition-all hover:scale-105"
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Team
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                </motion.div>
                              </motion.div>
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
  // Export users to CSV
  const exportToCSV = () => {
    if (users.length === 0) return;

    const headers = [
      "Username",
      "Full Name",
      "Email",
      "Phone",
      "Role",
      "Preferred Role",
      "Assigned Role",
      "Joined Date",
      "Profile Completed",
    ];
    
    const rows = users.map((u: User) => [
      u.username,
      u.full_name || "N/A",
      u.email || "N/A",
      u.phone_number || "N/A",
      u.role,
      u.preferred_role || "N/A",
      u.assigned_role || "N/A",
      new Date(u.createdAt).toLocaleDateString(),
      u.profile_completed ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ccc-esports-users-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users2 className="w-6 h-6" /> User Management
            </CardTitle>
            <CardDescription>
              Manage all registered users, roles, and permissions.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={users.length === 0}
            className="cursor-pointer gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export to CSV
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingIndicator text="Fetching users..." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[300px]">User</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User) => (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted border overflow-hidden flex-shrink-0">
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              alt={user.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {user.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.full_name || "No name set"}
                          </span>
                          {user.profile_completed && (
                            <Badge variant="outline" className="w-fit mt-1 text-[10px] h-4 px-1 py-0 border-green-500/50 text-green-500">
                              Profile Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {user.email ? (
                          <div className="flex items-center gap-2 text-foreground/80">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {user.email}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">No email</span>
                        )}
                        {user.phone_number ? (
                          <div className="flex items-center gap-2 text-foreground/80">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {user.phone_number}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">No phone</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setToggleRoleUserId(user.id)}
                          disabled={user.id === currentUserId || isLoading}
                          className="h-8 px-2 text-muted-foreground hover:text-primary"
                          title="Toggle Admin Role"
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Role
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteUserId(user.id)}
                          disabled={user.id === currentUserId || isLoading}
                          className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// -------------------- PLAYERS TAB --------------------
function PlayersManagementTab({ users }: { users: User[] }) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    if (!selectedUser || !selectedTeamId) return;
    setIsAssigning(true);
    try {
      const res = await fetch("/api/teams-games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser.id,
          team_id: selectedTeamId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to assign player.");

      fetchData();
      setSelectedUser(null);
      setSelectedTeamId(null);
      setShowAssignModal(false);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsAssigning(false);
    }
  };

  const removePlayer = async (userId: string) => {
    setIsRemoving(userId);
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

      fetchData();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsRemoving(null);
    }
  };

  const openAssignModal = (user: User) => {
    setSelectedUser(user);
    setSelectedTeamId(null);
    setShowAssignModal(true);
  };

  if (isLoading)
    return <LoadingIndicator text="Loading teams and players..." />;
  if (error) return <ErrorIndicator message={error} />;

  const availableTeams = games.flatMap((g) => 
    g.teams.map(t => ({ ...t, gameName: g.name, maxPlayers: g.max_players_per_team }))
  );

  // Filter users based on search
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get users who are not assigned to any team
  const unassignedUsers = filteredUsers.filter(u => 
    !games.some(g => g.teams.some(t => t.users?.some(tu => tu.id === u.id)))
  );

  // Get all assigned users with their team info
  const assignedUsers = games.flatMap(g => 
    g.teams.flatMap(t => 
      (t.users || []).map(u => ({ ...u, teamName: t.name, gameName: g.name, teamId: t.id }))
    )
  ).filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" /> Players Management
            </CardTitle>
            <CardDescription className="text-sm">
              Assign players to teams and view current rosters
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Unassigned Players Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Available Players 
              <Badge variant="secondary">{unassignedUsers.length}</Badge>
            </h3>
            
            {unassignedUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 bg-muted/30 rounded-lg">
                {searchQuery ? "No matching unassigned players" : "All players are assigned to teams"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {unassignedUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => openAssignModal(user)}>
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border-2 border-primary/20 flex-shrink-0">
                            {user.profile_image ? (
                              <img
                                src={user.profile_image}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{user.username}</p>
                            {user.preferred_role && (
                              <p className="text-xs text-primary">{user.preferred_role}</p>
                            )}
                          </div>
                          <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {user.bio && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{user.bio}</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Team Rosters Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-primary" />
              Team Rosters
            </h3>
            
            <div className="space-y-6">
              {games.map((game) => (
                <div key={game.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-primary/10 px-4 py-3 flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                    <span className="font-bold">{game.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Max {game.max_players_per_team} per team
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {game.teams.map((team) => (
                      <Card key={team.id} className="bg-muted/20">
                        <CardHeader className="py-3 px-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">{team.name}</CardTitle>
                            <Badge 
                              variant={(team.users?.length || 0) >= game.max_players_per_team ? "default" : "secondary"}
                              className={(team.users?.length || 0) >= game.max_players_per_team ? "bg-green-600" : ""}
                            >
                              {team.users?.length || 0}/{game.max_players_per_team}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          {team.users && team.users.length > 0 ? (
                            <div className="space-y-2">
                              {team.users.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center gap-3 p-2 bg-background rounded-lg border group"
                                >
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                    {user.profile_image ? (
                                      <img
                                        src={user.profile_image}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.username}</p>
                                    {user.assigned_role && (
                                      <p className="text-xs text-primary">{user.assigned_role}</p>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                    onClick={() => removePlayer(user.id)}
                                    disabled={isRemoving === user.id}
                                  >
                                    {isRemoving === user.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <UserMinus className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No players assigned
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assign Player Modal */}
      {showAssignModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAssignModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card className="shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Assign Player to Team
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Player Profile Card */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-muted border-2 border-primary/30 flex-shrink-0">
                    {selectedUser.profile_image ? (
                      <img
                        src={selectedUser.profile_image}
                        alt={selectedUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{selectedUser.username}</h3>
                    {selectedUser.preferred_role && (
                      <Badge variant="secondary" className="mt-1">
                        Prefers: {selectedUser.preferred_role}
                      </Badge>
                    )}
                    {selectedUser.bio && (
                      <p className="text-sm text-muted-foreground mt-2">{selectedUser.bio}</p>
                    )}
                    {!selectedUser.bio && !selectedUser.preferred_role && (
                      <p className="text-sm text-muted-foreground mt-1 italic">No profile info set</p>
                    )}
                  </div>
                </div>

                {/* Team Selection */}
                <div className="space-y-2">
                  <Label htmlFor="teamSelect">Select Team</Label>
                  <Select onValueChange={setSelectedTeamId} value={selectedTeamId || ""}>
                    <SelectTrigger id="teamSelect">
                      <SelectValue placeholder="Choose a team..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((team) => {
                        const isFull = (team.users?.length || 0) >= team.maxPlayers;
                        return (
                          <SelectItem 
                            key={team.id} 
                            value={team.id}
                            disabled={isFull}
                          >
                            <span className="flex items-center gap-2">
                              {team.gameName} - {team.name}
                              {isFull && <span className="text-xs text-muted-foreground">(Full)</span>}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={assignPlayer}
                    disabled={!selectedTeamId || isAssigning}
                    className="flex-1 cursor-pointer"
                  >
                    {isAssigning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign to Team
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
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
