"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = `KrishiMitra Contact Form - ${name}`
    const body = `
Name: ${name}
Email: ${email}

Message:
${message}
    `

    window.location.href = `mailto:sgongshe@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white dark:from-black dark:via-green-950 dark:to-black text-gray-900 dark:text-white font-[Poppins] px-6 py-12 transition-colors duration-500">

      {/* Navbar */}
      <nav className="w-full bg-transparent py-5 z-50 relative">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400 drop-shadow-[0_0_20px_#00ff88]">
            KrishiMitra
          </h1>

          <ul className="hidden md:flex space-x-8 font-medium">
            <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400">Home</a></li>
            <li><a href="/agribot" className="hover:text-green-600 dark:hover:text-green-400">Prediction</a></li>
            <li><a href="/dashboard" className="hover:text-green-600 dark:hover:text-green-400">Crop & Fertilizer</a></li>
            <li><a href="/contact" className="hover:text-green-600 dark:hover:text-green-400">Contact</a></li>
            <li><a href="/about" className="hover:text-green-600 dark:hover:text-green-400">About</a></li>
            <ThemeToggle />
          </ul>
        </div>
      </nav>

      {/* Header */}
      <section className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-green-600 dark:text-green-300 mb-4">
          Get in Touch 🌾
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions or suggestions? Send us a message and we’ll respond soon.
        </p>
      </section>

      {/* Content */}
      <section className="container mx-auto grid md:grid-cols-2 gap-12">

        {/* Form */}
        <div className="bg-gradient-to-br from-green-100/40 to-green-200/10 dark:from-green-900/20 dark:to-green-800/10 border border-green-300 dark:border-green-800/40 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
            Send Us a Message
          </h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-black/50 border border-green-300"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-black/50 border border-green-300"
            />

            <textarea
              rows={4}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-black/50 border border-green-300"
            />

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </Button>
          </form>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex gap-4 items-center">
            <MapPin className="text-green-600" />
            <span>Amravati, Maharashtra, India</span>
          </div>

          <div className="flex gap-4 items-center">
            <Mail className="text-green-600" />
            <span>sgongshe@gmail.com</span>
          </div>

          <div className="flex gap-4 items-center">
            <Phone className="text-green-600" />
            <span>+91 98765 43210</span>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="text-center mt-16 text-gray-600 dark:text-gray-500">
        © {new Date().getFullYear()} KrishiMitra — Empowering Indian Agriculture with AI 🌾
      </footer>
    </main>
  )
}
