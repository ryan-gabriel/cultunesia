import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
