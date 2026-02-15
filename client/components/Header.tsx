import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-border dark:border-slate-800 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F65551474d42d4acfa8fd16cdaf66a0f2%2F4228715ecc0144db9cc3b830849c3dd0?format=webp&width=800&height=1200"
            alt="IntentBot Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg md:text-xl font-bold text-foreground hidden sm:inline">
            IntentBot
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <a
            href="#features"
            className="text-sm lg:text-base text-foreground/70 hover:text-foreground transition"
          >
            Features
          </a>
          <a
            href="#usecases"
            className="text-sm lg:text-base text-foreground/70 hover:text-foreground transition"
          >
            Use Cases
          </a>
          <a
            href="#benefits"
            className="text-sm lg:text-base text-foreground/70 hover:text-foreground transition"
          >
            Benefits
          </a>
          <Link
            to="/about"
            className="text-sm lg:text-base text-foreground/70 hover:text-foreground transition"
          >
            About
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition text-foreground/70 hover:text-foreground"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          <Link
            to="/login"
            className="text-sm lg:text-base text-foreground/70 hover:text-foreground transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-border dark:border-slate-800">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#usecases"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Use Cases
            </a>
            <a
              href="#benefits"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Benefits
            </a>
            <Link
              to="/about"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-2"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <Link
              to="/login"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-center hover:bg-primary/90 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
