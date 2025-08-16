import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function MerchantDetail() {
  const router = useRouter();
  const { merchantSlug } = router.query;
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (merchantSlug) fetchMerchant();
  }, [merchantSlug]);

  async function fetchMerchant() {
    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .eq("slug", merchantSlug)
      .single();

    if (error) console.error("Error fetching merchant:", error);
    else setMerchant(data);

    setLoading(false);
  }

  if (loading) return <p>Cargando comercio...</p>;
  if (!merchant) return <p>Comercio no encontrado.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{merchant.name}</h1>
      <p><strong>Categoría:</strong> {merchant.category}</p>
      <p><strong>Ciudad:</strong> {merchant.city}</p>
      <p><strong>Descripción:</strong> {merchant.description || "Sin descripción"}</p>
      <button onClick={() => router.push("/merchants")}>← Volver</button>
    </div>
  );
}
