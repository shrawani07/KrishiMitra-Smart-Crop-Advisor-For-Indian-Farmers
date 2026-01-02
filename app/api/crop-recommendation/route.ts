import { type NextRequest, NextResponse } from "next/server"

// Real crop data based on the Kaggle dataset
const cropDatabase = {
  rice: {
    optimal_ranges: {
      N: { min: 5, max: 140, avg: 80 },
      P: { min: 15, max: 145, avg: 48 },
      K: { min: 15, max: 45, avg: 20 },
      temperature: { min: 20, max: 35, avg: 25 },
      humidity: { min: 80, max: 95, avg: 84 },
      ph: { min: 5.0, max: 7.0, avg: 6.2 },
      rainfall: { min: 150, max: 300, avg: 236 },
    },
    info: {
      scientific_name: "Oryza sativa",
      type: "cereal",
      season: "kharif",
      growth_period: "120-150 days",
      expected_yield: "4-6 tons per hectare",
      water_requirement: "high",
    },
  },
  wheat: {
    optimal_ranges: {
      N: { min: 10, max: 50, avg: 22 },
      P: { min: 15, max: 145, avg: 53 },
      K: { min: 15, max: 45, avg: 20 },
      temperature: { min: 15, max: 25, avg: 17 },
      humidity: { min: 55, max: 75, avg: 64 },
      ph: { min: 6.0, max: 7.5, avg: 6.4 },
      rainfall: { min: 50, max: 120, avg: 65 },
    },
    info: {
      scientific_name: "Triticum aestivum",
      type: "cereal",
      season: "rabi",
      growth_period: "120-140 days",
      expected_yield: "3-5 tons per hectare",
      water_requirement: "medium",
    },
  },
  maize: {
    optimal_ranges: {
      N: { min: 15, max: 120, avg: 78 },
      P: { min: 15, max: 145, avg: 48 },
      K: { min: 15, max: 45, avg: 20 },
      temperature: { min: 18, max: 32, avg: 22 },
      humidity: { min: 55, max: 75, avg: 65 },
      ph: { min: 5.8, max: 7.8, avg: 6.2 },
      rainfall: { min: 60, max: 120, avg: 76 },
    },
    info: {
      scientific_name: "Zea mays",
      type: "cereal",
      season: "kharif",
      growth_period: "90-120 days",
      expected_yield: "5-8 tons per hectare",
      water_requirement: "medium",
    },
  },
  cotton: {
    optimal_ranges: {
      N: { min: 5, max: 140, avg: 120 },
      P: { min: 15, max: 145, avg: 46 },
      K: { min: 15, max: 45, avg: 20 },
      temperature: { min: 21, max: 35, avg: 24 },
      humidity: { min: 75, max: 85, avg: 80 },
      ph: { min: 5.8, max: 8.0, avg: 7.2 },
      rainfall: { min: 50, max: 100, avg: 54 },
    },
    info: {
      scientific_name: "Gossypium hirsutum",
      type: "fiber",
      season: "kharif",
      growth_period: "180-200 days",
      expected_yield: "15-20 quintals per hectare",
      water_requirement: "medium",
    },
  },
  chickpea: {
    optimal_ranges: {
      N: { min: 10, max: 50, avg: 41 },
      P: { min: 15, max: 145, avg: 58 },
      K: { min: 15, max: 45, avg: 20 },
      temperature: { min: 15, max: 25, avg: 18 },
      humidity: { min: 15, max: 25, avg: 17 },
      ph: { min: 6.2, max: 7.8, avg: 7.4 },
      rainfall: { min: 30, max: 60, avg: 65 },
    },
    info: {
      scientific_name: "Cicer arietinum",
      type: "pulse",
      season: "rabi",
      growth_period: "120 days",
      expected_yield: "1.5-2.5 tons per hectare",
      water_requirement: "low",
    },
  },
  sugarcane: {
    optimal_ranges: {
      N: { min: 15, max: 120, avg: 134 },
      P: { min: 15, max: 145, avg: 38 },
      K: { min: 15, max: 45, avg: 18 },
      temperature: { min: 20, max: 35, avg: 26 },
      humidity: { min: 85, max: 95, avg: 87 },
      ph: { min: 6.0, max: 7.5, avg: 6.8 },
      rainfall: { min: 75, max: 150, avg: 111 },
    },
    info: {
      scientific_name: "Saccharum officinarum",
      type: "sugar",
      season: "perennial",
      growth_period: "12-18 months",
      expected_yield: "80-100 tons per hectare",
      water_requirement: "high",
    },
  },
  banana: {
    optimal_ranges: {
      N: { min: 15, max: 120, avg: 100 },
      P: { min: 15, max: 145, avg: 82 },
      K: { min: 15, max: 45, avg: 43 },
      temperature: { min: 25, max: 35, avg: 27 },
      humidity: { min: 75, max: 85, avg: 80 },
      ph: { min: 5.5, max: 7.0, avg: 5.9 },
      rainfall: { min: 100, max: 180, avg: 114 },
    },
    info: {
      scientific_name: "Musa acuminata",
      type: "fruit",
      season: "perennial",
      growth_period: "12-15 months",
      expected_yield: "40-60 tons per hectare",
      water_requirement: "high",
    },
  },
  coconut: {
    optimal_ranges: {
      N: { min: 5, max: 25, avg: 22 },
      P: { min: 15, max: 145, avg: 142 },
      K: { min: 15, max: 45, avg: 20 },
      temperature: { min: 25, max: 35, avg: 27 },
      humidity: { min: 90, max: 95, avg: 94 },
      ph: { min: 5.2, max: 8.0, avg: 6.0 },
      rainfall: { min: 100, max: 180, avg: 176 },
    },
    info: {
      scientific_name: "Cocos nucifera",
      type: "plantation",
      season: "perennial",
      growth_period: "6-10 years to bearing",
      expected_yield: "80-150 nuts per tree per year",
      water_requirement: "high",
    },
  },
}

