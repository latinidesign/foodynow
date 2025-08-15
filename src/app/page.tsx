import Link from "next/link";
import NavBar from '@/components/NavBar'

export default function Home() {
  const merchants = [
    { name: "Comercio Juan", slug: "comercio-juan" },
    { name: "Comercio Maria", slug: "comercio-maria" },
  ];

  return (
    <div className="font-sans min-h-screen p-8 pb-20">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">FOODY NOW</h1>

      <h2 className="text-2xl mb-8">Lista de Comercios</h2>
      <ul className="space-y-4">
        {merchants.map((merchant) => (
          <li key={merchant.slug}>
            <Link
              href={`/${merchant.slug}`}
              className="text-blue-500 hover:underline"
            >
              {merchant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
