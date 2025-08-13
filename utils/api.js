export async function fetchProducts(merchantId) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('merchant_id', merchantId);
  return data;
}
