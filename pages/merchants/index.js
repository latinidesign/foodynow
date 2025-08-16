import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function MerchantsList() {
  const [merchants, setMerchants] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar filtros y comercios al inicio
  useEffect(() => {
    fetchFilters();
  }, []);

  // Recargar comercios cuando cambien los filtros
  useEffect(() => {
    fetchMerchants();
  }, [city, category]);

  async function fetchFilters() {
    // Ciudades únicas
    const { data: cityData, error: cityError } = await supabase
      .from("merchants")
      .select("city", { distinct: true })
      .not("city", "is", null);

    // Categorías únicas
    const { data: catData, error: catError } = await supabase
      .from("merchants")
      .select("category", { distinct: true })
      .not("category", "is", null);

    if (!cityError && cityData) {
      const uniqueCities = [...new Set(cityData.map(c => c.city))];
      setCities(uniqueCities);
    }

    if (!catError && catData) {
      const uniqueCategories = [...new Set(catData.map(c => c.category))];
      setCategories(uniqueCategories);
    }
  }

  async function fetchMerchants() {
    setLoading(true);
    let query = supabase.from("merchants").select("*").order("name", { ascending: true });

    if (city) query = query.eq("city", city);
    if (category) query = query.eq("category", category);

    const { data, error } = await query;

    if (error) console.error("Error fetching merchants:", error);
    else setMerchants(data);

    setLoading(false);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Comercios</h1>

      {/* Filtros dinámicos */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Todas las ciudades</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <p>Cargando comercios...</p>
      ) : merchants.length === 0 ? (
        <p>No hay comercios con esos filtros.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {merchants.map((m) => (
            <li
              key={m.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <h2>{m.name}</h2>
              <p>{m.city} - {m.category}</p>
              <Link href={`/merchants/${m.slug}`}>Ver detalles →</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
