import { ThemeProvider } from "@/context/ThemeProvider";

export default function RootLayout({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
