"use client";

import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { useAuth, UserButton } from "@clerk/nextjs"; // Import useAuth
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Rocket, 
  ShieldCheck,
  LineChart,
  BookOpenCheck,
  Menu,
  X,
  Star,
  Twitter,
  Github,
  Linkedin,
  Mail,
  CheckCircle2,
  Brush,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const staggerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Home() {
  const { userId } = useAuth();

  return (
    <main
      id="home"
      className={cn(
        "bg-white text-black min-h-screen font-sans antialiased",
        outfit.className
      )}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/10 transition-shadow duration-300"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2 font-bold group">
            <Image
              src={"/logo4.svg"}
              alt="NeuroNest Logo"
              width={28}
              height={28}
              className="h-7 w-7 transition-transform group-hover:scale-110"
            />
            <span className="text-xl tracking-tight">NeuroNest</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
            {userId ? (
              <Button
                asChild
                className="ml-2 bg-black text-white hover:bg-black/90 transition-transform hover:scale-105"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="ml-2 bg-black text-white hover:bg-black/90 transition-transform hover:scale-105"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Right: UserButton + Mobile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              {userId ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Button
                  asChild
                  className="bg-black text-white hover:bg-black/90 transition-transform hover:scale-105"
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              )}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden border-black">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white text-black border-black">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 font-bold">
                    <Image
                      src="/logo.svg"
                      alt="NeuroNest Logo"
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                    <span>NeuroNest</span>
                  </div>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="grid gap-4">
                  {navItems.map((item) => (
                    <a key={item.href} href={item.href} className="text-base">
                      {item.label}
                    </a>
                  ))}
                  {userId ? (
                    <Button
                      className="bg-black text-white hover:bg-black/90"
                      asChild
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="bg-black text-white hover:bg-black/90"
                        asChild
                      >
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                      <Button
                        className="bg-black text-white hover:bg-black/90"
                        asChild
                      >
                        <Link href="/sign-up">Sign Up</Link>
                      </Button>
                    </>
                  )}
                  <div className="sm:hidden pt-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-50 z-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col items-start">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight max-w-xl"
              >
                AI-Powered Personalized Learning at Scale
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="mt-4 text-lg text-black/80 max-w-xl"
              >
                Revolutionizing education with adaptive, intelligent, and automated course generation.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                {userId ? (
                  <Button
                    asChild
                    className="h-11 px-6 bg-black text-white hover:bg-black/90 transition-transform hover:scale-105"
                  >
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="h-11 px-6 bg-black text-white hover:bg-black/90 transition-transform hover:scale-105"
                  >
                    <Link href="/sign-up">Try for Free</Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="h-11 px-6 border border-black group transition-transform hover:scale-105"
                >
                  <PlayCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> Watch Demo
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="mt-6 text-sm text-black/60"
              >
                No credit card required. Free tier included.
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-black bg-white p-3 shadow-sm transition-transform duration-300 hover:scale-[1.01]">
                <Image
                  src="/hero-dashboard.png"
                  alt="NeuroNest dashboard mockup"
                  width={1200}
                  height={800}
                  className="rounded-2xl w-full h-auto"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">What Makes NeuroNest Different?</h2>
          <p className="mt-2 text-black/70 max-w-2xl mx-auto">
            Purpose-built for students, educators, and institutions—fast, secure, and deeply adaptive.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Rocket className="h-6 w-6" />}
            title="Dynamic Course Creation"
            desc="Generate complete, structured courses in minutes—syllabi, modules, and lessons."
          />
          <FeatureCard
            icon={<LineChart className="h-6 w-6" />}
            title="Real-Time Adaptability"
            desc="Adjusts difficulty and pacing instantly based on learner performance."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Secure & Scalable"
            desc="Enterprise-grade auth, role-based access, and serverless scale by design."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="AI-Powered Assessments"
            desc="Instant quizzes and flashcards for every lesson to test your knowledge."
          />
          <FeatureCard
            icon={<BookOpenCheck className="h-6 w-6" />}
            title="Customizable Learning"
            desc="Tailor your course content and structure to fit your unique needs."
          />
          <FeatureCard
            icon={<Brush className="h-6 w-6" />}
            title="Intuitive Design"
            desc="A clean and simple interface that makes learning a breeze."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-black/5" aria-labelledby="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 id="how-it-works" className="text-3xl sm:text-4xl font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-black/20 hidden md:block" />
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
              <Step n={1} title="Sign Up" desc="Create an account to begin your personalized learning journey." />
              <Step n={2} title="Define Your Path" desc="Set your goals, select difficulty, and schedule your learning." />
              <Step n={3} title="Generate Structure" desc="Our AI creates a complete course with modules and lessons." />
              <Step n={4} title="Master Concepts" desc="Generate flashcards, quizzes, and Q&A to reinforce your learning." />
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Gemini AI Content Generation</h3>
            <p className="text-black/80 mb-4">
              NeuroNest leverages Gemini AI to craft high-quality, multimodal educational content with citations, examples, and interactive tasks.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-black/80">
              <li>Context-aware lesson planning and scaffolding</li>
              <li>Inline quizzes and flashcards for each concept</li>
              <li>Adaptive hints and explanations</li>
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <Image
              src="/gemini-showcase.png"
              alt="Gemini AI content generation"
              width={900}
              height={700}
              className="rounded-2xl border border-black shadow-lg"
            />
          </div>
        </div>

        <Separator className="my-12 bg-black/20" />

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Image
              src="/infra2.png"
              alt="Serverless infrastructure"
              width={900}
              height={700}
              className="rounded-2xl border border-black shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Modern, Serverless Infrastructure</h3>
            <p className="text-black/80 mb-4">
              Built with Inngest for reliable background workflows, Neon for a serverless Postgres that scales with you, Clerk for authentication, and Stripe for seamless monetization.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-black/80">
              <li>Event-driven jobs with retries and observability</li>
              <li>Branchable serverless Postgres (Neon)</li>
              <li>Clerk auth out-of-the-box + Clerk billing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">Loved by Educators & Students</h2>
            <p className="mt-2 text-black/70">Real results from real classrooms.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              name="Phil Dunphy"
              role="Tech-Savvy Dad & Part-Time Magician"
              text="I built a course so fast, even my Wi-Fi was like, 'Whoa, take it easy, champ!' Honestly, I might add 'Professor' to my business card now."
              imageSrc="/placeholder-face-1.jpeg"
            />

            <Testimonial
              name="Michael Scofield"
              role="Structural Engineer & Occasional Prison Breaker"
              text="Designed a full course in a weekend. Compared to breaking out of prison, this was child's play. No blueprints, no tattoos — just drag and drop."
              imageSrc="/placeholder-face-2.jpeg"
            />

            <Testimonial
              name="Sheldon Cooper"
              role="Child Prodigy & Full-Time Know-It-All"
              text="The quizzes were so engaging, I forgot to correct the instructor's quantum misinterpretation. Just kidding — I emailed him immediately."
              imageSrc="/placeholder-face-3.jpeg"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Flexible Pricing</h2>
          <p className="mt-2 text-black/70">Choose a plan that fits your learning journey.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <PriceCard
            title="Free Plan"
            price="$0"
            period="/ month"
            features={[
              "7 credits per month",
              "Access to core features",
              "Email support",
              "Current plan for new users",
            ]}
            cta="Get Started"
          />
          <PriceCard
            highlight
            title="Monthly Plan"
            price="$7"
            period="/ month"
            features={[
              "Unlimited credits",
              "Priority processing",
              "Premium support",
              "Full feature access",
              "Manage payments directly",
            ]}
            cta="Upgrade"
          />
        </div>
      </section>

      {/* Big CTA */}
      <section id="cta" className="relative bg-black/5 my-8">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start Building Smarter Courses Today</h2>
          <p className="text-black/80 max-w-2xl mx-auto mb-8">
            Join NeuroNest and turn your expertise into adaptive, AI-powered learning experiences.
          </p>
          {userId ? (
            <Button
              asChild
              className="h-11 px-8 bg-black text-white hover:bg-black/90 transition-all duration-300"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="h-11 px-8 bg-black text-white hover:bg-black/90 transition-all duration-300"
            >
              <Link href="/sign-up">Sign Up Free</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-black/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-bold mb-3">
                <Image
                  src="/logo4.svg"
                  alt="NeuroNest Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span>NeuroNest</span>
              </div>
              <p className="text-sm text-black/70 max-w-md">
                AI-powered personalized learning platform leveraging Gemini AI for adaptive, scalable, and automated education.
              </p>
              <div className="flex gap-4 mt-4">
                <Social href="#" label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Social>
                <Social href="#" label="GitHub">
                  <Github className="h-5 w-5" />
                </Social>
                <Social href="#" label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Social>
                <Social href="mailto:hello@neuronnest.ai" label="Email">
                  <Mail className="h-5 w-5" />
                </Social>
              </div>
            </div>

            <div className="text-sm">
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:underline">About</a></li>
                <li><a href="#features" className="hover:underline">Features</a></li>
                <li><a href="#pricing" className="hover:underline">Pricing</a></li>
                <li><a href="#contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>

            <div className="text-sm">
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-black/20" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-black/60">
            <p>Copyright © 2025 NeuroNest</p>
            <div className="sm:hidden">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="group rounded-2xl border border-black/20 bg-white p-6 transition-all duration-300 hover:border-black hover:shadow-lg"
          >
            <div className="p-3 rounded-full border border-black bg-white w-fit transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-black/80">{desc}</p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Learn More about {title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Step({ n, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: n * 0.1 }}
      className="relative flex items-start gap-4 p-6 md:p-0 md:flex-col md:items-center text-left md:text-center"
    >
      <div className="absolute top-0 bottom-0 left-[26px] w-px bg-black/20 md:hidden" />
      <div className="relative z-10 h-10 w-10 min-w-[40px] rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold ring-4 ring-white shadow-md">
        {n}
      </div>
      <div className="flex flex-col md:mt-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-black/80 mt-1 max-w-[200px]">{desc}</p>
      </div>
    </motion.div>
  );
}

function Testimonial({ name, role, text, imageSrc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="group rounded-2xl border border-black/20 bg-white p-6 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden border border-black/20 transition-transform duration-300 group-hover:scale-105">
          <Image
            src={imageSrc}
            alt={`Portrait of ${name}`}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-black/60">{role}</div>
        </div>
      </div>
      <p className="text-sm text-black/90">“{text}”</p>
      <div className="flex mt-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-black/90 text-black/10 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
        ))}
      </div>
    </motion.div>
  );
}

function PriceCard({
  title,
  price,
  period,
  features,
  cta,
  highlight,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className={cn(
        "rounded-2xl h-full border border-black/20 transition-all duration-300 cursor-pointer",
        highlight && "border-2 border-black shadow-lg"
      )}
    >
      <div className={cn("rounded-2xl h-full bg-white p-6")}>
        <div className="flex flex-col h-full justify-between">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl flex items-baseline justify-between">
              <span>{title}</span>
              {highlight && (
                <span className="text-xs font-medium px-3 py-1 rounded-full border border-black bg-black text-white">
                  Most Popular
                </span>
              )}
            </CardTitle>
            <div className="mt-2 text-4xl font-extrabold">
              {price} <span className="text-base font-medium text-black/70">{period}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="space-y-2 text-sm text-black/80 mb-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-black/80 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className={cn(
                "mt-auto w-full h-11 transition-all",
                highlight
                  ? "bg-black text-white hover:bg-black/90"
                  : "bg-transparent text-black border border-black hover:bg-black hover:text-white"
              )}
              variant={highlight ? "default" : "outline"}
            >
              {cta}
            </Button>
          </CardContent>
        </div>
      </div>
    </motion.div>
  );
}

function Social({ href, label, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="p-3 rounded-full border border-black/20 bg-white transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-black"
    >
      {children}
    </Link>
  );
}