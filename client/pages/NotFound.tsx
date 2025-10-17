import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold gradient-text mb-4">404</h1>
        <p className="text-base text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">Return home</a>
      </div>
    </div>
  );
};

export default NotFound;
