import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Home, Info, MessageCircle, LayoutDashboard, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserProfile from "@/components/UserProfile";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: MessageCircle },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <Mail className="h-8 w-8 text-primary" />
            <span className="gradient-hero bg-clip-text text-transparent">
              MultiMail
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="transition-smooth"
                >
                  <Link to={item.path} className="flex items-center space-x-1">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* User Profile or Login Button */}
          {user ? (
            <UserProfile />
          ) : (
            <Button variant="email" size="sm" asChild>
              <Link to="/login" className="flex items-center space-x-1">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;