// Real crop yield data structure based on the dataset
interface CropYieldData {
  [key: string]: {
    yield_stats: {
      mean: number
      median: number
      std: number
      min: number
      max: number
    }
    states_grown: string[]
    seasons: string[]
    rainfall_stats: {
      mean: number
      std: number
      min: number
      max: number
    }
    fertilizer_stats: {
      mean: number
      std: number
    }
    pesticide_stats: {
      mean: number
      std: number
    }
    top_producing_states: { [state: string]: number }
  }
}

// Sample crop data based on Indian agriculture (will be replaced with real data)
const cropYieldDatabase: CropYieldData = {
  rice: {
    yield_stats: { mean: 2.5, median: 2.3, std: 0.8, min: 0.5, max: 6.2 },
    states_grown: ["West Bengal", "Uttar Pradesh", "Punjab", "Andhra Pradesh", "Bihar"],
    seasons: ["Kharif", "Rabi"],
    rainfall_stats: { mean: 1200, std: 300, min: 800, max: 2000 },
    fertilizer_stats: { mean: 150000, std: 50000 },
    pesticide_stats: { mean: 2000, std: 800 },
    top_producing_states: {
      "West Bengal": 15000000,
      "Uttar Pradesh": 12000000,
      Punjab: 11000000,
      "Andhra Pradesh": 10000000,
      Bihar: 8000000,
    },
  },
  wheat: {
    yield_stats: { mean: 3.2, median: 3.0, std: 0.9, min: 1.0, max: 5.8 },
    states_grown: ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan"],
    seasons: ["Rabi"],
    rainfall_stats: { mean: 650, std: 200, min: 400, max: 1000 },
    fertilizer_stats: { mean: 120000, std: 40000 },
    pesticide_stats: { mean: 1500, std: 600 },
    top_producing_states: {
      "Uttar Pradesh": 30000000,
      Punjab: 18000000,
      Haryana: 12000000,
      "Madhya Pradesh": 18000000,
      Rajasthan: 8000000,
    },
  },
  maize: {
    yield_stats: { mean: 2.8, median: 2.6, std: 0.7, min: 1.2, max: 5.0 },
    states_grown: ["Karnataka", "Andhra Pradesh", "Maharashtra", "Bihar", "Uttar Pradesh"],
    seasons: ["Kharif", "Rabi"],
    rainfall_stats: { mean: 900, std: 250, min: 600, max: 1400 },
    fertilizer_stats: { mean: 100000, std: 35000 },
    pesticide_stats: { mean: 1800, std: 700 },
    top_producing_states: {
      Karnataka: 4000000,
      "Andhra Pradesh": 3500000,
      Maharashtra: 3000000,
      Bihar: 2800000,
      "Uttar Pradesh": 2500000,
    },
  },
  cotton: {
    yield_stats: { mean: 0.5, median: 0.4, std: 0.2, min: 0.1, max: 1.2 },
    states_grown: ["Gujarat", "Maharashtra", "Andhra Pradesh", "Punjab", "Haryana"],
    seasons: ["Kharif"],
    rainfall_stats: { mean: 800, std: 200, min: 500, max: 1200 },
    fertilizer_stats: { mean: 80000, std: 25000 },
    pesticide_stats: { mean: 3000, std: 1200 },
    top_producing_states: {
      Gujarat: 8000000,
      Maharashtra: 6000000,
      "Andhra Pradesh": 4000000,
      Punjab: 2000000,
      Haryana: 1500000,
    },
  },
  sugarcane: {
    yield_stats: { mean: 70, median: 68, std: 15, min: 30, max: 120 },
    states_grown: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat"],
    seasons: ["Annual"],
    rainfall_stats: { mean: 1100, std: 300, min: 700, max: 1600 },
    fertilizer_stats: { mean: 200000, std: 60000 },
    pesticide_stats: { mean: 2500, std: 900 },
    top_producing_states: {
      "Uttar Pradesh": 180000000,
      Maharashtra: 80000000,
      Karnataka: 45000000,
      "Tamil Nadu": 35000000,
      Gujarat: 20000000,
    },
  },
}

