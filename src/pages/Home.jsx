import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// ✅ Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // ✅ Add more templates later (can grow to 50+)
    setTemplates([
      {
        id: 1,
        title: "Paris Getaway",
        description: "A romantic 5-day trip exploring Paris, museums, and cafes.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
        tag: "Luxury",
      },
      {
        id: 2,
        title: "Thailand Backpacking",
        description: "2-week budget backpacking trip across Thailand’s beaches & temples.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        tag: "Budget",
      },
      {
        id: 3,
        title: "Swiss Alps Family Trip",
        description: "7-day scenic family-friendly tour of Swiss Alps & villages.",
        image: "https://images.unsplash.com/photo-1508264165352-258a6c1e50ac",
        tag: "Family",
      },
      {
        id: 4,
        title: "Tokyo Explorer",
        description: "5-day cultural deep dive into Tokyo’s food & tech districts.",
        image: "https://images.unsplash.com/photo-1549693578-d683be217e58",
        tag: "Cultural",
      },
      {
        id: 5,
        title: "Dubai Luxury Trip",
        description: "Experience 7-star hotels, desert safari, and modern marvels.",
        image: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a",
        tag: "Luxury",
      },
    ]);
  }, []);

  return (
    <main
      className="flex flex-col items-center gap-12 min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      {/* Hero Section */}
      <section className="text-center space-y-6 mt-20 bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md max-w-2xl">
        <h1 className="text-red-500 font-extrabold text-4xl">
          Discover Your Next Adventure with AI
        </h1>
        <p className="text-xl text-gray-700">
          Personalized itineraries at your fingertips — save trips, plan routes,
          and explore with OpenStreetMap.
        </p>
        <div className="flex justify-center gap-3">
          <Link className="btn btn-primary" to="/register">
            Get Started
          </Link>
          <Link className="btn" to="/login">
            Sign In
          </Link>
        </div>
      </section>

      {/* Swiper Templates Carousel */}
      <section className="w-full max-w-6xl px-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow">
          Popular Travel Templates ✈️
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {templates.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="border rounded-xl bg-white shadow-md overflow-hidden hover:scale-105 transition-transform">
                <img
                  src={t.image}
                  alt={t.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{t.title}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {t.description}
                  </p>
                  <Link
                    to="/templates"
                    className="btn btn-primary w-full mt-2 text-sm"
                  >
                    View Template
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-6">
          <Link to="/templates" className="btn">
            Explore All Templates →
          </Link>
        </div>
      </section>
    </main>
  );
}
