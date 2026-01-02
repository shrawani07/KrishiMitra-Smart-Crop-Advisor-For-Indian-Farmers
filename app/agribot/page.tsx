"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Leaf, Bug, BarChart3, Target } from "lucide-react"
import ChatInterface from "@/components/chat-interface"
import CropRecommendation from "@/components/crop-recommendation"
import DiseasePredictor from "@/components/disease-predictor"
import Dashboard from "@/components/dashboard"
import YieldPredictor from "@/components/yield-predictor"
import LanguageSelector from "@/components/language-selector"
import VoiceModal from "@/components/voice-modal"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"

function AgriBot() {
  const [activeTab, setActiveTab] = useState("chat")
    const [selectedCrop, setSelectedCrop] = useState<string>("")
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
  <div className="container mx-auto px-4 py-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="text-center flex-1">
        <a href="/">
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-2">🌾 {t("app.title")}</h1>
        </a>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("app.subtitle")}</p>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <VoiceModal />
      </div>
    </div>

    {/* Tabs */}
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <TabsTrigger value="chat" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-400 rounded-md">
          <MessageCircle className="w-4 h-4" />
          {t("nav.chat")}
        </TabsTrigger>
        <TabsTrigger value="crops" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-400 rounded-md">
          <Leaf className="w-4 h-4" />
          {t("nav.crops")}
        </TabsTrigger>
        <TabsTrigger value="yield" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-400 rounded-md">
          <Target className="w-4 h-4" />
          {t("nav.yield")}
        </TabsTrigger>
        <TabsTrigger value="disease" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-400 rounded-md">
          <Bug className="w-4 h-4" />
          {t("nav.disease")}
        </TabsTrigger>
        {/* <TabsTrigger value="dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-400 rounded-md">
          <BarChart3 className="w-4 h-4" />
          {t("nav.dashboard")}
        </TabsTrigger> */}
      </TabsList>

      {/* Tab Contents */}
      <TabsContent value="chat">
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-gray-700 dark:text-gray-300">{t("chat.title")}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("chat.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChatInterface />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="crops">
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-gray-700 dark:text-gray-300">{t("crops.title")}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("crops.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <CropRecommendation 
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="yield">
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-gray-700 dark:text-gray-300">{t("yield.title")}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("yield.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <YieldPredictor />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="disease">
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-gray-700 dark:text-gray-300">{t("disease.title")}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("disease.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <DiseasePredictor />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dashboard">
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-gray-700 dark:text-gray-300">{t("dashboard.title")}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">{t("dashboard.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Dashboard />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</div>

  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AgriBot />
    </LanguageProvider>
  )
}
