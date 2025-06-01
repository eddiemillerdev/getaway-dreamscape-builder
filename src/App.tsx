import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { scrollToTopImmediate } from "@/utils/scrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Homes from "./pages/Homes";
import Destinations from "./pages/Destinations";
import Destination from "./pages/Destination";
import ExperiencesPage from "./pages/ExperiencesPage";
import Property from "./pages/Property";
import Experience from "./pages/Experience";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle scroll to top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTopImmediate();
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/homes" element={<Homes />} />
            <Route path="/villas" element={<Homes />} /> {/* Redirect old route */}
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:id" element={<Destination />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/home/:id" element={<Property />} />
            <Route path="/experience/:id" element={<Experience />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
