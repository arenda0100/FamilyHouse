// ФАЙЛ: src/app/page.tsx
import Scene from "../components/Scene";

export default function Home() {
  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#050505]">
      <Scene />
    </main>
  );
}