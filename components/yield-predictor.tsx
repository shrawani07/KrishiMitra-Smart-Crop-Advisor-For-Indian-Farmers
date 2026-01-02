"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, TrendingUp, BarChart3, Target, Lightbulb, Calendar, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

interface YieldPredictionInput {
  crop: string
  state: string
  season: string
  area: number
  rainfall: number
  fertilizer: number
  pesticide: number
}

interface YieldPredictionResult {
  predictedYield: number
  confidence: number
  factors: {
    rainfall: { impact: string; score: number }
    fertilizer: { impact: string; score: number }
    pesticide: { impact: string; score: number }
    historical: { impact: string; score: number }
  }
  recommendations: string[]
  historicalData: {
    averageYield: number
    bestYear: { year: number; yield: number }
    trend: string
  }
}



// Translation dictionary for all labels
const predictionLabels: Record<string, any> = {
  en: {
    yieldPrediction: "Yield Prediction Results",
    tonsPerHectare: "Tons per Hectare",
    confidence: "Confidence",
    historicalAverage: "Historical Average",
    trend: "Trend",
    factorAnalysis: "Factor Analysis",
    impact: "Impact",
    recommendations: "Recommendations",
    historicalContext: "Historical Context",
    bestRecorded: "Best Recorded",
    averageYield: "Average Yield",
  },
  hi: {
    yieldPrediction: "उपज पूर्वानुमान परिणाम",
    tonsPerHectare: "टन/हेक्टेयर",
    confidence: "विश्वसनीयता",
    historicalAverage: "ऐतिहासिक औसत",
    trend: "रुझान",
    factorAnalysis: "घटक विश्लेषण",
    impact: "प्रभाव",
    recommendations: "सिफ़ारिशें",
    historicalContext: "ऐतिहासिक संदर्भ",
    bestRecorded: "सर्वश्रेष्ठ दर्ज",
    averageYield: "औसत उपज",
  },
  mr: {
    yieldPrediction: "उत्पन्न अंदाज निकाललेले परिणाम",
    tonsPerHectare: "टन/हेक्टेअर",
    confidence: "विश्वासार्हता",
    historicalAverage: "ऐतिहासिक सरासरी",
    trend: "चाल",
    factorAnalysis: "घटक विश्लेषण",
    impact: "प्रभाव",
    recommendations: "शिफारसी",
    historicalContext: "ऐतिहासिक संदर्भ",
    bestRecorded: "सर्वोत्तम नोंद",
    averageYield: "सरासरी उत्पन्न",
  },
  as: {
    yieldPrediction: "উৎপাদন পূৰ্বানুমান ফলাফল",
    tonsPerHectare: "হেক্টেৰ প্রতি টন",
    confidence: "বিশ্বাসযোগ্যতা",
    historicalAverage: "ঐতিহাসিক গড়",
    trend: "প্ৰৱণতা",
    factorAnalysis: "উপাদান বিশ্লেষণ",
    impact: "প্ৰভাৱ",
    recommendations: "সুপাৰিশসমূহ",
    historicalContext: "ঐতিহাসিক প্ৰসংগ",
    bestRecorded: "শ্ৰেষ্ঠ নথিভুক্ত",
    averageYield: "গড় উৎপাদন",
  },
  bn: {
    yieldPrediction: "ফসলের পূর্বাভাস ফলাফল",
    tonsPerHectare: "হেক্টর প্রতি টন",
    confidence: "বিশ্বাসযোগ্যতা",
    historicalAverage: "ঐতিহাসিক গড়",
    trend: "প্রবণতা",
    factorAnalysis: "উপাদান বিশ্লেষণ",
    impact: "প্রভাব",
    recommendations: "সুপারিশসমূহ",
    historicalContext: "ঐতিহাসিক প্রসঙ্গ",
    bestRecorded: "সেরা রেকর্ড",
    averageYield: "গড় উৎপাদন",
  },
  brx: {
    yieldPrediction: "उत्पादन बुजाय आरो परिणाम",
    tonsPerHectare: "हेक्टर बिसारि टन",
    confidence: "विश्वासार्हता",
    historicalAverage: "इतिहासिक औसत",
    trend: "रुझान",
    factorAnalysis: "उपादान विश्लेषण",
    impact: "प्रभाव",
    recommendations: "सिफ़ारिश",
    historicalContext: "इतिहासिक संदर्भ",
    bestRecorded: "सर्वोत्तम रेकर्ड",
    averageYield: "औसत उत्पादन",
  },
  doi: {
    yieldPrediction: "उपज पूर्वानुमान परिणाम",
    tonsPerHectare: "टन/हेक्टेयर",
    confidence: "विश्वासनीयता",
    historicalAverage: "ऐतिहासिक औसत",
    trend: "रुझान",
    factorAnalysis: "कारक विश्लेषण",
    impact: "प्रभाव",
    recommendations: "सिफ़ारिशें",
    historicalContext: "ऐतिहासिक संदर्भ",
    bestRecorded: "सर्वश्रेष्ठ दर्ज",
    averageYield: "औसत उपज",
  },
  gu: {
    yieldPrediction: "ઉત્પાદન પૂર્વાનુમાન પરિણામો",
    tonsPerHectare: "હેક્ટરમાં ટન",
    confidence: "વિશ્વસનીયતા",
    historicalAverage: "આતિહાસિક સરેરાશ",
    trend: "પ્રવૃત્તિ",
    factorAnalysis: "ઘટક વિશ્લેષણ",
    impact: "અસર",
    recommendations: "શિફારસો",
    historicalContext: "આતિહાસિક સંદર્ભ",
    bestRecorded: "શ્રેષ્ઠ નોંધ",
    averageYield: "સરેરાશ ઉત્પાદન",
  },
  kn: {
    yieldPrediction: "ಉತ್ಪಾದನೆ ಪೂರ್ವಾನುಮಾನ ಫಲಿತಾಂಶಗಳು",
    tonsPerHectare: "ಹೆಕ್ಟೇರ್ ಗೆ ಟನ್",
    confidence: "ನಂಬಿಕೆ",
    historicalAverage: "ಐತಿಹಾಸಿಕ ಸರಾಸರಿ",
    trend: "ಪ್ರವೃತ್ತಿ",
    factorAnalysis: "ಕಾರಕ ವಿಶ್ಲೇಷಣೆ",
    impact: "ಪ್ರಭಾವ",
    recommendations: "ಶಿಫಾರಸುಗಳು",
    historicalContext: "ಐತಿಹಾಸಿಕ ಸಂದರ್ಭ",
    bestRecorded: "ಶ್ರೇಷ್ಠ ದಾಖಲೆ",
    averageYield: "ಸರಾಸರಿ ಉತ್ಪಾದನೆ",
  },
  ks: {
    yieldPrediction: "پیداوار پیشگوئی کے نتائج / उत्पादन पूर्वानुमान परिणाम",
    tonsPerHectare: "ٹن فی ہیکٹر / हेक्टेयर प्रति टन",
    confidence: "اعتماد / विश्वसनीयता",
    historicalAverage: "تاریخی اوسط / ऐतिहासिक औसत",
    trend: "رجحان / प्रवृत्ति",
    factorAnalysis: "عنصر تجزیہ / घटक विश्लेषण",
    impact: "اثر / प्रभाव",
    recommendations: "سفارشات / सिफ़ारिशें",
    historicalContext: "تاریخی سیاق و سباق / ऐतिहासिक संदर्भ",
    bestRecorded: "بہترین ریکارڈ / सर्वश्रेष्ठ दर्ज",
    averageYield: "اوسط پیداوار / औसत उपज",
  },
  kok: {
    yieldPrediction: "उत्पादन अंदाज निकाललेले परिणाम",
    tonsPerHectare: "हेक्टारान टन",
    confidence: "विश्वासार्हता",
    historicalAverage: "ऐतिहासिक सरासरी",
    trend: "चाल",
    factorAnalysis: "घटक विश्लेषण",
    impact: "प्रभाव",
    recommendations: "शिफारसी",
    historicalContext: "ऐतिहासिक संदर्भ",
    bestRecorded: "सर्वोत्तम नोंद",
    averageYield: "सरासरी उत्पादन",
  },
  mai: {
    yieldPrediction: "उपज पूर्वानुमान परिणाम",
    tonsPerHectare: "टन/हेक्टेयर",
    confidence: "विश्वासनीयता",
    historicalAverage: "ऐतिहासिक औसत",
    trend: "रुझान",
    factorAnalysis: "कारक विश्लेषण",
    impact: "प्रभाव",
    recommendations: "सिफ़ारिशें",
    historicalContext: "ऐतिहासिक संदर्भ",
    bestRecorded: "सर्वश्रेष्ठ दर्ज",
    averageYield: "औसत उपज",
  },
  ml: {
    yieldPrediction: "ഫലം പ്രവചനം ഫലം",
    tonsPerHectare: "ഹെക്ടറിൽ ടൺ",
    confidence: "വിശ്വാസ്യത",
    historicalAverage: "ചരിത്രപരമായ ശരാശരി",
    trend: "പ്രവണത",
    factorAnalysis: "ഘടക വിശകലനം",
    impact: "പ്രഭാവം",
    recommendations: "ശുപാർശകൾ",
    historicalContext: "ചരിത്രപരമായ പശ്ചാത്തലം",
    bestRecorded: "മികച്ച റെക്കോർഡ്",
    averageYield: "ശരാശരി വിള",
  },
  mni: {
    yieldPrediction: "ꯑꯨꯝꯗꯦꯟ ꯄꯨꯔꯕꯥꯅꯨꯃꯥꯟ ꯑꯣꯜꯐꯥꯜ",
    tonsPerHectare: "ꯍꯦꯛꯇꯔꯦ ꯄꯔꯤ ꯇꯣꯟ",
    confidence: "ꯋꯤꯡꯐꯣꯏꯅꯠꯗꯤ",
    historicalAverage: "ꯑꯢꯇꯤꯍꯥꯁꯤꯛ ꯁꯔꯥꯁ꯭",
    trend: "ꯄ꯭ꯔꯦꯏꯡ",
    factorAnalysis: "ꯄ꯭ꯔꯦꯡ ꯑꯣꯛꯀꯥꯟ ꯑꯣꯡꯁ꯭",
    impact: "ꯄ꯭ꯔꯦꯏꯄꯥꯛ",
    recommendations: "ꯁꯨꯄꯥꯔꯥꯁꯤ",
    historicalContext: "ꯑꯢꯇꯤꯍꯥꯁꯤꯛ ꯁꯦꯡꯗꯕꯥꯜ",
    bestRecorded: "ꯁꯔꯚꯣꯇꯝ ꯑꯣꯛꯀ꯭",
    averageYield: "ꯁꯔꯥꯁ꯭ ꯑꯨꯝꯗꯦꯟ",
  },
  ne: {
    yieldPrediction: "उपज पूर्वानुमान परिणाम",
    tonsPerHectare: "टन/हेक्टेयर",
    confidence: "विश्वसनीयता",
    historicalAverage: "ऐतिहासिक औसत",
    trend: "प्रवृत्ति",
    factorAnalysis: "घटक विश्लेषण",
    impact: "प्रभाव",
    recommendations: "सिफ़ारिशें",
    historicalContext: "ऐतिहासिक संदर्भ",
    bestRecorded: "सर्वश्रेष्ठ दर्ज",
    averageYield: "औसत उपज",
  },
  or: {
    yieldPrediction: "ଉତ୍ପାଦନ ପୂର୍ବାନୁମାନ ପରିଣାମ",
    tonsPerHectare: "ହେକ୍ଟର ପ୍ରତି ଟନ୍",
    confidence: "ବିଶ୍ୱସନୀୟତା",
    historicalAverage: "ଇତିହାସଗତ ହାରାହାରି",
    trend: "ପ୍ରବୃତ୍ତି",
    factorAnalysis: "ଘଟକ ବିଶ୍ଲେଷଣ",
    impact: "ପ୍ରଭାବ",
    recommendations: "ସୁପାରିଶ",
    historicalContext: "ଇତିହାସଗତ ପ୍ରସଙ୍ଗ",
    bestRecorded: "ସର୍ବୋତ୍ତମ ରେକର୍ଡ",
    averageYield: "ଗড় ଉତ୍ପାଦନ",
  },
  pa: {
    yieldPrediction: "ਫਸਲ ਭਵਿੱਖਬਾਣੀ ਨਤੀਜੇ",
    tonsPerHectare: "ਹੈਕਟਰ ਪ੍ਰਤੀ ਟਨ",
    confidence: "ਭਰੋਸਾ",
    historicalAverage: "ਇਤਿਹਾਸਕ ਔਸਤ",
    trend: "ਰੁਝਾਨ",
    factorAnalysis: "ਘਟਕ ਵਿਸ਼ਲੇਸ਼ਣ",
    impact: "ਪ੍ਰਭਾਵ",
    recommendations: "ਸਿਫ਼ਾਰਸ਼ਾਂ",
    historicalContext: "ਇਤਿਹਾਸਕ ਪ੍ਰਸੰਗ",
    bestRecorded: "ਸਰਵੋਤਮ ਦਰਜ",
    averageYield: "ਔਸਤ ਫਸਲ",
  },
  sa: {
    yieldPrediction: "उपज पूर्वानुमान परिणाम",
    tonsPerHectare: "टन/हेक्टेयर",
    confidence: "विश्वसनीयता",
    historicalAverage: "ऐतिहासिक औसत",
    trend: "प्रवृत्ति",
    factorAnalysis: "घटक विश्लेषण",
    impact: "प्रभाव",
    recommendations: "सिफ़ारिशें",
    historicalContext: "ऐतिहासिक संदर्भ",
    bestRecorded: "सर्वश्रेष्ठ दर्ज",
    averageYield: "औसत उपज",
  },
  ta: {
    yieldPrediction: "பயிர் முன்னறிவிப்பு முடிவுகள்",
    tonsPerHectare: "ஹெக்டேர் ஒன்றுக்கு டன்",
    confidence: "நம்பிக்கை",
    historicalAverage: "வரலாற்று சராசரி",
    trend: "பிரவேசம்",
    factorAnalysis: "காரண பகுப்பு",
    impact: "பாதிப்பு",
    recommendations: "பரிந்துரைகள்",
    historicalContext: "வரலாற்று சூழல்",
    bestRecorded: "மிகச்சிறந்த பதிவுகள்",
    averageYield: "சராசரி உற்பத்தி",
  },
  te: {
    yieldPrediction: "పంట అంచనా ఫలితాలు",
    tonsPerHectare: "హెక్టారుకు టన్నులు",
    confidence: "నమ్మకం",
    historicalAverage: "చారిత్రక సగటు",
    trend: "ప్రవణత",
    factorAnalysis: "కారణ విశ్లేషణ",
    impact: "ప్రభావం",
    recommendations: "సిఫారసులు",
    historicalContext: "చారిత్రక సందర్భం",
    bestRecorded: "మంచి రికార్డ్",
    averageYield: "సగటు పంట",
  },
}



