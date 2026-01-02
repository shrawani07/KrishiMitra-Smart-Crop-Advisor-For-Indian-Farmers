"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, Loader2, Bug, AlertTriangle, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

interface DiseasePrediction {
  disease: string
  confidence: number
  severity: "Low" | "Medium" | "High"
  description: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
}

export const diseaseLabels: Record<string, any> = {
  en: {
    results: "Prediction Results",
    detected: "Detected Disease",
    confidence: "Confidence",
    severity: "Severity",
    description: "Description",
    symptoms: "Symptoms",
    treatment: "Treatment",
    prevention: "Prevention",
  },
  hi: {
    results: "पूर्वानुमान परिणाम",
    detected: "पहचाना रोग",
    confidence: "विश्वसनीयता",
    severity: "तीव्रता",
    description: "विवरण",
    symptoms: "लक्षण",
    treatment: "उपचार",
    prevention: "रोकथाम",
  },
  mr: {
    results: "अंदाज निकाललेले परिणाम",
    detected: "ओळखलेले रोग",
    confidence: "विश्वासार्हता",
    severity: "तीव्रता",
    description: "वर्णन",
    symptoms: "लक्षणे",
    treatment: "उपचार",
    prevention: "प्रतिबंध",
  },
  as: {
    results: "পূৰ্বানুমান ফলাফল",
    detected: "পৰিচিত ৰোগ",
    confidence: "বিশ্বাসযোগ্যতা",
    severity: "তীব্ৰতা",
    description: "বিৱৰণ",
    symptoms: "লক্ষণসমূহ",
    treatment: "উপশম",
    prevention: "নিয়ন্ত্ৰণ",
  },
  bn: {
    results: "পূর্বাভাস ফলাফল",
    detected: "সনাক্ত রোগ",
    confidence: "বিশ্বাসযোগ্যতা",
    severity: "তীব্রতা",
    description: "বিবরণ",
    symptoms: "লক্ষণ",
    treatment: "চিকিৎসা",
    prevention: "রোধ",
  },
  brx: {
    results: "अंदाज निकाललेले परिणाम",
    detected: "ओळखलेले रोग",
    confidence: "विश्वासार्हता",
    severity: "तीव्रता",
    description: "वर्णन",
    symptoms: "लक्षणे",
    treatment: "उपचार",
    prevention: "प्रतिबंध",
  },
  doi: {
    results: "पूर्वानुमान परिणाम",
    detected: "पहचाना रोग",
    confidence: "विश्वासनीयता",
    severity: "तीव्रता",
    description: "विवरण",
    symptoms: "लक्षण",
    treatment: "उपचार",
    prevention: "रोकथाम",
  },
  gu: {
    results: "પૂર્વાનુમાન પરિણામો",
    detected: "પહેચાન થયેલી બીમારી",
    confidence: "વિશ્વસનીયતા",
    severity: "તીવ્રતા",
    description: "વર્ણન",
    symptoms: "લક્ષણો",
    treatment: "ઉપચાર",
    prevention: "પ્રતિબંધ",
  },
  kn: {
    results: "ಪೂರ್ವಾನುಮಾನ ಫಲಿತಾಂಶಗಳು",
    detected: "ಗಣನೆ ಮಾಡಿದ ರೋಗ",
    confidence: "ನಂಬಿಕೆ",
    severity: "ತೀವ್ರತೆ",
    description: "ವಿವರಣೆ",
    symptoms: "ಲಕ್ಷಣಗಳು",
    treatment: "ಉಪಚಾರ",
    prevention: "ತಡೆಯು",
  },
  ks: {
    results: "پیشگوئی کے نتائج / भविष्यवाणी परिणाम",
    detected: "شناخت شدہ مرض / पहचाना रोग",
    confidence: "اعتماد / विश्वसनीयता",
    severity: "شدت / तीव्रता",
    description: "تفصیل / विवरण",
    symptoms: "علامات / लक्षण",
    treatment: "علاج / उपचार",
    prevention: "روک تھام / रोकथाम",
  },
  kok: {
    results: "अंदाज निकाललेले परिणाम",
    detected: "ओळखलेले रोग",
    confidence: "विश्वासार्हता",
    severity: "तीव्रता",
    description: "वर्णन",
    symptoms: "लक्षणे",
    treatment: "उपचार",
    prevention: "प्रतिबंध",
  },
  mai: {
    results: "पूर्वानुमान परिणाम",
    detected: "पहचाना रोग",
    confidence: "विश्वासनीयता",
    severity: "तीव्रता",
    description: "विवरण",
    symptoms: "लक्षण",
    treatment: "उपचार",
    prevention: "रोकथाम",
  },
  ml: {
    results: "പ്രവചന ഫലം",
    detected: "ശരിയായി കണ്ടെത്തിയ രോഗം",
    confidence: "വിശ്വാസ്യത",
    severity: "തീവ്രത",
    description: "വിവരണം",
    symptoms: "ലക്ഷണങ്ങൾ",
    treatment: "ചികിത്സ",
    prevention: "പ്രതിരോധം",
  },
  mni: {
    results: "ꯄꯨꯔꯕꯥꯅꯨꯃꯥꯟ ꯑꯣꯜꯐꯥꯜ",
    detected: "ꯂꯣꯛꯅꯥ ꯑꯣꯛꯀ꯭",
    confidence: "ꯋꯤꯡꯐꯣꯏꯅꯠꯗꯤ",
    severity: "ꯃꯦꯏꯡꯄꯥꯛ",
    description: "ꯑꯣꯛꯀꯥꯟ ꯑꯣꯡꯁ꯭",
    symptoms: "ꯁꯣꯞꯄꯥꯛ",
    treatment: "ꯑꯨꯝꯗꯦꯟ ꯑꯣꯛꯀ꯭",
    prevention: "ꯐ꯭ꯔꯦꯛꯔꯤꯡ",
  },
  ne: {
    results: "पूर्वानुमान परिणाम",
    detected: "पहचाना रोग",
    confidence: "विश्वासनीयता",
    severity: "तीव्रता",
    description: "विवरण",
    symptoms: "लक्षण",
    treatment: "उपचार",
    prevention: "रोकथाम",
  },
  or: {
    results: "ପୂର୍ବାନୁମାନ ପରିଣାମ",
    detected: "ସନ୍ଦର୍ଭ ରୋଗ",
    confidence: "ବିଶ୍ୱସନୀୟତା",
    severity: "ତୀବ୍ରତା",
    description: "ବିବରଣୀ",
    symptoms: "ଲକ୍ଷଣ",
    treatment: "ଚିକିତ୍ସା",
    prevention: "ପ୍ରତିରୋଧ",
  },
  pa: {
    results: "ਭਵਿੱਖਬਾਣੀ ਨਤੀਜੇ",
    detected: "ਪਛਾਣਿਆ ਰੋਗ",
    confidence: "ਭਰੋਸਾ",
    severity: "ਤੀਬਰਤਾ",
    description: "ਵੇਰਵਾ",
    symptoms: "ਲੱਛਣ",
    treatment: "ਉਪਚਾਰ",
    prevention: "ਰੋਕਥਾਮ",
  },
  sa: {
    results: "पूर्वानुमान परिणाम",
    detected: "पहचाना रोग",
    confidence: "विश्वासनीयता",
    severity: "तीव्रता",
    description: "विवरण",
    symptoms: "लक्षण",
    treatment: "उपचार",
    prevention: "रोकथाम",
  },
  ta: {
    results: "முன்னறிவிப்பு முடிவுகள்",
    detected: "கண்டறியப்பட்ட நோய்",
    confidence: "நம்பிக்கை",
    severity: "தீவிரம்",
    description: "விவரம்",
    symptoms: "அறிகுறிகள்",
    treatment: "சிகிச்சை",
    prevention: "தடுப்பு",
  },
  te: {
    results: "అంచనా ఫలితాలు",
    detected: "గమనించిన రోగం",
    confidence: "నమ్మకం",
    severity: "తీవ్రత",
    description: "వివరణ",
    symptoms: "లక్షణాలు",
    treatment: "చికిత్స",
    prevention: "నిరోధక చర్యలు",
  },
}


