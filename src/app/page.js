// import MapSvg from "@/components/MapSvg";

// export default function Home() {
//   return (
//     <div className="w-full h-screen">
//       <div className="w-full  overflow-hidden h-full flex justify-center items-center m-auto">
//         <main className="w-full border border-primary-gold rounded-xl shadow-xl shadow-primary-gold">
//           <MapSvg />
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { supabase } from "@/lib/supabaseClient";
import MapSvg from "@/components/MapSvg";

export default function Home() {
  const handleSignOut = async () => {
    try{
      await supabase.auth.signOut();
      await fetch("/api/auth/signout", { method: "POST" });
      console.log("Signed out successfully");
      // optional: redirect ke login page
    }
    catch(e){
      console.log(e)
    }
  };

  return (
    <div className="w-full h-screen relative">
      {/* Button Sign Out di pojok kanan atas */}
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition z-50"
      >
        Sign Out
      </button>

      <div className="w-full h-full flex justify-center items-center overflow-hidden">
        <main className="w-full border border-primary-gold rounded-xl shadow-xl shadow-primary-gold">
          <MapSvg />
        </main>
      </div>
    </div>
  );
}
