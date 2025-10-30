"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Shield, UserIcon } from "lucide-react"
import { Navbar } from "./navbar"

interface User {
  id: string
  username: string
  role: string
  createdAt: Date
}

interface AdminDashboardProps {
  users: User[]
  currentUserId: string
}

export function AdminDashboard({ users, currentUserId }: AdminDashboardProps) {
  const router = useRouter()
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [toggleRoleUserId, setToggleRoleUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteUser = async () => {
    if (!deleteUserId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${deleteUserId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
        setDeleteUserId(null)
      } else {
        alert("Failed to delete user")
      }
    } catch (error) {
      console.error("[v0] Delete user error:", error)
      alert("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleRole = async () => {
    if (!toggleRoleUserId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${toggleRoleUserId}/role`, {
        method: "PATCH",
      })

      if (response.ok) {
        router.refresh()
        setToggleRoleUserId(null)
      } else {
        alert("Failed to update user role")
      }
    } catch (error) {
      console.error("[v0] Toggle role error:", error)
      alert("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and their roles</p>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-primary/20">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                            {user.role === "ADMIN" ? (
                              <Shield className="w-3 h-3 mr-1" />
                            ) : (
                              <UserIcon className="w-3 h-3 mr-1" />
                            )}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setToggleRoleUserId(user.id)}
                            disabled={user.id === currentUserId}
                            className="border-primary/20 hover:bg-primary/10"
                          >
                            Toggle Role
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteUserId(user.id)}
                            disabled={user.id === currentUserId}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Role Confirmation Dialog */}
      <AlertDialog open={!!toggleRoleUserId} onOpenChange={() => setToggleRoleUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Toggle User Role</AlertDialogTitle>
            <AlertDialogDescription>This will change the user's role between USER and ADMIN.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleRole} disabled={isLoading}>
              {isLoading ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
