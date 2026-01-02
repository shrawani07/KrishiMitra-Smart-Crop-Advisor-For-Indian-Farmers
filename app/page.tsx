"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf, Bug, Target, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLaunch = () => {
    setLoading(true);
    setTimeout(() => router.push("/agribot"), 1800);
  };

  const features = [
    {
      icon: <MessageCircle className="w-10 h-10 text-green-500 dark:text-green-400" />,
      title: "AI Chatbot",
      desc: "Ask your AgriBot for instant advice on farming, crops, and weather insights.",
    },
    {
      icon: <Leaf className="w-10 h-10 text-green-500 dark:text-green-400" />,
      title: "Crop Recommendation",
      desc: "Get the best crop suggestions based on your soil, region, and weather data.",
    },
    {
      icon: <Target className="w-10 h-10 text-green-500 dark:text-green-400" />,
      title: "Yield Prediction",
      desc: "Predict your farm yield accurately with AI-based analytics and data models.",
    },
    {
      icon: <Bug className="w-10 h-10 text-green-500 dark:text-green-400" />,
      title: "Disease Detection",
      desc: "Detect plant diseases from images and receive instant treatment recommendations.",
    },
  ];

  const impactMetrics = [
    { value: "5,000+", label: "Farmers Connected" },
    { value: "12,000+", label: "Soil Health Reports Generated" },
    { value: "150+", label: "Cities Served" },
    { value: "10,000+", label: "Acres of Land Improved" },
  ];

  const testimonials = [
    {
      name: "Kamal Nayan Upadhyay",
      state: "Maharashtra",
      quote:
        "Using Krishi Mitra's advanced tools and resources, I've seen a significant improvement in my farm's productivity.",
    },
    {
      name: "S Mishra",
      state: "Uttar Pradesh",
      quote:
        "Krishi Mitra's marketplace opened new avenues to sell my produce directly to consumers.",
    },
    {
      name: "Diljeet",
      state: "Punjab",
      quote:
        "The sustainable farming techniques I've learned through Krishi Mitra boosted my yield and protected the environment.",
    },
  ];

  return (
   <div className="relative min-h-screen bg-gradient-to-br from-white via-green-50 to-white dark:from-black dark:via-green-950 dark:to-black text-black dark:text-white overflow-hidden transition-colors duration-700">
  {/* Animated Orbs */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 left-10 w-64 h-64 bg-green-400/20 dark:bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-300/10 dark:bg-green-400/10 rounded-full blur-3xl animate-ping"></div>
  </div>

  {/* Navbar */}
  <nav className="w-full bg-transparent py-5 z-50 relative transition-colors">
    <div className="container mx-auto px-6 flex justify-between items-center">
      <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400 drop-shadow-[0_0_20px_#00ff88]">
        KrishiMitra
      </h1>
      <ul className="hidden mt-4 md:flex space-x-8 text-gray-600 dark:text-gray-300 font-medium">
        <li>
          <a href="/" className="hover:text-green-500 dark:hover:text-green-400 transition-all">
            Home
          </a>
        </li>
        <li>
          <a href="/agribot" className="hover:text-green-500 dark:hover:text-green-400 transition-all">
            Prediction
          </a>
        </li>
        <li>
          <a href="/dashboard" className="hover:text-green-500 dark:hover:text-green-400 transition-all">
            Crop & Fertilizer
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-green-500 dark:hover:text-green-400 transition-all">
            Contact
          </a>
        </li> <li>
          <a href="/about" className="hover:text-green-500 dark:hover:text-green-400 transition-all">
            About
          </a>
        </li>
        <ThemeToggle />
      </ul>
    </div>
  </nav>

  {/* Hero Section */}
  <section className="relative flex flex-col md:flex-row items-center justify-center md:justify-between container mx-auto px-6 py-20 transition-colors">
    <div className="text-center md:text-left md:w-1/2 space-y-4">
      <p className="uppercase tracking-widest text-green-500 dark:text-green-400 font-semibold">
        Hello & Welcome
      </p>
      <h1 className="text-6xl md:text-7xl font-extrabold text-green-600 dark:text-green-300 drop-shadow-[0_0_25px_#00ff88]">
        KrishiMitra
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg max-w-lg">
        Smart Crop Advisor For Indian Farmers — powered by Artificial Intelligence and Data Science.
      </p>
      <div className="mt-6">
        <Button
          onClick={handleLaunch}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white dark:text-white px-6 py-3 rounded-md text-lg shadow-[0_0_20px_#00ff88] hover:shadow-[0_0_40px_#00ff88] transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Launching...
            </div>
          ) : (
            "🚀 Launch AgriBot"
          )}
        </Button>
      </div>
    </div>

    {loading && (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-green-400 border-t-transparent rounded-full animate-spin-slow"></div>
          <Loader2 className="absolute text-green-300 w-10 h-10 animate-pulse" />
        </div>
        <p className="mt-6 text-xl text-green-400 font-semibold animate-fade-in">
          🌾 Launching AgriBot...
        </p>
      </div>
    )}

    <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center h-[60vh]">
      <Image
        src="/agri.png"
        alt="Agribot"
        width={420}
        height={300}
        className="drop-shadow-[0_0_40px_#00ff88] animate-float object-contain rounded-[30px]"
      />
    </div>
  </section>

  {/* How to Use Section */}
<section className="relative py-20 bg-gradient-to-b border-t border-green-800/50">
  <div className="container mx-auto text-center px-6">
    <h2 className="text-4xl font-bold text-green-300 mb-10 drop-shadow-[0_0_20px_#00ff88]">
      🚀 How to Use  / इस का उपयोग कैसे करें
    </h2>
    <div className="max-w-3xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
      <div>
        <h4 className="text-green-400 font-semibold mb-2">
          Step 1: Launch the App / स्टेप 1: ऐप लॉन्च करें
        </h4>
        <p>
          Click the “🚀 Launch AgriBot” button on the homepage to start. / होमपेज पर “🚀 Launch AgriBot” बटन पर क्लिक करें।
        </p>
      </div>
      <div>
        <h4 className="text-green-400 font-semibold mb-2">
          Step 2: Choose a Feature / स्टेप 2: एक फीचर चुनें
        </h4>
        <p>
          Select between AI Chat, Crop Recommendation, Yield Prediction, or Disease Detection from the menu. / मेनू से AI चैट, फसल सिफारिश, उपज भविष्यवाणी, या रोग पहचान चुनें।
        </p>
      </div>
      <div>
        <h4 className="text-green-400 font-semibold mb-2">
          Step 3: Enter or Upload Data / स्टेप 3: डेटा दर्ज करें या अपलोड करें
        </h4>
        <p>
          Provide your state, soil parameters, or upload an image for analysis — depending on the feature. / अपने राज्य, मिट्टी के पैरामीटर या विश्लेषण के लिए एक छवि अपलोड करें।
        </p>
      </div>
      <div>
        <h4 className="text-green-400 font-semibold mb-2">
          Step 4: View Smart Insights / स्टेप 4: स्मार्ट इनसाइट देखें
        </h4>
        <p>
          AI processes your inputs and displays predictions, recommendations, or detected issues instantly. / AI आपके इनपुट को प्रोसेस करता है और तुरंत सिफारिशें या भविष्यवाणियां दिखाता है।
        </p>
      </div>
      <div>
        <h4 className="text-green-400 font-semibold mb-2">
          Step 5: Explore the Dashboard / स्टेप 5: डैशबोर्ड एक्सप्लोर करें
        </h4>
        <p>
          Monitor all farming activities, soil health, and weather info from your personal dashboard. / अपने व्यक्तिगत डैशबोर्ड से सभी कृषि गतिविधियों, मिट्टी की स्थिति और मौसम की जानकारी देखें।
        </p>
      </div>
    </div>
  </div>
</section>



  {/* Features Section */}
  <section className="relative py-20 bg-gradient-to-b border-t border-green-800/50">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold text-green-300 mb-12 drop-shadow-[0_0_20px_#00ff88]">
        Explore Our Smart Farming Tools 🌱
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-green-800/50 bg-white dark:bg-gray-900 hover:shadow-[0_0_30px_#00ff88] transition-all"
          >
            <div className="mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-green-300 mb-2">{feature.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Our Impact Section */}
  <section className="relative py-20 border-t border-green-800/50">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold text-green-300 mb-12 drop-shadow-[0_0_20px_#00ff88]">
        Our Impact 🌾
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
        {impactMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-green-800/50 bg-white dark:bg-gray-900 hover:shadow-[0_0_25px_#00ff88] transition-all"
          >
            <h3 className="text-3xl font-extrabold text-green-400 mb-2">
              {metric.value}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{metric.label}</p>
          </div>
        ))}
      </div>

    
    </div>
  </section>

  {/* Footer */}
  <footer className="relative border-t border-green-300/40 dark:border-green-800/40 text-center py-10 bg-white/70 dark:bg-black/50 backdrop-blur-md transition-colors">
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
