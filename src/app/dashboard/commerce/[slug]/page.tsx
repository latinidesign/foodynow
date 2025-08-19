export default function CommercePage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Comercio</h2>
      <p>Slug: {params.slug}</p>
    </div>
  )
}
