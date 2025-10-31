"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminSidebar, AdminTab } from "./admin-sidebar";
import { AdminContent } from "./admin-content";

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

interface AdminDashboardProps {
  users: User[];
  currentUserId: string;
}

export function AdminDashboard({ users, currentUserId }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("Users");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [toggleRoleUserId, setToggleRoleUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${deleteUserId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
        setDeleteUserId(null);
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRole = async () => {
    if (!toggleRoleUserId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users/${toggleRoleUserId}/role`,
        { method: "PATCH" }
      );

      if (response.ok) {
        router.refresh();
        setToggleRoleUserId(null);
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error("Toggle role error:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <div className="flex">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 p-8 md:ml-0 overflow-x-hidden">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your platform content, users, and settings.
                </p>
              </motion.div>

              <AdminContent
                activeTab={activeTab}
                users={users}
                currentUserId={currentUserId}
                isLoading={isLoading}
                setDeleteUserId={setDeleteUserId}
                setToggleRoleUserId={setToggleRoleUserId}
              />
            </main>
          </div>
        </div>
      </div>

      {/* Delete User Dialog */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Role Dialog */}
      <AlertDialog
        open={!!toggleRoleUserId}
        onOpenChange={() => setToggleRoleUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Toggle User Role</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the user's role between USER and ADMIN.
              {toggleRoleUserId &&
                users.find((u) => u.id === toggleRoleUserId) && (
                  <span className="block mt-3 p-3 bg-muted rounded-md">
                    Current role for{" "}
                    <strong>
                      {users.find((u) => u.id === toggleRoleUserId)?.username}
                    </strong>
                    :{" "}
                    <strong>
                      {users.find((u) => u.id === toggleRoleUserId)?.role}
                    </strong>
                  </span>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleRole} disabled={isLoading}>
              {isLoading ? "Updating..." : "Confirm Change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
