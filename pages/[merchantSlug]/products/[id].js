import { useRouter } from 'next/router';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Product ID: {id}</h1>
      <p>Details about the product will go here.</p>
    </div>
  );
}
