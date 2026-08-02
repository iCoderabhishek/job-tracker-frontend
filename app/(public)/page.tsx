import { Header } from "@/src/features/landing-page/header";
import { Hero } from "@/src/features/landing-page/hero";
import { Features } from "@/src/features/landing-page/features";
import { Footer } from "@/src/features/landing-page/footer";

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