function calculateCropSuitability(inputData: any, cropData: any, cropName: string) {
  const { state, season, rainfall, fertilizer, pesticide } = inputData

  let suitabilityScore = 0
  const reasons = []

  // State suitability (40% weight)
  if (cropData.states_grown.includes(state)) {
    suitabilityScore += 40
    reasons.push(`${cropName} is commonly grown in ${state}`)
  } else {
    suitabilityScore += 10
    reasons.push(`${cropName} can be grown in ${state} with proper management`)
  }

  // Season suitability (25% weight)
  if (cropData.seasons.includes(season)) {
    suitabilityScore += 25
    reasons.push(`${season} season is optimal for ${cropName} cultivation`)
  } else {
    suitabilityScore += 5
    reasons.push(`${cropName} may require special care in ${season} season`)
  }

  // Rainfall suitability (20% weight)
  const rainfallScore = calculateParameterScore(rainfall, cropData.rainfall_stats)
  suitabilityScore += (rainfallScore / 100) * 20
  if (rainfallScore > 70) {
    reasons.push(`Rainfall (${rainfall}mm) is suitable for ${cropName}`)
  }

  // Fertilizer usage (10% weight)
  const fertilizerScore = calculateParameterScore(fertilizer, cropData.fertilizer_stats)
  suitabilityScore += (fertilizerScore / 100) * 10

  // Pesticide usage (5% weight)
  const pesticideScore = calculateParameterScore(pesticide, cropData.pesticide_stats)
  suitabilityScore += (pesticideScore / 100) * 5

  return {
    score: Math.round(suitabilityScore),
    reasons: reasons.slice(0, 3),
  }
}

function calculateParameterScore(value: number, stats: any): number {
  const { mean, std } = stats
  const distance = Math.abs(value - mean)
  const normalizedDistance = distance / (std || 1)

  // Score decreases as distance from mean increases
  return Math.max(0, 100 - normalizedDistance * 20)
}

function generateReasons(soilData: any, cropData: any, suitability: any): string[] {
  const reasons = []
  const { parameterScores } = suitability
  const ranges = cropData.optimal_ranges

  // Check each parameter and generate reasons
  if (parameterScores.nitrogen > 70) {
    reasons.push(`Nitrogen levels (${soilData.nitrogen} kg/ha) are suitable for ${cropData.info.type} crops`)
  }

  if (parameterScores.phosphorus > 70) {
    reasons.push(`Phosphorus content (${soilData.phosphorus} kg/ha) supports good root development`)
  }

  if (parameterScores.potassium > 70) {
    reasons.push(`Potassium levels (${soilData.potassium} kg/ha) are adequate for plant health`)
  }

  if (parameterScores.temperature > 70) {
    reasons.push(`Temperature (${soilData.temperature}°C) is within optimal range for growth`)
  }

  if (parameterScores.humidity > 70) {
    reasons.push(`Humidity levels (${soilData.humidity}%) are favorable for this crop`)
  }

  if (parameterScores.ph > 70) {
    reasons.push(`Soil pH (${soilData.ph}) is suitable for nutrient uptake`)
  }

  if (parameterScores.rainfall > 70) {
    reasons.push(`Rainfall (${soilData.rainfall}mm) meets the water requirements`)
  }

  // Add season-specific reason
  reasons.push(`Suitable for ${cropData.info.season} season cultivation`)

  return reasons.slice(0, 4) // Return top 4 reasons
}