interface YieldPredictionInput {
  crop: string
  state: string
  season: string
  area: number
  rainfall: number
  fertilizer: number
  pesticide: number
}

interface YieldPredictionResult {
  predictedYield: number
  confidence: number
  factors: {
    rainfall: { impact: string; score: number }
    fertilizer: { impact: string; score: number }
    pesticide: { impact: string; score: number }
    historical: { impact: string; score: number }
  }
  recommendations: string[]
  historicalData: {
    averageYield: number
    bestYear: { year: number; yield: number }
    trend: string
  }
}

const cropList: { name: string; hindi: string }[] = [
  { name: "Rice", hindi: "चावल" },
  { name: "Wheat", hindi: "गेहूं" },
  { name: "Maize", hindi: "मकई" },
  { name: "Sugarcane", hindi: "गन्ना" },
  { name: "Cotton", hindi: "कपास" },
  { name: "Millets", hindi: "बाजरा" },
  { name: "Pulses", hindi: "दालें" },
  { name: "Barley", hindi: "जौ" },
  { name: "Bajra", hindi: "बाजरा" },
  { name: "Jowar", hindi: "ज्वार" },
  { name: "Soybean", hindi: "सोयाबीन" },
  { name: "Groundnut", hindi: "मूंगफली" },
  { name: "Mustard", hindi: "सरसों" },
  { name: "Sunflower", hindi: "सूरजमुखी" },
  { name: "Potato", hindi: "आलू" },
  { name: "Onion", hindi: "प्याज" },
  { name: "Tomato", hindi: "टमाटर" },
  { name: "Banana", hindi: "केला" },
  { name: "Tea", hindi: "चाय" },
  { name: "Coffee", hindi: "कॉफ़ी" },
  { name: "Coconut", hindi: "नारियल" },
  { name: "Rubber", hindi: "रबर" },
  { name: "Tobacco", hindi: "तंबाकू" },
  { name: "Peas", hindi: "मटर" },
  { name: "Chickpea", hindi: "चना" },
  { name: "Lentil", hindi: "मसूर" },
  { name: "Sesame", hindi: "तिल" },
  { name: "Castor", hindi: "अरंडी" },
  { name: "Sugar Beet", hindi: "गन्ना चुकंदर" },
  { name: "Cardamom", hindi: "इलायची" },
  { name: "Pepper", hindi: "काली मिर्च" },
]

