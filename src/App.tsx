
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/homes" element={<Homes />} />
            <Route path="/villas" element={<Homes />} /> {/* Redirect old route */}
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:id" element={<Destination />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/home/:id" element={<Property />} />
            <Route path="/property/:id" element={<Property />} /> {/* Redirect old route */}
            <Route path="/experience/:id" element={<Experience />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/messages" element={<Messages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
