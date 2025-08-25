// Comercio Dashboard page
export default function ComercioDashboardPage() {
    return <div>Comercio Dashboard Page</div>;
}
// opcional en src/app/commerce/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string }}) {
  // (simplificado) Podés reusar getMerchant o una versión lite que solo traiga name y photos[0]
  const title = `Comercio ${params.slug} | Foody Now`;
  const description = "Perfil del comercio con fotos, dirección y cómo llegar.";
  return {
    title,
    description,
    openGraph: {
      title,
      description
      // images: [...]
    }
  };
}