const seasons: { name: string; hindi: string }[] = [
  { name: "Kharif", hindi: "खरीफ" },
  { name: "Rabi", hindi: "रबी" },
  { name: "Zaid", hindi: "जायद" },
  { name: "Annual", hindi: "वार्षिक" },
]

const indianStates: { name: string; hindi: string }[] = [
  { name: "Andhra Pradesh", hindi: "आंध्र प्रदेश" },
  { name: "Arunachal Pradesh", hindi: "अरुणाचल प्रदेश" },
  { name: "Assam", hindi: "असम" },
  { name: "Bihar", hindi: "बिहार" },
  { name: "Chhattisgarh", hindi: "छत्तीसगढ़" },
  { name: "Goa", hindi: "गोवा" },
  { name: "Gujarat", hindi: "गुजरात" },
  { name: "Haryana", hindi: "हरियाणा" },
  { name: "Himachal Pradesh", hindi: "हिमाचल प्रदेश" },
  { name: "Jharkhand", hindi: "झारखंड" },
  { name: "Karnataka", hindi: "कर्नाटक" },
  { name: "Kerala", hindi: "केरल" },
  { name: "Madhya Pradesh", hindi: "मध्य प्रदेश" },
  { name: "Maharashtra", hindi: "महाराष्ट्र" },
  { name: "Manipur", hindi: "मणिपुर" },
  { name: "Meghalaya", hindi: "मेघालय" },
  { name: "Mizoram", hindi: "मिज़ोरम" },
  { name: "Nagaland", hindi: "नागालैंड" },
  { name: "Odisha", hindi: "ओडिशा" },
  { name: "Punjab", hindi: "पंजाब" },
  { name: "Rajasthan", hindi: "राजस्थान" },
  { name: "Sikkim", hindi: "सिक्किम" },
  { name: "Tamil Nadu", hindi: "तमिलनाडु" },
  { name: "Telangana", hindi: "तेलंगाना" },
  { name: "Tripura", hindi: "त्रिपुरा" },
  { name: "Uttar Pradesh", hindi: "उत्तर प्रदेश" },
  { name: "Uttarakhand", hindi: "उत्तराखंड" },
  { name: "West Bengal", hindi: "पश्चिम बंगाल" },
]

