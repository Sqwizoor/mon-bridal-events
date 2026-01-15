"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Warehouse,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
  LayoutGrid,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "next-themes";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Inquiries & Bookings",
    href: "/admin/inquiries",
    icon: CalendarCheck,
  },
  {
    title: "Jewelry Shop",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Hiring Catalog",
    href: "/admin/hiring-items",
    icon: LayoutGrid,
  },
  {
    title: "Hire Requests",
    href: "/admin/event-hiring",
    icon: Sparkles,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: LayoutGrid,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Stock Management",
    href: "/admin/stock",
    icon: Warehouse,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden cursor-pointer"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center space-x-2 cursor-pointer">
              <Image 
                src="/mon-bridal.jpeg" 
                alt="MON Bridal Admin" 
                width={180} 
                height={60} 
                className="w-auto h-12 object-contain rounded-full"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent cursor-pointer",
                    isActive
                      ? "bg-linear-to-r from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.title}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & Footer */}
          <div className="border-t p-4 space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              © 2026 MON Bridal & Events
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
