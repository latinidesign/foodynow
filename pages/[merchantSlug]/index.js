import { supabase } from "../../lib/supabaseClient";

export async function getServerSideProps({ params }) {
  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("slug", params.merchantSlug)
    .single();

    
  return { props: { merchant } };
}

export default function MerchantPage({ merchant }) {
    if (!merchant) {
    return <div>No se encontró el comercio.</div>;
  }
  return (
    <div>
      <h1>{merchant.name}</h1>
      <p>{merchant.description}</p>
    </div>
  );
}