export default function DiseasePredictor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setPrediction(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrediction = async () => {
    if (!selectedImage) return

    setIsLoading(true)
    setError(null)

    try {
      // Convert base64 to blob
      const response = await fetch(selectedImage)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append("image", blob, "plant-image.jpg")

      const predictionResponse = await fetch("/api/disease-prediction", {
        method: "POST",
        body: formData,
      })

      if (!predictionResponse.ok) {
        throw new Error("Failed to predict disease")
      }

      const result = await predictionResponse.json()
      setPrediction(result)
    } catch (err) {
      setError("Failed to analyze the image. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-green-600"
      case "Medium":
        return "text-yellow-600"
      case "High":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <CheckCircle className="w-4 h-4" />
      case "Medium":
        return <AlertTriangle className="w-4 h-4" />
      case "High":
        return <Bug className="w-4 h-4" />
      default:
        return <Bug className="w-4 h-4" />
    }
  }
  const { t } = useLanguage()




  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Camera className="w-5 h-5" />
            {t("disease.upload.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-md mx-auto">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected plant"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full h-64"
                    />
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="dark:border-gray-500 dark:text-white dark:hover:bg-gray-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t("disease.upload.different")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-lg font-medium text-black dark:text-white">
                      {t("disease.upload.title")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("disease.upload.description")}
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="
            w-full
           bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white
            border-none
            shadow-sm
            flex items-center justify-center
            gap-2
            px-4 py-2
            rounded
            transition-colors duration-300
          "
                  >
                    <Upload className="w-4 h-4" />
                    {t("disease.upload.button")}
                  </Button>

                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {selectedImage && (
              <Button
                onClick={handlePrediction}
                className="w-full bg-blue-600 dark:bg-blue-400 text-white dark:text-black hover:bg-blue-700 dark:hover:bg-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("disease.analyzing")}
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4 mr-2" />
                    {t("disease.predict")}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Prediction Results */}
      {prediction && (
        <Card className="border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 text-black dark:text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <Bug className="w-5 h-5" />
              {t("disease.results")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Disease Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-black dark:text-white">
                  {t("disease.detected")}
                </h4>
                <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                  {prediction.disease}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-black dark:text-white">
                  {t("disease.confidence")}
                </h4>
                <p className="text-lg font-semibold">{prediction.confidence}%</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2 text-black dark:text-white">
                  {t("disease.severity")}
                  <span className={getSeverityColor(prediction.severity)}>
                    {getSeverityIcon(prediction.severity)}
                  </span>
                </h4>
                <p className={`text-lg font-semibold ${getSeverityColor(prediction.severity)}`}>
                  {prediction.severity}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2 text-black dark:text-white">
                {t("disease.description.label")}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{prediction.description}</p>
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="font-medium mb-2 text-black dark:text-white">{t("disease.symptoms")}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {prediction.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            {/* Treatment */}
            <div>
              <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">
                {t("disease.treatment")}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {prediction.treatment.map((treatment, index) => (
                  <li key={index}>{treatment}</li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div>
              <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">{t("disease.prevention")}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {prediction.prevention.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>

  )
}
