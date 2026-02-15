import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, MessageSquare } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F65551474d42d4acfa8fd16cdaf66a0f2%2F4228715ecc0144db9cc3b830849c3dd0?format=webp&width=800&height=1200"
              alt="IntentBot Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              IntentBot
            </span>
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-bold text-primary/20 mb-2">
              404
            </h1>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Page Not Found
            </h2>
          </div>

          <p className="text-lg text-foreground/70 mb-8">
            Oops! It seems like you've wandered into uncharted territory. This
            page doesn't exist yet. Let's get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-muted/50 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Go to Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 bg-white text-center text-foreground/60 text-sm">
        Requested: <code className="font-mono text-xs">{location.pathname}</code>
      </footer>
    </div>
  );
};

export default NotFound;
