import { Outlet, Link, useLocation } from "react-router";
import { Button } from "./components/ui/button";
import { Shield } from "lucide-react";

export default function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <header className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="8" fill="#2563eb" />
                <path
                  d="M20 8L27 13V20L20 25L13 20V13L20 8Z"
                  fill="white"
                  opacity="0.9"
                />
                <path
                  d="M20 15L24 17.5V22.5L20 25L16 22.5V17.5L20 15Z"
                  fill="#dbeafe"
                />
                <circle cx="20" cy="20" r="3" fill="#2563eb" />
                <path
                  d="M12 28H28M14 32H26"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <h1 className="text-2xl text-primary">Đại đội 12</h1>
                {/* <p className="text-sm text-muted-foreground">Organization Management</p> */}
              </div>
            </div>

            {/* Center: Navigation Buttons */}
            <nav className="flex items-center gap-2">
              <Link to="/">
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  className={location.pathname === "/" ? "" : "text-muted-foreground"}
                >
                  Hồ sơ đoàn viên
                </Button>
              </Link>
              <Link to="/fees">
                <Button
                  variant={location.pathname === "/fees" ? "default" : "ghost"}
                  className={location.pathname === "/fees" ? "" : "text-muted-foreground"}
                >
                  Thu chi đoàn phí
                </Button>
              </Link>
            </nav>

            {/* Right: User Info */}
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-muted-foreground mr-4 hidden md:block">
                Quản lý Đoàn viên
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}