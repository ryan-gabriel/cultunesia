import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
