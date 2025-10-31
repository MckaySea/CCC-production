"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Swords, UserIcon, Gamepad2, Menu, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab = "Users" | "Teams" | "Players" | "Games" | "Applicants";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const tabs: { name: AdminTab; icon: React.ElementType; description: string }[] =
  [
    { name: "Users", icon: Users, description: "Manage user accounts" },
    { name: "Teams", icon: Swords, description: "Manage team rosters" },
    { name: "Players", icon: UserIcon, description: "Manage player profiles" },
    { name: "Games", icon: Gamepad2, description: "Manage supported games" },
    { name: "Applicants", icon: Mail, description: "Manage applicants" },
  ];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg hover:bg-accent transition-colors"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {(isMobileOpen || isDesktop) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed md:sticky top-24 left-0 h-[calc(100vh-6rem)] bg-card border-r border-border z-40 flex flex-col shadow-xl md:shadow-none transition-all duration-300",
              isCollapsed ? "w-20" : "w-72"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold text-lg"
                  >
                    Dashboard
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.name;
                const Icon = tab.icon;

                return (
                  <motion.button
                    key={tab.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onTabChange(tab.name);
                      setIsMobileOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-accent text-foreground hover:translate-x-1"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-3 flex-1">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 flex-shrink-0",
                            isActive && "drop-shadow-md"
                          )}
                        />
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-start flex-1"
                          >
                            <span className="font-medium text-sm">
                              {tab.name}
                            </span>
                            <span
                              className={cn(
                                "text-xs",
                                isActive
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              )}
                            >
                              {tab.description}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {isActive && !isCollapsed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary-foreground relative z-10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-xs text-muted-foreground"
                  >
                    <p className="font-medium mb-1">Admin Panel v1.0</p>
                    <p>Manage your esports platform</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30 top-24"
        />
      )}
    </>
  );
}