type Language =
  | "en" | "mr" | "hi" | "as" | "bn" | "brx" | "doi"
  | "gu" | "kn" | "ks" | "kok" | "mai" | "ml" | "mni"
  | "ne" | "or" | "pa" | "sa" | "ta" | "te"

const recommendationTranslations: Record<Language, string[]> = {
  en: [
    "Consider supplemental irrigation due to low rainfall",
    "Increase fertilizer application based on soil test results",
    "Implement integrated pest management practices",
    "Follow Assam agricultural department guidelines",
  ],
  hi: [
    "कम वर्षा के कारण अतिरिक्त सिंचाई पर विचार करें",
    "मिट्टी परीक्षण के आधार पर उर्वरक का अनुप्रयोग बढ़ाएं",
    "एकीकृत कीट प्रबंधन प्रथाओं को लागू करें",
    "असम कृषि विभाग के दिशानिर्देशों का पालन करें",
  ],
  mr: [
    "कमीच्या पावसामुळे पूरक सिंचन विचारात घ्या",
    "मातीच्या चाचणीवर आधारित खत वापर वाढवा",
    "एकत्रित कीटक व्यवस्थापन पद्धती लागू करा",
    "असम कृषी विभागाच्या मार्गदर्शक सूचनांचे पालन करा",
  ],
  as: [
    "কম বৰষুণৰ বাবে অতিরিক্ত সিঞ্চাই বিবেচনা কৰক",
    "মাটিৰ পৰীক্ষাৰ ভিত্তিত সাৰ প্ৰয়োগ বৃদ্ধি কৰক",
    "সংহত কীটপতঙ্গ ব্যৱস্থাপনা অনুশীলন প্ৰয়োগ কৰক",
    "অসম কৃষি বিভাগৰ নিৰ্দেশনাৰ অনুসৰণ কৰক",
  ],
  bn: [
    "কম বৃষ্টিপাতের কারণে সম্পূরক সেচ বিবেচনা করুন",
    "মাটির পরীক্ষার ভিত্তিতে সার প্রয়োগ বৃদ্ধি করুন",
    "একীভূত কীট ব্যবস্থাপনা পদ্ধতি প্রয়োগ করুন",
    "অসম কৃষি বিভাগের নির্দেশিকা অনুসরণ করুন",
  ],
  brx: [
    "কম বৰষুণ বতানে সম্পূরক সিঞ্চাই বিবেচনা করিবা",
    "মাটিৰ পৰীক্ষা অনুসারে সাৰ ব্যৱহাৰ বৃদ্ধি করিবা",
    "সংহত কীটনাশক ব্যৱস্থাপনা পদ্ধতি প্রয়োগ করিবা",
    "অসম কৃষি বিভাগৰ নিৰ্দেশনা মানিবা",
  ],
  doi: [
    "घटवार बारिश के कारण अतिरिक्त सिंचाई पर विचार करें",
    "मिट्टी परीक्षण के अनुसार उर्वरक की मात्रा बढ़ाएं",
    "एकीकृत कीट प्रबंधन प्रथाओं को लागू करें",
    "असम कृषि विभाग के निर्देशों का पालन करें",
  ],
  gu: [
    "ઓછા વરસાદના કારણે પૂરક સિંચાઈ પર વિચાર કરો",
    "મૃદા પરીક્ષણના આધારે ખાતરનો ઉપયોગ વધારવો",
    "એકીકૃત કીટ નિયંત્રણ પ્રથાઓ અમલમાં લાવો",
    "અસામ કૃષિ વિભાગની માર્ગદર્શિકા અનુસરો",
  ],
  kn: [
    "ತಗ್ಗು ಮಳೆ ಕಾರಣ ಪೂರಕ ನೀರಾವರಿ ಪರಿಗಣಿಸಿ",
    "ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ಆಧಾರವಾಗಿ ರಸಗೊಬ್ಬರವನ್ನು ಹೆಚ್ಚಿಸಿ",
    "ಸಮಗ್ರ ಕೀಟ ನಿರ್ವಹಣಾ ವಿಧಾನಗಳನ್ನು ಜಾರಿಗೆ ತಂದಿರಿ",
    "ಅಸ್ಸಾಂ ಕೃಷಿ ಇಲಾಖೆ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಅನುಸರಿಸಿ",
  ],
  ks: [
    "کم بارش کی وجہ سے اضافی آبپاشی پر غور کریں",
    "مٹی کے ٹیسٹ کے مطابق کھاد کی مقدار بڑھائیں",
    "یکجا کیڑے مینجمنٹ طریقے نافذ کریں",
    "آسام زرعی محکمہ کی رہنمائی پر عمل کریں",
  ],
  kok: [
    "थोड्या पावसामुळे पूरक सिंचन विचार करा",
    "माती चाचणी नुसार खत वाढवा",
    "एकत्रित कीटक व्यवस्थापन पद्धती लागू करा",
    "अस्सम कृषी विभाग मार्गदर्शकाचे पालन करा",
  ],
  mai: [
    "घटवार वर्षा के कारण पूरक सिंचाई पर विचार करें",
    "मिट्टी परीक्षण अनुसार उर्वरक बढ़ाएं",
    "एकीकृत कीट प्रबंधन प्रथाओं को लागू करें",
    "असम कृषि विभाग के निर्देशों का पालन करें",
  ],
  ml: [
    "കുറഞ്ഞ മഴയുടെ കാരണത്താൽ അനുകൂല സെഞ്ചെഷൻ പരിഗണിക്കുക",
    "മണ്ണ് പരിശോധന പ്രകാരം സാരിയുടെ ഉപയോഗം വർധിപ്പിക്കുക",
    "സംയുക്ത കീട നിയന്ത്രണ പద్ధതികൾ നടപ്പാക്കുക",
    "അസ്സാം കൃഷി വകുപ്പ് മാർഗ്ഗനിർദേശങ്ങൾ പാലിക്കുക",
  ],
  mni: [
    "কম বৰষুণৰ বাবে অতিরিক্ত সিঞ্চাই বিবেচনা কৰক",
    "মাটিৰ পৰীক্ষাৰ ভিত্তিত সাৰ প্ৰয়োগ বৃদ্ধি কৰক",
    "সংহত কীটপতঙ্গ ব্যৱস্থাপনা অনুশীলন প্ৰয়োগ কৰক",
    "অসম কৃষি বিভাগৰ নিৰ্দেশনাৰ অনুসৰণ কৰক",
  ],
  ne: [
    "कम वर्षाको कारण पूरक सिंचाइको विचार गर्नुहोस्",
    "माटो परीक्षण अनुसार मलको मात्रा बढाउनुहोस्",
    "एकीकृत कीरा व्यवस्थापन अभ्यासहरू लागू गर्नुहोस्",
    "असम कृषि विभागका निर्देशहरू पालना गर्नुहोस्",
  ],
  or: [
    "କମ ବର୍ଷା ହେତୁ ପୁରକ ସିଂଚାଇ ବିଚାର କରନ୍ତୁ",
    "ମାଟି ପରୀକ୍ଷା ଅନୁଯାୟୀ ଖାଦ ବୃଦ୍ଧି କରନ୍ତୁ",
    "ସମ୍ମିଳିତ ପୋକ ନିୟନ୍ତ୍ରଣ ପ୍ରଥା ପ୍ରୟୋଗ କରନ୍ତୁ",
    "ଅସମ କୃଷି ବିଭାଗର ନିର୍ଦ୍ଦେଶନାଲୀକା ଅନୁସରଣ କରନ୍ତୁ",
  ],
  pa: [
    "ਘੱਟ ਬਾਰਿਸ਼ ਕਾਰਨ ਪੂਰਕ ਸਿੰਚਾਈ 'ਤੇ ਵਿਚਾਰ ਕਰੋ",
    "ਮਿੱਟੀ ਟੈਸਟ ਅਨੁਸਾਰ ਖਾਦ ਦੀ ਵਰਤੋਂ ਵਧਾਓ",
    "ਇਕਤ੍ਰਿਤ ਕੀਟ ਪ੍ਰਬੰਧਨ ਪ੍ਰਥਾਵਾਂ ਨੂੰ ਲਾਗੂ ਕਰੋ",
    "ਅਸਾਮ ਖੇਤੀ ਵਿਭਾਗ ਦੇ ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ",
  ],
  sa: [
    "वर्षा अल्पस्य कारणं पूरक सिंचनं चिन्तनीयम्",
    "मृत्तिकापरीक्षणानुसार उर्वरकस्य उपयोगः वृद्धव्यम्",
    "सामेकीकृत कीट प्रबन्धन पद्धतयः क्रियाः",
    "अस्साम् कृषी विभागस्य निर्देशान् अनुसरतु",
  ],
  ta: [
    "குறைந்த மழையால் கூடுதல் நீர் சண்ணம் பரிசீலனை செய்யவும்",
    "மண் பரிசோதனை அடிப்படையில் உர உபயோகத்தை அதிகரிக்கவும்",
    "ஒற்றுமை பூச்சி மேலாண்மை நடைமுறைகளை செயல்படுத்தவும்",
    "அசாம் வேளாண் துறையின் வழிகாட்டுதல்களை பின்பற்றவும்",
  ],
  te: [
    "తక్కువ వర్షానికి దృష్టించి అదనపు సాగు నీరు పరిగణించండి",
    "మట్టిపరీక్షల ఆధారంగా రసాయన వాడకాన్ని పెంచండి",
    "సమగ్ర పురుగు నిర్వహణ పద్ధతులను అమలు చేయండి",
    "అస్సాం వ్యవసాయ శాఖ సూచనలను అనుసరించండి",
  ],
}