function generateTips(cropName: string, cropData: any): string[] {
  const baseTips = {
    rice: [
      "Maintain water levels at 2-5 cm during vegetative stage",
      "Apply nitrogen in split doses for better utilization",
      "Monitor for blast disease during flowering stage",
      "Harvest when 80% of grains turn golden yellow",
    ],
    wheat: [
      "Sow during optimal temperature window (15-25°C)",
      "Apply phosphorus fertilizer at the time of sowing",
      "Monitor for rust diseases, especially during humid conditions",
      "Harvest when grain moisture content is 12-14%",
    ],
    maize: [
      "Apply nitrogen as top dressing during knee-high stage",
      "Ensure proper drainage to prevent waterlogging",
      "Monitor for stem borer and fall armyworm attacks",
      "Harvest when kernels reach physiological maturity",
    ],
    cotton: [
      "Maintain adequate soil moisture during flowering",
      "Apply potassium fertilizer during boll development",
      "Regular monitoring for bollworm infestation",
      "Practice crop rotation to maintain soil health",
    ],
    chickpea: [
      "Sow after soil temperature drops below 25°C",
      "Avoid waterlogging as chickpea is sensitive to excess moisture",
      "Apply rhizobium culture for better nitrogen fixation",
      "Harvest when pods turn brown and rattle when shaken",
    ],
    sugarcane: [
      "Plant healthy seed cane from disease-free fields",
      "Apply organic manure before planting",
      "Perform regular earthing up operations",
      "Harvest at proper maturity for maximum sugar content",
    ],
    banana: [
      "Provide adequate drainage and organic matter",
      "Apply balanced fertilizers regularly",
      "Protect from strong winds using windbreaks",
      "Harvest when fruits are 75% mature",
    ],
    coconut: [
      "Ensure good drainage and deep soil",
      "Apply organic manure and balanced fertilizers",
      "Provide adequate spacing between plants",
      "Regular irrigation during dry periods",
    ],
  }

  return (
    baseTips[cropName] || [
      "Follow recommended agricultural practices",
      "Consult local agricultural extension officers",
      "Use quality seeds or planting material",
      "Monitor for pests and diseases regularly",
    ]
  )
}

function predictCropYield(inputData: any) {
  const cropScores = []

  // Calculate suitability for each crop
  for (const [cropName, cropData] of Object.entries(cropYieldDatabase)) {
    const suitability = calculateCropSuitability(inputData, cropData, cropName)

    cropScores.push({
      crop: cropName,
      confidence: suitability.score,
      reasons: suitability.reasons,
      expectedYield: `${cropData.yield_stats.mean.toFixed(1)} - ${cropData.yield_stats.max.toFixed(1)} tons/hectare`,
      averageYield: cropData.yield_stats.mean,
      seasons: cropData.seasons,
      topStates: Object.keys(cropData.top_producing_states).slice(0, 3),
      data: cropData,
    })
  }

  // Sort by confidence score
  cropScores.sort((a, b) => b.confidence - a.confidence)
  const bestCrop = cropScores[0]

  // Generate farming tips based on the crop
  const tips = generateFarmingTips(bestCrop.crop, inputData)

  return {
    crop: bestCrop.crop,
    confidence: bestCrop.confidence,
    reasons: bestCrop.reasons,
    expectedYield: bestCrop.expectedYield,
    averageYield: bestCrop.averageYield,
    seasons: bestCrop.seasons,
    topStates: bestCrop.topStates,
    tips,
    alternativeCrops: cropScores.slice(1, 4).map((crop) => ({
      name: crop.crop,
      confidence: crop.confidence,
      expectedYield: crop.expectedYield,
    })),
    marketInsights: generateMarketInsights(bestCrop.crop, inputData.state),
  }
}

