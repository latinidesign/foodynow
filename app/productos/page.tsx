// app/productos/page.tsx
import { createClient } from "@/lib/supabase/server"; // o el path donde tengas tu cliente
import Image from "next/image";
import Link from "next/link";

export default async function ProductosPage() {
  const supabase = createClient();
  
  // Obtener merchant_id desde cookie
  const { data: { session } } = await supabase.auth.getSession();
  const merchant_id = session?.user?.user_metadata?.merchant_id;

  if (!merchant_id) return <div>Merchant no identificado</div>;

  // Obtener productos
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", merchant_id)
    .eq("is_published", true);

  if (error) return <div>Error cargando productos</div>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/producto/${product.id}`}>
          <div className="border rounded p-4 hover:shadow">
            {product.image_url && (
              <Image src={product.image_url} alt={product.name} width={300} height={200} />
            )}
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-gray-600">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
