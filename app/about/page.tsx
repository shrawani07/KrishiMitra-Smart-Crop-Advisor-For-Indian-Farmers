"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AboutPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white dark:from-black dark:via-green-950 dark:to-black text-black dark:text-white transition-colors duration-700">
      {/* Navbar */}
      <nav className="w-full bg-transparent py-5 z-50 relative">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400 drop-shadow-[0_0_20px_#00ff88]">KrishiMitra</h1>
          <ul className="hidden md:flex space-x-8 font-medium items-center">
            <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Home</a></li>
            <li><a href="/agribot" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Prediction</a></li>
            <li><a href="/dashboard" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Crop & Fertilizer</a></li>
            <li><a href="/contact" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Contact</a></li>
            <li><a href="/about" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">About</a></li>
            <ThemeToggle />
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-center container mx-auto px-6 py-20">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-600 dark:text-green-400 drop-shadow-[0_0_20px_#00ff88]">
            About KrishiMitra
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-lg">
            KrishiMitra is a smart crop advisor designed for Indian farmers. We leverage Artificial Intelligence and Data Science to provide actionable insights for farming, crop management, yield prediction, and disease detection.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-lg">
            कृषिमित्र भारतीय किसानों के लिए एक स्मार्ट फसल सलाहकार है। हम कृत्रिम बुद्धिमत्ता और डेटा साइंस का उपयोग करके खेती, फसल प्रबंधन, उपज भविष्यवाणी और रोग पहचान के लिए व्यावहारिक सुझाव प्रदान करते हैं।
          </p>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="https://d18x2uyjeekruj.cloudfront.net/wp-content/uploads/2023/01/agri.jpg"
            alt="About KrishiMitra"
            width={450}
            height={350}
            className="rounded-2xl drop-shadow-[0_0_25px_#00ff88] object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-50 dark:bg-green-900">
        <div className="container mx-auto px-6 text-center space-y-12">
          <h2 className="text-4xl font-bold text-green-600 dark:text-green-400 drop-shadow-[0_0_15px_#00ff88]">Features / विशेषताएँ</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-black/60 rounded-xl p-8 shadow-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-700 dark:text-gray-300">Get data-driven advice for crops, irrigation, and fertilizers for maximum yield.</p>
            </div>
            <div className="bg-white dark:bg-black/60 rounded-xl p-8 shadow-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">Disease Detection</h3>
              <p className="text-gray-700 dark:text-gray-300">Identify crop diseases early and take corrective action to protect your farm.</p>
            </div>
            <div className="bg-white dark:bg-black/60 rounded-xl p-8 shadow-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">Yield Prediction</h3>
              <p className="text-gray-700 dark:text-gray-300">Predict your crop yield using historical and real-time data for better planning.</p>
            </div>
          </div>
        </div>
      </section>

  

      {/* CTA Section */}
      <section className="py-20 bg-green-600 dark:bg-green-800 text-white text-center">
        <h2 className="text-4xl font-bold mb-6 drop-shadow-[0_0_15px_#00ff88]">Ready to Grow with KrishiMitra?</h2>
        <p className="max-w-xl mx-auto mb-8">Start making smarter farming decisions today and maximize your yield with our AI tools.</p>
       <a href="/agribot"> <Button className="bg-white text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-700 transition-all">Get Started</Button></a>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-green-800/30 dark:border-green-700/30 text-center py-10 bg-white/70 dark:bg-black/50 backdrop-blur-md transition-colors">
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 drop-shadow-[0_0_20px_#00ff88]">
          Connect with Us 🌾
        </h3>
        <p className="text-gray-700 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} KrishiMitra — Empowering Indian Agriculture with AI 🌱
        </p>
      </footer>
    </div>
  );
}
