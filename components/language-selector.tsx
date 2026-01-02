"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useLanguage, type Language } from "@/contexts/language-context"

const languages = [
  { code: "en" as Language, name: "English", nativeName: "English" },
  { code: "mr" as Language, name: "Marathi", nativeName: "मराठी" },
  { code: "hi" as Language, name: "Hindi", nativeName: "हिन्दी" },
  { code: "as" as Language, name: "Assamese", nativeName: "অসমীয়া" },
  { code: "bn" as Language, name: "Bengali", nativeName: "বাংলা" },
  { code: "brx" as Language, name: "Bodo", nativeName: "बर'/बड़ो" },
  { code: "doi" as Language, name: "Dogri", nativeName: "डोगरी" },
  { code: "gu" as Language, name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn" as Language, name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ks" as Language, name: "Kashmiri", nativeName: "کشميري / कश्मीरी" },
  { code: "kok" as Language, name: "Konkani", nativeName: "कोंकणी" },
  { code: "mai" as Language, name: "Maithili", nativeName: "मैथिली" },
  { code: "ml" as Language, name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mni" as Language, name: "Manipuri (Meitei)", nativeName: "মেইতেই লোন্" },
  { code: "ne" as Language, name: "Nepali", nativeName: "नेपाली" },
  { code: "or" as Language, name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "pa" as Language, name: "Punjabi", nativeName: "ਪੰਜਾਬੀ / پنجابی" },
  { code: "sa" as Language, name: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: "ta" as Language, name: "Tamil", nativeName: "தமிழ்" },
  { code: "te" as Language, name: "Telugu", nativeName: "తెలుగు" }, ,
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-transparent"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto w-64">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code)
              setIsOpen(false)
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check className="w-4 h-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