export default function YieldPredictor() {
  
  const { t } = useLanguage()
 const [inputData, setInputData] = useState<YieldPredictionInput>({
    crop: "",
    state: "",
    season: "",
    area: 0,
    rainfall: 0,
    fertilizer: 0,
    pesticide: 0,
  })
  const { language } = useLanguage()
  const tLabels = predictionLabels[language] || predictionLabels.en

  const [prediction, setPrediction] = useState<YieldPredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof YieldPredictionInput, value: string | number) => {
    setInputData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/yield-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      })
      if (!response.ok) throw new Error("Failed to predict yield")
      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200"
      case "negative":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const translateOption = (option: { name: string; hindi?: string; marathi?: string }) => {
    if (language === "hi") return option.hindi || option.name
    if (language === "mr") return option.marathi || option.name
    return option.name
  }
const recs = recommendationTranslations[language]
  return (
    <div className="space-y-6">
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Crop */}
    <div className="space-y-2">
      <Label htmlFor="crop" className="text-black dark:text-white">{t("crops.crop")}</Label>
      <Select value={inputData.crop} onValueChange={(value) => handleInputChange("crop", value)}>
        <SelectTrigger className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700">
          <SelectValue placeholder={t("crops.select_crop")} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
          {cropList.map((crop) => (
            <SelectItem key={crop.name} value={crop.name}>
              {crop.name} ({crop.hindi})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* State */}
    <div className="space-y-2">
      <Label htmlFor="state" className="text-black dark:text-white">{t("crops.state")}</Label>
      <Select value={inputData.state} onValueChange={(value) => handleInputChange("state", value)}>
        <SelectTrigger className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700">
          <SelectValue placeholder={t("crops.select_state")} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
          {indianStates.map((state) => (
            <SelectItem key={state.name} value={state.name}>
              {state.name} ({state.hindi})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Season */}
    <div className="space-y-2">
      <Label htmlFor="season" className="text-black dark:text-white">{t("crops.season")}</Label>
      <Select value={inputData.season} onValueChange={(value) => handleInputChange("season", value)}>
        <SelectTrigger className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700">
          <SelectValue placeholder={t("crops.select_season")} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
          {seasons.map((season) => (
            <SelectItem key={season.name} value={season.name}>
              {season.name} ({season.hindi})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Area */}
    <div className="space-y-2">
      <Label htmlFor="area" className="text-black dark:text-white">{t("crops.area")}</Label>
      <Input
        id="area"
        type="number"
        min="1"
        value={inputData.area || ""}
        onChange={(e) => handleInputChange("area", Number.parseFloat(e.target.value) || 0)}
        placeholder="e.g., 1000"
        required
        className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
      />
    </div>

    {/* Rainfall */}
    <div className="space-y-2">
      <Label htmlFor="rainfall" className="text-black dark:text-white">{t("crops.rainfallT")}</Label>
      <Input
        id="rainfall"
        type="number"
        min="0"
        max="5000"
        value={inputData.rainfall || ""}
        onChange={(e) => handleInputChange("rainfall", Number.parseFloat(e.target.value) || 0)}
        placeholder="e.g., 1200"
        required
        className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
      />
    </div>

    {/* Fertilizer */}
    <div className="space-y-2">
      <Label htmlFor="fertilizer" className="text-black dark:text-white">{t("crops.fertilizer")}</Label>
      <Input
        id="fertilizer"
        type="number"
        min="0"
        value={inputData.fertilizer || ""}
        onChange={(e) => handleInputChange("fertilizer", Number.parseFloat(e.target.value) || 0)}
        placeholder="e.g., 150000"
        required
        className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
      />
    </div>

    {/* Pesticide */}
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="pesticide" className="text-black dark:text-white">{t("crops.pesticide")}</Label>
      <Input
        id="pesticide"
        type="number"
        min="0"
        value={inputData.pesticide || ""}
        onChange={(e) => handleInputChange("pesticide", Number.parseFloat(e.target.value) || 0)}
        placeholder="e.g., 2000"
        required
        className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
      />
    </div>

    {/* Submit Button */}
    <div className="md:col-span-2">
      <Button
        type="submit"
      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
        disabled={isLoading || !inputData.crop || !inputData.state || !inputData.season}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("crops.predict_yeild")}
          </>
        ) : (
          <>
            <Target className="w-4 h-4 mr-2" />
            {t("crops.yeild")}
          </>
        )}
      </Button>
    </div>
  </form>

  {/* Error */}
  {error && (
    <Alert className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}

  {/* Prediction Section */}
  {prediction && (
    <div className="space-y-6">
      {/* Main Prediction */}
      <Card className="border-2 border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900 dark:text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" /> {tLabels.yieldPrediction}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-black dark:text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{prediction.predictedYield}</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">{tLabels.tonsPerHectare}</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getConfidenceColor(prediction.confidence)}`}>{prediction.confidence}%</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">{tLabels.confidence}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{prediction.historicalData.averageYield}</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">{tLabels.historicalAverage}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Badge variant="outline" className="flex items-center gap-2 text-black dark:text-white border-gray-400 dark:border-gray-600">
              <MapPin className="w-3 h-3" /> {translateOption({ name: inputData.state })}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 text-black dark:text-white border-gray-400 dark:border-gray-600">
              <Calendar className="w-3 h-3" /> {translateOption({ name: inputData.season })}
            </Badge>
            <Badge variant="outline" className="capitalize text-black dark:text-white border-gray-400 dark:border-gray-600">{tLabels.trend}: {prediction.historicalData.trend}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Factor Analysis */}
      <Card className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> {tLabels.factorAnalysis}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(prediction.factors).map(([factor, data]) => (
              <div key={factor} className={`p-3 border rounded-lg ${getImpactColor(data.impact)} bg-white dark:bg-gray-700`}>
                <div className="flex items-center justify-between mb-2 text-black dark:text-white">
                  <span className="font-medium capitalize">{factor}</span>
                  <Badge variant="secondary">{data.score}/100</Badge>
                </div>
                <div className="text-sm capitalize">{tLabels.impact}: {data.impact}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> {tLabels.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recs.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-black dark:text-white">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Historical Context */}
      <Card className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> {tLabels.historicalContext}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-300">{tLabels.averageYield}</p>
              <p className="text-lg font-semibold">{prediction.historicalData.averageYield} {tLabels.tonsPerHectare}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-300">{tLabels.bestRecorded}</p>
              <p className="text-lg font-semibold">{prediction.historicalData.bestYear.yield} {tLabels.tonsPerHectare} ({prediction.historicalData.bestYear.year})</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-300">{tLabels.trend}</p>
              <p className="text-lg font-semibold capitalize">{prediction.historicalData.trend}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )}
</div>

  )
}
