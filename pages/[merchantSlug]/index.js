export async function getServerSideProps({ params }) {
  const { data: merchant } = await supabase
    .from('merchants')
    .select('*')
    .eq('slug', params.merchantSlug)
    .single();

  return { props: { merchant } };
}

export default function MerchantPage({ merchant }) {
  return (
    <div>
      <h1>{merchant.name}</h1>
      <p>{merchant.description}</p>
    </div>
  );
}