"""
Setup script for multilingual support in AgriBot
This script helps configure language models and voice recognition for Indian languages
"""

import json
import os
from pathlib import Path

def create_language_config():
    """
    Create configuration for multilingual support
    """
    language_config = {
        "supported_languages": {
            "en": {
                "name": "English",
                "native_name": "English",
                "speech_code": "en-IN",
                "voice_enabled": True,
                "text_direction": "ltr"
            },
            "hi": {
                "name": "Hindi",
                "native_name": "हिंदी",
                "speech_code": "hi-IN",
                "voice_enabled": True,
                "text_direction": "ltr"
            },
            "mr": {
                "name": "Marathi",
                "native_name": "मराठी",
                "speech_code": "mr-IN",
                "voice_enabled": True,
                "text_direction": "ltr"
            },
            "ta": {
                "name": "Tamil",
                "native_name": "தமிழ்",
                "speech_code": "ta-IN",
                "voice_enabled": True,
                "text_direction": "ltr"
            },
            "te": {
                "name": "Telugu",
                "native_name": "తెలుగు",
                "speech_code": "te-IN",
                "voice_enabled": True,
                "text_direction": "ltr"
            }
        },
        "default_language": "en",
        "fallback_language": "en",
        "voice_settings": {
            "recognition_timeout": 5000,
            "speech_rate": 0.9,
            "speech_pitch": 1.0,
            "speech_volume": 0.8
        }
    }
    
    # Save configuration
    config_path = Path("config/languages.json")
    config_path.parent.mkdir(exist_ok=True)
    
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(language_config, f, indent=2, ensure_ascii=False)
    
    print(f"Language configuration saved to {config_path}")
    return language_config

def create_agricultural_vocabulary():
    """
    Create agricultural vocabulary for different Indian languages
    """
    agricultural_terms = {
        "en": {
            "crops": ["rice", "wheat", "maize", "cotton", "sugarcane", "soybean", "chickpea", "lentil"],
            "diseases": ["leaf blight", "powdery mildew", "bacterial spot", "rust", "mosaic virus"],
            "nutrients": ["nitrogen", "phosphorus", "potassium", "organic matter"],
            "farming_terms": ["irrigation", "fertilizer", "pesticide", "harvest", "sowing", "transplanting"],
            "soil_types": ["clay", "sandy", "loamy", "black soil", "red soil"],
            "seasons": ["kharif", "rabi", "zaid", "monsoon", "winter", "summer"]
        },
        "hi": {
            "crops": ["चावल", "गेहूं", "मक्का", "कपास", "गन्ना", "सोयाबीन", "चना", "मसूर"],
            "diseases": ["पत्ती झुलसा", "चूर्णी फफूंदी", "जीवाणु धब्बा", "रतुआ", "मोज़ेक वायरस"],
            "nutrients": ["नाइट्रोजन", "फास्फोरस", "पोटेशियम", "जैविक पदार्थ"],
            "farming_terms": ["सिंचाई", "उर्वरक", "कीटनाशक", "फसल", "बुवाई", "रोपाई"],
            "soil_types": ["चिकनी मिट्टी", "रेतीली मिट्टी", "दोमट मिट्टी", "काली मिट्टी", "लाल मिट्टी"],
            "seasons": ["खरीफ", "रबी", "जायद", "मानसून", "सर्दी", "गर्मी"]
        },
        "mr": {
            "crops": ["तांदूळ", "गहू", "मका", "कापूस", "ऊस", "सोयाबीन", "हरभरा", "मसूर"],
            "diseases": ["पान जळजळ", "पांढरा बुरशी", "जीवाणू डाग", "गंज", "मोझेक विषाणू"],
            "nutrients": ["नायट्रोजन", "फॉस्फरस", "पोटॅशियम", "सेंद्रिय पदार्थ"],
            "farming_terms": ["पाणी पुरवठा", "खत", "कीटकनाशक", "कापणी", "पेरणी", "लावणी"],
            "soil_types": ["चिकणमाती", "वाळूमाती", "दोमट माती", "काळी माती", "लाल माती"],
            "seasons": ["खरीप", "रब्बी", "उन्हाळी", "पावसाळा", "हिवाळा", "उन्हाळा"]
        },
        "ta": {
            "crops": ["அரிசி", "கோதுமை", "சோளம்", "பருத்தி", "கரும்பு", "சோயாபீன்", "கடலை", "பருப்பு"],
            "diseases": ["இலை கருகல்", "பொடி பூஞ்சை", "பாக்டீரியா புள்ளி", "துரு", "மொசைக் வைரஸ்"],
            "nutrients": ["நைட்ரஜன்", "பாஸ்பரஸ்", "பொட்டாசியம்", "கரிம பொருள்"],
            "farming_terms": ["நீர்ப்பாசனம்", "உரம்", "பூச்சிக்கொல்லி", "அறுவடை", "விதைப்பு", "நடவு"],
            "soil_types": ["களிமண்", "மணல் மண்", "கலப்பு மண்", "கருப்பு மண்", "சிவப்பு மண்"],
            "seasons": ["கரீப்", "ரபி", "சைத்", "பருவமழை", "குளிர்காலம்", "கோடைகாலம்"]
        },
        "te": {
            "crops": ["వరి", "గోధుమ", "మొక్కజొన్న", "పత్తి", "చెరకు", "సోయాబీన్", "శనగ", "పప్పు"],
            "diseases": ["ఆకు కాలిక", "పొడి బూజు", "బ్యాక్టీరియా మచ్చ", "తుప్పు", "మొసాయిక్ వైరస్"],
            "nutrients": ["నైట్రోజన్", "ఫాస్పరస్", "పొటాషియం", "సేంద్రీయ పదార్థం"],
            "farming_terms": ["నీటిపారుదల", "ఎరువులు", "కీటకనాశకం", "కోత", "విత్తనం", "నాట్లు"],
            "soil_types": ["బంకమట్టి", "ఇసుక మట్టి", "మిశ్రమ మట్టి", "నల్ల మట్టి", "ఎర్ర మట్టి"],
            "seasons": ["ఖరీఫ్", "రబీ", "జాయిద్", "వర్షాకాలం", "చలికాలం", "వేసవికాలం"]
        }
    }
    
    # Save vocabulary
    vocab_path = Path("config/agricultural_vocabulary.json")
    vocab_path.parent.mkdir(exist_ok=True)
    
    with open(vocab_path, 'w', encoding='utf-8') as f:
        json.dump(agricultural_terms, f, indent=2, ensure_ascii=False)
    
    print(f"Agricultural vocabulary saved to {vocab_path}")
    return agricultural_terms

