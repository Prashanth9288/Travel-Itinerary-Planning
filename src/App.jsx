import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateTrip from "./pages/CreateTrip.jsx";
import ViewTrip from "./pages/ViewTrip.jsx";
import Templates from "./pages/Templates.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Footer from "./components/Footer.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <Link to="/" className="font-bold text-xl">
        🧭 Trip Explorer
      </Link>
      <div className="flex gap-3 items-center">
        <Link className="btn" to="/templates">
          Templates
        </Link>
        <Link className="btn" to="/profile">
          Profile
        </Link>
        {user ? (
          <>
            <Link className="btn" to="/dashboard">
              Dashboard
            </Link>
            <Link className="btn btn-primary" to="/create">
              Create Trip
            </Link>
            <button onClick={logout} className="btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn" to="/login">
              Sign In
            </Link>
            <Link className="btn btn-primary" to="/register">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      {/* ✅ Full-page flex layout */}
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main content grows to push footer down */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip/:id"
              element={
                <ProtectedRoute>
                  <ViewTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer stays at bottom */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
