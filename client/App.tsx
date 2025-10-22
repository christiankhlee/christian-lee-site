import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/layout/Layout";
import Thoughts from "./pages/Thoughts";
import Music from "./pages/Music";
import Moodboard from "./pages/Moodboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/thoughts" element={<Thoughts />} />
            <Route path="/music" element={<Music />} />
            <Route path="/moodboard" element={<Moodboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");
let root: ReturnType<typeof createRoot> | undefined = (container as any).__app_root;
if (!root) {
  root = createRoot(container);
  (container as any).__app_root = root;
}
root.render(<App />);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    try { root?.unmount(); } catch {}
  });
}
