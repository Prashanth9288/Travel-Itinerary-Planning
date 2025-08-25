
export default function Footer(){
  return (
    <footer className="mt-16 border-t">
      <div className="max-w-6xl mx-auto p-6 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© Trip Explorer — React • Vite • Tailwind • Firebase • OpenStreetMap • Wikipedia</p>
        <div className="flex gap-4">
          <a className="hover:underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>
          <a className="hover:underline" href="https://www.wikipedia.org/" target="_blank" rel="noreferrer">Wikipedia</a>
          <a className="hover:underline" href="https://leafletjs.com/" target="_blank" rel="noreferrer">Leaflet</a>
        </div>
      </div>
    </footer>
  )
}
