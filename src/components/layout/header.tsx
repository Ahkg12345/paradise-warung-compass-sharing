import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowRightFromLine, Clock3, Menu as MenuIcon, Utensils, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { id } from "@/lib/i18n/id";
import { formatDateTimeWib } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

export type StaffRole = "admin" | "cashier";

type HeaderProps = {
  role: StaffRole;
  name: string;
  username: string;
  queueCount?: number;
};

type NavigationItem = {
  label: string;
  to:
    | "/dasbor"
    | "/kasir"
    | "/antrian"
    | "/riwayat"
    | "/tutup-kasir"
    | "/menu"
    | "/keuangan"
    | "/laporan"
    | "/performa-menu"
    | "/pengguna"
    | "/pengaturan";
  roles: StaffRole[];
  queue?: boolean;
};

const adminNavigation: NavigationItem[] = [
  { label: id.navigation.dashboard, to: "/dasbor", roles: ["admin", "cashier"] },
  { label: id.navigation.cashier, to: "/kasir", roles: ["admin", "cashier"] },
  { label: id.navigation.queue, to: "/antrian", roles: ["admin", "cashier"], queue: true },
  { label: id.navigation.history, to: "/riwayat", roles: ["admin", "cashier"] },
  { label: id.navigation.cashClosing, to: "/tutup-kasir", roles: ["admin", "cashier"] },
  { label: id.navigation.menu, to: "/menu", roles: ["admin"] },
  { label: id.navigation.finance, to: "/keuangan", roles: ["admin"] },
  { label: id.navigation.reports, to: "/laporan", roles: ["admin"] },
  { label: id.navigation.menuPerformance, to: "/performa-menu", roles: ["admin"] },
  { label: id.navigation.users, to: "/pengguna", roles: ["admin"] },
  { label: id.navigation.settings, to: "/pengaturan", roles: ["admin"] },
];

export function Header({ role, name, username, queueCount = 0 }: HeaderProps) {
  const [now, setNow] = useState(() => new Date(0));
  const [online, setOnline] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const visibleNavigation = adminNavigation.filter((item) => item.roles.includes(role));
  const initials = username.charAt(0).toUpperCase();

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine);
    updateStatus();
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  async function handleLogout() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  }

  return (
    <header className="app-header">
      <div className="header-primary">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Utensils size={25} strokeWidth={2.25} />
          </div>
          <div className="brand-copy">
            <span className="brand-name">KEDAI PARADISE</span>
            <span className="brand-address">Kandang Gampang, Purbalingga</span>
          </div>
        </div>

        <div className="header-tools">
          <div className="clock-readout" aria-label="Waktu WIB">
            <Clock3 size={17} aria-hidden="true" />
            <span>
              {now.getTime() === 0
                ? "--/--/---- --:--:-- WIB"
                : `${formatDateTimeWib(now).replace(" WIB", `:${String(now.getSeconds()).padStart(2, "0")} WIB`)}`}
            </span>
          </div>
          <div className={`connection-pill ${online ? "is-online" : "is-offline"}`}>
            <span className="connection-dot" />
            {online ? id.header.online : id.header.offline}
          </div>
          <Link className="staff-profile" to="/akun" aria-label={`${name}, ${id.header.account}`}>
            <span className="staff-copy">
              <span className="staff-name">{name}</span>
              <span className="role-badge">{id.roles[role]}</span>
            </span>
            <span className="staff-avatar" aria-hidden="true">
              {initials}
            </span>
          </Link>
          <Button className="logout-button" variant="outline" onClick={handleLogout}>
            <ArrowRightFromLine aria-hidden="true" />
            <span>{id.header.logout}</span>
          </Button>
          <Button
            className="mobile-menu-button"
            variant="outline"
            size="icon"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      <nav className={`header-navigation ${menuOpen ? "is-open" : ""}`} aria-label="Navigasi utama">
        {visibleNavigation.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`navigation-link ${active ? "is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span>{item.label}</span>
              {item.queue && queueCount > 0 ? (
                <span className="queue-count">{queueCount}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div
        className="mobile-navigation-backdrop"
        hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}
