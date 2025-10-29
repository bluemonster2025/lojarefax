import ModelViewer from "@/components/elements/ModelViewer";

export default function ProductPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Produto X</h1>

      <div className="w-[500px] h-[500px]">
        {/* Usa props padrão */}
        <ModelViewer src="https://cms.bluemonstercase.com/wp-content/uploads/2025/09/Colm-b15h38-625x625-2.glb" />

        {/* Sobrescreve props */}

        <ModelViewer
          src="https://cms.bluemonstercase.com/wp-content/uploads/2025/09/Colm-b15h38-625x625-2.glb"
          ar
          autoRotate={false}
          className="rounded-lg shadow-lg"
          style={{ border: "1px solid #ccc" }}
          initialCameraOrbit="45deg 25deg 3m"
          zoomScale={0.7} // reduz o tamanho aparente
        />
      </div>
    </div>
  );
}