def create_voice_prompts():
    """
    Create voice interaction prompts for different languages
    """
    voice_prompts = {
        "en": {
            "welcome": "Welcome to AgriBot! You can ask me about farming, crops, diseases, or soil management.",
            "listening": "I'm listening. Please speak your question.",
            "processing": "Processing your request...",
            "error": "Sorry, I couldn't understand that. Please try again.",
            "help": "You can ask me about crop recommendations, disease identification, soil health, or farming techniques."
        },
        "hi": {
            "welcome": "एग्रीबॉट में आपका स्वागत है! आप मुझसे खेती, फसलों, रोगों या मिट्टी प्रबंधन के बारे में पूछ सकते हैं।",
            "listening": "मैं सुन रहा हूँ। कृपया अपना प्रश्न बोलें।",
            "processing": "आपके अनुरोध को संसाधित कर रहा हूँ...",
            "error": "माफ करें, मैं इसे समझ नहीं सका। कृपया पुनः प्रयास करें।",
            "help": "आप मुझसे फसल सिफारिश, रोग पहचान, मिट्टी स्वास्थ्य या खेती तकनीकों के बारे में पूछ सकते हैं।"
        },
        "mr": {
            "welcome": "एग्रीबॉटमध्ये आपले स्वागत आहे! तुम्ही मला शेती, पिके, रोग किंवा माती व्यवस्थापनाबद्दल विचारू शकता.",
            "listening": "मी ऐकत आहे. कृपया तुमचा प्रश्न बोला.",
            "processing": "तुमची विनंती प्रक्रिया करत आहे...",
            "error": "माफ करा, मला ते समजले नाही. कृपया पुन्हा प्रयत्न करा.",
            "help": "तुम्ही मला पीक शिफारस, रोग ओळख, माती आरोग्य किंवा शेती तंत्रांबद्दल विचारू शकता."
        },
        "ta": {
            "welcome": "அக்ரிபாட்டிற்கு வரவேற்கிறோம்! விவசாயம், பயிர்கள், நோய்கள் அல்லது மண் மேலாண்மை பற்றி என்னிடம் கேட்கலாம்.",
            "listening": "நான் கேட்கிறேன். உங்கள் கேள்வியைச் சொல்லுங்கள்.",
            "processing": "உங்கள் கோரிக்கையை செயலாக்குகிறேன்...",
            "error": "மன்னிக்கவும், என்னால் அதைப் புரிந்து கொள்ள முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
            "help": "பயிர் பரிந்துரை, நோய் அடையாளம், மண் ஆரோக்கியம் அல்லது விவசாய நுட்பங்கள் பற்றி என்னிடம் கேட்கலாம்."
        },
        "te": {
            "welcome": "అగ్రిబాట్‌కు స్వాగతం! వ్యవసాయం, పంటలు, వ్యాధులు లేదా మట్టి నిర్వహణ గురించి నన్ను అడగవచ్చు.",
            "listening": "నేను వింటున్నాను. దయచేసి మీ ప్రశ్న చెప్పండి.",
            "processing": "మీ అభ్యర్థనను ప్రాసెస్ చేస్తున్నాను...",
            "error": "క్షమించండి, నేను అర్థం చేసుకోలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి.",
            "help": "పంట సిఫార్సు, వ్యాధి గుర్తింపు, మట్టి ఆరోగ్యం లేదా వ్యవసాయ పద్ధతుల గురించి నన్ను అడగవచ్చు."
        }
    }
    
    # Save voice prompts
    prompts_path = Path("config/voice_prompts.json")
    prompts_path.parent.mkdir(exist_ok=True)
    
    with open(prompts_path, 'w', encoding='utf-8') as f:
        json.dump(voice_prompts, f, indent=2, ensure_ascii=False)
    
    print(f"Voice prompts saved to {prompts_path}")
    return voice_prompts

