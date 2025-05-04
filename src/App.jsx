import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import CustomerSupportChat from "./pages/CustomerService";
import StockTracker from "./pages/Stock";
import CryptoTracker from "./pages/Crypto";
import Login from "./pages/Login";
import Register from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { initializeSupabase } from "./services/userService";
import { useEffect } from "react";
import CustomerServiceChat from "./pages/adminChat";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Initialize the file service at app startup
    const initApp = async () => {
      try {
        const success = await initializeSupabase();
        if (success) {
          console.log("File service connected successfully!");
        } else {
          console.log("Using localStorage only - file service not available");
        }
      } catch (error) {
        console.error("Error initializing file service:", error);
      }
    };

    initApp();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <CustomerServiceChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cs"
            element={
              <ProtectedRoute>
                <CustomerSupportChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <StockTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cryptos"
            element={
              <ProtectedRoute>
                <CryptoTracker />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
