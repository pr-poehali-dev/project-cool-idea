
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Cabinet from "./pages/Cabinet";
import Shop from "./pages/Shop";
import Windows from "./pages/shop/Windows";
import Doors from "./pages/shop/Doors";
import Fence from "./pages/shop/Fence";
import Mixtures from "./pages/shop/Mixtures";
import Concrete from "./pages/shop/Concrete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/windows" element={<Windows />} />
          <Route path="/shop/doors" element={<Doors />} />
          <Route path="/shop/fence" element={<Fence />} />
          <Route path="/shop/mixtures" element={<Mixtures />} />
          <Route path="/shop/concrete" element={<Concrete />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;