def setup_speech_recognition_models():
    """
    Setup information for speech recognition models
    """
    speech_models = {
        "browser_support": {
            "chrome": {
                "supported_languages": ["en-IN", "hi-IN", "mr-IN", "ta-IN", "te-IN"],
                "quality": "high",
                "offline": False
            },
            "firefox": {
                "supported_languages": ["en-IN"],
                "quality": "medium",
                "offline": False
            },
            "safari": {
                "supported_languages": ["en-IN"],
                "quality": "medium",
                "offline": False
            }
        },
        "recommended_settings": {
            "continuous": False,
            "interimResults": True,
            "maxAlternatives": 1,
            "timeout": 5000
        },
        "fallback_options": {
            "text_input": True,
            "translation_api": True,
            "offline_mode": False
        }
    }
    
    # Save speech models info
    models_path = Path("config/speech_models.json")
    models_path.parent.mkdir(exist_ok=True)
    
    with open(models_path, 'w', encoding='utf-8') as f:
        json.dump(speech_models, f, indent=2, ensure_ascii=False)
    
    print(f"Speech models configuration saved to {models_path}")
    return speech_models

if __name__ == "__main__":
    print("Setting up multilingual support for AgriBot...")
    print("=" * 50)
    
    # Create necessary directories
    os.makedirs("config", exist_ok=True)
    
    # Setup language configuration
    print("\n1. Creating language configuration...")
    lang_config = create_language_config()
    
    # Setup agricultural vocabulary
    print("\n2. Creating agricultural vocabulary...")
    vocab = create_agricultural_vocabulary()
    
    # Setup voice prompts
    print("\n3. Creating voice prompts...")
    prompts = create_voice_prompts()
    
    # Setup speech recognition models
    print("\n4. Setting up speech recognition models...")
    speech_models = setup_speech_recognition_models()
    
    print("\n" + "=" * 50)
    print("Multilingual setup completed successfully!")
    print("\nFiles created:")
    print("- config/languages.json")
    print("- config/agricultural_vocabulary.json") 
    print("- config/voice_prompts.json")
    print("- config/speech_models.json")
    
    print(f"\nSupported languages: {list(lang_config['supported_languages'].keys())}")
    print("Voice recognition enabled for all Indian languages!")
    
    print("\nNext steps:")
    print("1. Test voice recognition in different browsers")
    print("2. Verify speech synthesis for all languages")
    print("3. Train custom models if needed for better accuracy")
    print("4. Configure fallback mechanisms for unsupported browsers")
