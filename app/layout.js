import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "NeuroNest - AI-Powered Personalized Learning",
  description: "Transform any topic into personalized courses, quizzes, and flashcards with Gemini AI. Start learning smarter today.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
            {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
