// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listenToTripsByUser, deleteTrip } from "../services/trips";

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsub = listenToTripsByUser(user.uid, setTrips, (e) => setError(e.message));
    return () => unsub();
  }, [user]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Trips</h2>
        <Link to="/create" className="btn btn-primary">Create Trip</Link>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl">{error}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {trips.map(t => (
          <Link key={t.id} to={`/trip/${t.id}`} className="card hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {t.title || t.destination?.name || "Untitled trip"}
                </h3>
                <p className="text-gray-600 text-sm">{t.destination?.name || t.name}</p>
                <div className="text-sm text-gray-500 mt-2">{t.startDate} → {t.endDate}</div>
              </div>
              <button
                className="text-red-500 text-sm"
                onClick={(e) => { e.preventDefault(); deleteTrip(t.id); }}
              >
                Delete
              </button>
            </div>
          </Link>
        ))}
        {trips.length === 0 && <div className="text-gray-500">No trips yet. Create your first one!</div>}
      </div>
    </main>
  );
}
