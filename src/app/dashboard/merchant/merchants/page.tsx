"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Merchant = {
  id: string;
  name: string;
  slug: string;
};

export default function MerchantList() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      const { data, error } = await supabase.from("merchants").select("id,name,slug");
      if (error) {
        console.error("Error fetching merchants:", error);
      }
      if (data) setMerchants(data);
    };

    fetchMerchants();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Mis Comercios</h2>
      <ul className="space-y-2">
        {merchants.map((m) => (
          <li key={m.id}>
            <Link href={`/dashboard/merchant/merchants/${m.id}`} className="text-blue-500">
              {m.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
