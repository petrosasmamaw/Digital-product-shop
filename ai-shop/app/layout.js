import "./globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/components/ReduxProvider";

export const metadata = {
  title: "AI Shop",
  description: "AI-powered e-commerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <ReduxProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
