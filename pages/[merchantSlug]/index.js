export async function getServerSideProps({ params }) {
  const { data: merchant } = await supabase
    .from('merchants')
    .select('*')
    .eq('slug', params.merchantSlug)
    .single();

  return { props: { merchant } };
}
