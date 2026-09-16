import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quiz Builder",
  description: "Write quizzes and review them as a clean answer key.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="bg-paper text-ink font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
