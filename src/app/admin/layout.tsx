"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/produits": "Produits",
  "/admin/categories": "Catégories",
  "/admin/commandes": "Commandes",
  "/admin/promo-codes": "Code Promo",
  "/admin/testimonials": "Témoignages",
  "/admin/messages": "Messages",
  "/admin/parametres": "Paramètres",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/admin/login") {
        setIsLoading(false);
        return;
      }
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      const { data } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .single();
      if (!data) {
        router.push("/admin/login");
        return;
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] || "Admin";

  return (
    <div className="min-h-screen bg-darker">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <AdminHeader
          onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
          title={title}
        />
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <Sidebar
            isCollapsed={false}
            onToggle={() => setIsMobileOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
