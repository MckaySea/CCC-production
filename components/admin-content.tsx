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
  Shield,
  UserIcon,
  Plus,
  Loader2,
  Mail,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";

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

interface AdminContentProps {
  activeTab: AdminTab;
  users: User[];
  currentUserId: string;
  isLoading: boolean;
  setDeleteUserId: (id: string | null) => void;
  setToggleRoleUserId: (id: string | null) => void;
}

// Helper component for loading state
const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-16 text-primary">
    <Loader2 className="w-8 h-8 animate-spin mr-2" />
    <p className="text-lg">Loading applicants...</p>
  </div>
);

// Helper component for error state
const ErrorIndicator = ({ message }: { message: string }) => (
  <div className="text-center py-16 text-destructive">
    <p className="text-xl font-semibold mb-2">Error Loading Data</p>
    <p className="text-sm">{message}</p>
    <p className="text-sm mt-4">Please check the server logs.</p>
  </div>
);

function ApplicantsManagementTab() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch applicants data from the new API route
    const fetchApplicants = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/join"); // Fetch from the new GET endpoint
        const result = await response.json();

        if (response.ok && result.success) {
          setApplicants(result.data);
        } else {
          // Handle API error messages
          throw new Error(result.message || "Failed to fetch applicants data.");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("Fetch Applicants Error:", err.message);
        } else {
          setError("An unknown error occurred.");
          console.error("Fetch Applicants Error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="w-6 h-6" /> Applicant Queue
              </CardTitle>
              <CardDescription className="mt-2">
                Review and process all incoming user applications.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {applicants.length} Applications
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading && <LoadingIndicator />}
          {error && <ErrorIndicator message={error} />}
          {!isLoading && !error && (
            <div className="rounded-lg border border-border overflow-auto max-h-[70vh]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0">
                    <TableHead className="font-semibold w-[150px]">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold w-[200px]">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold w-[150px]">
                      Discord
                    </TableHead>
                    <TableHead className="font-semibold w-[150px]">
                      Phone
                    </TableHead>
                    <TableHead className="font-semibold text-center w-[100px]">
                      Over 18
                    </TableHead>
                    <TableHead className="font-semibold w-[120px]">
                      Applied On
                    </TableHead>
                    <TableHead className="text-right font-semibold w-[100px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.length === 0 ? (
                    <TableRow key="empty-applications">
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No new applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    applicants.map((applicant, index) => (
                      <motion.tr
                        // FIX: Explicitly converting the number ID to a string to ensure no list key conflicts.
                        key={String(applicant.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {applicant.first_name} {applicant.last_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {applicant.email}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {applicant.discord_handle}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {applicant.phone_number}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              applicant.is_over_18 ? "default" : "destructive"
                            }
                            className="w-16 justify-center"
                          >
                            {applicant.is_over_18 ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(applicant.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                            onClick={() =>
                              (window.location.href = `mailto:${applicant.email}`)
                            }
                            title="Reply to Applicant"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          {/* Add more actions here (e.g., Delete/Archive) */}
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">User Management</CardTitle>
              <CardDescription className="mt-2">
                View and manage all registered users and their permissions.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {users.length} Users
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Username</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User, index: number) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                        className="gap-1"
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <UserIcon className="w-3 h-3" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToggleRoleUserId(user.id)}
                        disabled={user.id === currentUserId || isLoading}
                        className="border-border hover:bg-accent"
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
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TeamsManagementTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Team Management</CardTitle>
              <CardDescription className="mt-2">
                Create, edit, and remove team rosters for competitions.
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Team
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No teams yet</p>
            <p className="text-sm">Create your first team to get started</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlayersManagementTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Player Management</CardTitle>
              <CardDescription className="mt-2">
                Add, remove, and assign players to teams and manage their
                profiles.
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Player
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No players yet</p>
            <p className="text-sm">Add your first player to get started</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GamesManagementTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Game Management</CardTitle>
              <CardDescription className="mt-2">
                Add and remove supported esports titles for your platform.
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Game
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No games yet</p>
            <p className="text-sm">
              Add your first supported game to get started
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
    case "Applicants": // <-- New Tab Case Added
      return <ApplicantsManagementTab />;
    case "Teams":
      return <TeamsManagementTab />;
    case "Players":
      return <PlayersManagementTab />;
    case "Games":
      return <GamesManagementTab />;
    default:
      return null;
  }
}
