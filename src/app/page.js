import MapSvg from "@/components/MapSvg";

export default function Home() {
  return (
    <div className="w-full h-screen">
      <div className="w-full  overflow-hidden h-full flex justify-center items-center m-auto">
        <main className="w-full border border-primary rounded-xl shadow-xl shadow-primary">
          <MapSvg />
        </main>
      </div>
    </div>
  );
}
