"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const crops = [
  { name: "Rice", desc: "As a cereal-grain, domesticated rice is the most widely consumed staple food for over half of the world's human population, especially in Asia and Africa.", image: "/rice.jpg" },
  { name: "Wheat", desc: "Wheat is a grass widely cultivated for its cereal grain, which is a worldwide staple food.", image: "/wheat.jpg" },
  { name: "Corn", desc: "Corn is a tall annual cereal grass (Zea mays) that is widely grown for its large, elongated ears of starchy seeds.", image: "/corn.jpg" },
  { name: "Potato", desc: "The potato is a starchy tuber of the plant Solanum tuberosum and is a root vegetable native to the Americas.", image: "/potato.jpg" },
  { name: "Cotton", desc: "Cotton is a soft, fluffy staple fiber that grows in a boll, or protective case, around the seeds of the cotton plant.", image: "/cotton.jpg" },
  { name: "Papaya", desc: "The papaya is a small, sparsely branched tree, usually with a single stem growing from 5 to 10 m tall.", image: "/papaya.jpg" },
  { name: "Sugarcane", desc: "Sugarcane is a tropical, perennial grass that forms lateral shoots at the base to produce multiple stems, typically 3 to 4 m high.", image: "/sugarcane.jpg" },
  { name: "Tomato", desc: "Cultivation companion plants. Tomatoes thrive when grown alongside alliums, carrots, celery, and parsley.", image: "/tomato.jpg" },
];

const fertilizers = [
  { title: "Phosphorus Fertilizer", description: "Phosphorus from manure or sludge should be comparable to P from inorganic fertilizer.", image: "/phosphorus.jpg" },
  { title: "Nitrogen Fertilizer", description: "Nitrogen is essential for plant photosynthesis, so feeding plants with nitrogen is vital.", image: "/nitrogen.jpg" },
  { title: "Potassium Fertilizer", description: "The quality grade of potassium fertilizer is expressed as a percentage of potassium oxide (K₂O).", image: "/potassium.jpg" },
  { title: "Agricultural Waste", description: "Fertilizers made from agricultural waste contain nitrogen, phosphorus, and potassium.", image: "/waste.jpg" },
  { title: "Livestock Manure", description: "Fresh manure is often used as a nitrogen-rich fertilizer.", image: "/livestock.jpg" },
  { title: "Industrial Waste", description: "Industrial waste is recycled by incorporating it into fertilizer formulations.", image: "/industrial.jpg" },
  { title: "Municipal Sludge", description: "Municipal sludge is a slow-release source of nitrogen and phosphorus.", image: "/sludge.jpg" },
  { title: "More Details", description: "Future updates coming soon!", image: "/more.jpg" },
];