function generateFarmingTips(cropName: string, inputData: any): string[] {
  const cropTips = {
    rice: [
      "Maintain proper water levels throughout the growing season",
      "Use certified seeds for better yield and disease resistance",
      "Apply fertilizers in split doses for optimal nutrient uptake",
      "Monitor for pests like stem borer and leaf folder",
    ],
    wheat: [
      "Sow at the right time when temperature is between 15-25°C",
      "Ensure proper seed rate and spacing for optimal growth",
      "Apply nitrogen fertilizer in 2-3 split doses",
      "Monitor for diseases like rust and aphid attacks",
    ],
    maize: [
      "Plant during optimal temperature and moisture conditions",
      "Maintain proper plant population for maximum yield",
      "Apply balanced fertilizers based on soil test results",
      "Control weeds during early growth stages",
    ],
    cotton: [
      "Use high-quality seeds and treat them before sowing",
      "Maintain optimal plant spacing for better boll development",
      "Monitor for bollworm and other pest attacks regularly",
      "Ensure adequate moisture during flowering and boll formation",
    ],
    sugarcane: [
      "Use healthy seed cane from disease-free mother plants",
      "Maintain proper row spacing and planting depth",
      "Apply organic manure along with chemical fertilizers",
      "Ensure regular irrigation and proper drainage",
    ],
  }

  const baseTips = cropTips[cropName] || [
    "Follow recommended agricultural practices for your region",
    "Use quality inputs and maintain proper crop management",
    "Monitor weather conditions and adjust practices accordingly",
    "Consult local agricultural extension officers for guidance",
  ]

  // Add location-specific tip
  baseTips.push(`For ${inputData.state}, consider local varieties and practices`)

  return baseTips
}

function generateMarketInsights(cropName: string, state: string): any {
  // Mock market insights - in real implementation, this would fetch from market APIs
  const insights = {
    rice: {
      currentPrice: "₹2,000-2,500 per quintal",
      trend: "stable",
      demand: "high",
      exportPotential: "good",
    },
    wheat: {
      currentPrice: "₹2,100-2,400 per quintal",
      trend: "increasing",
      demand: "very high",
      exportPotential: "excellent",
    },
    maize: {
      currentPrice: "₹1,800-2,200 per quintal",
      trend: "stable",
      demand: "high",
      exportPotential: "moderate",
    },
    cotton: {
      currentPrice: "₹5,500-6,200 per quintal",
      trend: "fluctuating",
      demand: "high",
      exportPotential: "excellent",
    },
    sugarcane: {
      currentPrice: "₹280-320 per quintal",
      trend: "stable",
      demand: "consistent",
      exportPotential: "low",
    },
  }

  return (
    insights[cropName] || {
      currentPrice: "Contact local markets",
      trend: "variable",
      demand: "moderate",
      exportPotential: "check current policies",
    }
  )
}

function predictCrop(soilData: any) {
  const cropScores = []

  // Calculate suitability for each crop
  for (const [cropName, cropData] of Object.entries(cropDatabase)) {
    const suitability = calculateCropSuitability(soilData, cropData)
    cropScores.push({
      crop: cropName,
      score: suitability.score,
      suitability,
      data: cropData,
    })
  }

  // Sort by score and get the best match
  cropScores.sort((a, b) => b.score - a.score)
  const bestCrop = cropScores[0]

  const reasons = generateReasons(soilData, bestCrop.data, bestCrop.suitability)
  const tips = generateTips(bestCrop.crop, bestCrop.data)

  return {
    crop: bestCrop.crop,
    confidence: bestCrop.score,
    reasons,
    expectedYield: bestCrop.data.info.expected_yield,
    growthPeriod: bestCrop.data.info.growth_period,
    tips,
    scientificName: bestCrop.data.info.scientific_name,
    season: bestCrop.data.info.season,
    waterRequirement: bestCrop.data.info.water_requirement,
    alternativeCrops: cropScores.slice(1, 4).map((crop) => ({
      name: crop.crop,
      confidence: crop.score,
    })),
  }
}
export async function POST(request: NextRequest) {
  try {
    const inputData = await request.json()

    // Validate required fields
    const requiredFields = ["state", "season", "crop"] // removed rainfall, fertilizer, pesticide
    for (const field of requiredFields) {
      if (!inputData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate data ranges only if values are provided
    const validationErrors = []
    if (inputData.rainfall !== undefined) {
      if (inputData.rainfall < 0 || inputData.rainfall > 3000)
        validationErrors.push("Rainfall should be between 0-3000mm")
    }
    if (inputData.fertilizer !== undefined) {
      if (inputData.fertilizer < 0) validationErrors.push("Fertilizer usage cannot be negative")
    }
    if (inputData.pesticide !== undefined) {
      if (inputData.pesticide < 0) validationErrors.push("Pesticide usage cannot be negative")
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation errors", details: validationErrors }, { status: 400 })
    }

    const prediction = predictCropYield(inputData)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error in crop recommendation:", error)
    return NextResponse.json({ error: "Failed to process crop recommendation" }, { status: 500 })
  }
}

