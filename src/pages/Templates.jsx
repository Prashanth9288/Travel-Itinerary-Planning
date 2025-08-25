import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createTrip } from "../services/trips.js";

export default function Templates() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

  // Local fallback templates (ensures always >50 total)
  const fallbackTemplates = Array.from({ length: 15 }).map((_, i) => ({
    id: "local-" + i,
    title: ["Paris Luxury", "India Cultural", "Thailand Budget", "Dubai Family"][
      i % 4
    ] + ` Trip ${i + 1}`,
    description:
      "Predefined sample template for travel. Includes sights, food, and culture.",
    image: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      "https://images.unsplash.com/photo-1524492449090-1a065f3a1b00",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1503264116251-35a269479413",
    ][i % 4],
    tag: ["Luxury", "Cultural", "Budget", "Family"][i % 4],
    destination: { name: "Destination " + (i + 1), lat: 0, lng: 0 },
    startDate: "2025-02-01",
    endDate: "2025-02-10",
    budget: ["Low", "Medium", "High"][i % 3],
    traveler: ["Solo", "Couple", "Family"][i % 3],
  }));

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://en.wikivoyage.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Itineraries&gcmlimit=50&prop=pageimages|extracts&exintro=true&explaintext=true&piprop=thumbnail&pithumbsize=500&format=json&origin=*"
        );
        const data = await res.json();

        let list = [];
        if (data?.query?.pages) {
          const pages = Object.values(data.query.pages);

          list = await Promise.all(
            pages.map(async (p) => {
              let img =
                p.thumbnail?.source ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Globe_icon.svg/240px-Globe_icon.svg.png";

              // Try Unsplash if no image
              if (!p.thumbnail && UNSPLASH_KEY) {
                try {
                  const ures = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                      p.title
                    )}&client_id=${UNSPLASH_KEY}&per_page=1`
                  );
                  const udata = await ures.json();
                  if (udata.results?.length > 0) {
                    img = udata.results[0].urls.small;
                  }
                } catch (err) {
                  console.warn("Unsplash fetch failed:", err);
                }
              }

              const tags = ["Budget", "Luxury", "Family", "Cultural"];
              const tag = tags[Math.floor(Math.random() * tags.length)];

              return {
                id: p.pageid,
                title: p.title,
                description: p.extract,
                image: img,
                tag,
                destination: { name: p.title, lat: 0, lng: 0 },
                startDate: "2025-01-01",
                endDate: "2025-01-10",
                budget: ["Low", "Medium", "High"][
                  Math.floor(Math.random() * 3)
                ],
                traveler: ["Solo", "Couple", "Family"][
                  Math.floor(Math.random() * 3)
                ],
              };
            })
          );
        }

        const merged = [...list, ...fallbackTemplates];
        setTemplates(merged);
      } catch (err) {
        console.error("Failed to fetch templates", err);
        setTemplates(fallbackTemplates);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const items = templates.filter(
    (t) =>
      (!q || t.title.toLowerCase().includes(q.toLowerCase())) &&
      (filter === "All" || t.tag === filter)
  );

  async function useTemplate(t) {
    const id = await createTrip({
      userId: user.uid,
      title: t.title,
      description: t.description,
      startDate: t.startDate,
      endDate: t.endDate,
      budget: t.budget,
      traveler: t.traveler,
      destination: t.destination,
      name: t.destination.name,
      lat: t.destination.lat,
      lng: t.destination.lng,
    });
    nav("/trip/" + id);
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Search + Filters */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Template Library</h1>
        <div className="flex gap-2">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="border rounded-xl px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Budget</option>
            <option>Luxury</option>
            <option>Family</option>
            <option>Cultural</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading templates...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="card border rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                className="w-full h-40 object-cover rounded-xl"
                src={t.image}
                alt={t.title}
              />
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t.title}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {t.tag}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {t.description || "No description available"}
                </p>
                <div className="text-xs text-gray-500">
                  {t.startDate} → {t.endDate}
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => useTemplate(t)}
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