const states = [
  { name: "Uttar Pradesh", crops: "Sugarcane, Wheat, Rice, Potato, Pulses." },
  { name: "Maharashtra", crops: "Sugarcane, Cotton, Soybean, Pulses, Rice, Grapes." },
  { name: "West Bengal", crops: "Rice, Jute, Tea, Potato, Wheat, Pulses." },
  { name: "Punjab", crops: "Wheat, Rice, Cotton, Sugarcane." },
  { name: "Madhya Pradesh", crops: "Soybean, Wheat, Pulses, Maize, Cotton." },
  { name: "Karnataka", crops: "Maize, Coffee, Sugarcane, Rice, Cotton." },
  { name: "Rajasthan", crops: "Bajra, Pulses, Mustard, Wheat." },
  { name: "Gujarat", crops: "Cotton, Groundnut, Bajra, Wheat, Oilseeds." },
  { name: "Andhra Pradesh", crops: "Rice, Sugarcane, Cotton, Chilli, Maize." },
  { name: "Tamil Nadu", crops: "Coconut, Banana, Sugarcane, Rice, Coffee." },
  { name: "Telangana", crops: "Paddy, Cotton, Maize, Red Gram." },
  { name: "Bihar", crops: "Rice, Wheat, Maize, Pulses, Jute, Sugarcane." },
  { name: "Odisha", crops: "Rice, Pulses, Jute, Oilseeds, Turmeric." },
  { name: "Kerala", crops: "Coconut, Rubber, Pepper, Cardamom, Coffee." },
  { name: "Haryana", crops: "Wheat, Rice, Sugarcane, Cotton." },
  { name: "Assam", crops: "Tea, Jute, Rice, Mustard." },
  { name: "Jharkhand", crops: "Rice, Maize, Pulses." },
  { name: "Uttarakhand", crops: "Rice, Wheat, Sugarcane, Maize." },
  { name: "Himachal Pradesh", crops: "Apple, Potato, Maize, Wheat, Barley." },
  { name: "Chhattisgarh", crops: "Rice, Millets, Maize, Pulses." },
  { name: "Goa", crops: "Rice, Cashew, Coconut, Areca Nut." },
  { name: "Arunachal Pradesh", crops: "Rice, Maize, Millets, Oilseeds." },
  { name: "Meghalaya", crops: "Rice, Maize, Potato, Pineapple." },
  { name: "Manipur", crops: "Rice, Maize, Pulses, Pineapple, Orange." },
  { name: "Mizoram", crops: "Rice, Maize, Ginger, Turmeric." },
  { name: "Nagaland", crops: "Rice, Maize, Millets, Pulses." },
  { name: "Tripura", crops: "Rice, Rubber, Tea, Jute." },
  { name: "Sikkim", crops: "Cardamom, Ginger, Orange, Buckwheat, Maize." },
];

export default function CropDetailsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-500 px-8 py-12 font-[Poppins]">
      {/* Navbar */}
      <nav className="w-full bg-transparent py-5 z-50 relative">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400 drop-shadow-[0_0_20px_#00ff88]">KrishiMitra</h1>
          <ul className="hidden md:flex space-x-8 font-medium">
            <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Home</a></li>
            <li><a href="/agribot" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Prediction</a></li>
            <li><a href="/dashboard" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Crop & Fertilizer</a></li>
            <li><a href="/contact" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">Contact</a></li>   <li><a href="/about" className="hover:text-green-600 dark:hover:text-green-400 transition-all text-gray-800 dark:text-gray-300">About</a></li>
            <ThemeToggle />
          </ul>
        </div>
      </nav>

    {/* Crops Section */}
<section>
  <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-8 text-center mt-6">🌾 Crop Details</h1>
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    {crops.map((crop) => (
      <a
        key={crop.name}
        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(crop.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <img
          src={crop.image}
          alt={crop.name}
          className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
          <h3 className="text-white text-2xl font-semibold mb-2">{crop.name}</h3>
          <p className="text-gray-200">{crop.desc}</p>
        </div>
      </a>
    ))}
  </div>
</section>

      {/* Fertilizer Section */}
<section className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-10 mt-16 rounded-2xl shadow-inner">
  <h1 className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-8 text-center">
    Fertilizer Details
  </h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {fertilizers.map((item, idx) => (
      <a
        key={idx}
        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <Image
          src={item.image}
          alt={item.title}
          width={400}
          height={300}
          className="object-cover w-full h-56 opacity-85"
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        <CardContent className="absolute bottom-0 left-0 p-5 text-white">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="text-sm mt-2 leading-snug">{item.description}</p>
        </CardContent>
      </a>
    ))}
  </div>
</section>


      {/* State Crops Section */}
      {/* State Crops Section */}
<section className="mt-16">
  <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6 border-t border-gray-300 dark:border-gray-700 pt-6 text-center">
    Major Crops by Indian State (28 States)
  </h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {states.map((state) => (
      <a
        key={state.name}
        href={`https://en.wikipedia.org/wiki/Agriculture_in_${encodeURIComponent(state.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
      >
        <h4 className="text-green-700 dark:text-green-400 font-bold text-xl mb-2">{state.name}</h4>
        <p className="text-gray-800 dark:text-gray-300">{state.crops}</p>
      </a>
    ))}
  </div>
</section>

    </main>
  );
}
