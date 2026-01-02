import { type NextRequest, NextResponse } from "next/server"

// This will be populated with real data from the CSV analysis
interface YieldPredictionInput {
  crop: string
  state: string
  season: string
  area: number
  rainfall: number
  fertilizer: number
  pesticide: number
  year?: number
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

// Mock historical data - will be replaced with real CSV data
const mockHistoricalData = {
  rice: {
    "West Bengal": { kharif: { avgYield: 2.8, bestYield: 4.2, trend: "increasing" } },
    "Uttar Pradesh": { kharif: { avgYield: 2.5, bestYield: 3.8, trend: "stable" } },
    Punjab: { kharif: { avgYield: 3.9, bestYield: 5.2, trend: "stable" } },
  },
  wheat: {
    "Uttar Pradesh": { rabi: { avgYield: 3.2, bestYield: 4.8, trend: "increasing" } },
    Punjab: { rabi: { avgYield: 4.5, bestYield: 5.8, trend: "stable" } },
    Haryana: { rabi: { avgYield: 4.2, bestYield: 5.5, trend: "increasing" } },
  },
  maize: {
    Karnataka: { kharif: { avgYield: 3.1, bestYield: 4.5, trend: "increasing" } },
    "Andhra Pradesh": { kharif: { avgYield: 2.9, bestYield: 4.2, trend: "stable" } },
  },
}

function calculateYieldPrediction(input: YieldPredictionInput): YieldPredictionResult {
  const { crop, state, season, area, rainfall, fertilizer, pesticide } = input

  // Get historical data for the crop-state-season combination
  const historicalData = mockHistoricalData[crop]?.[state]?.[season.toLowerCase()] || {
    avgYield: 2.0,
    bestYield: 3.5,
    trend: "stable",
  }

  // Base yield from historical average
  let predictedYield = historicalData.avgYield

  // Rainfall impact (optimal range varies by crop)
  const rainfallOptimal = crop === "rice" ? 1200 : crop === "wheat" ? 650 : 900
  const rainfallScore = calculateParameterScore(rainfall, rainfallOptimal, 300)
  const rainfallImpact = (rainfallScore - 50) / 100 // -0.5 to +0.5
  predictedYield += predictedYield * rainfallImpact * 0.3

  // Fertilizer impact
  const fertilizerOptimal = crop === "rice" ? 150000 : crop === "wheat" ? 120000 : 100000
  const fertilizerScore = calculateParameterScore(fertilizer, fertilizerOptimal, 50000)
  const fertilizerImpact = (fertilizerScore - 50) / 100
  predictedYield += predictedYield * fertilizerImpact * 0.2

  // Pesticide impact (moderate use is optimal)
  const pesticideOptimal = 2000
  const pesticideScore = calculateParameterScore(pesticide, pesticideOptimal, 1000)
  const pesticideImpact = (pesticideScore - 50) / 100
  predictedYield += predictedYield * pesticideImpact * 0.1

  // Area impact (larger areas might have slightly lower yield per hectare)
  const areaImpact = area > 100000 ? -0.05 : area > 50000 ? -0.02 : 0
  predictedYield += predictedYield * areaImpact

  // Ensure yield is within reasonable bounds
  predictedYield = Math.max(0.1, Math.min(predictedYield, historicalData.bestYield * 1.2))

  // Calculate confidence based on data quality and parameter scores
  const confidence = Math.round(
    (rainfallScore + fertilizerScore + pesticideScore + 70) / 4, // 70 is base confidence
  )

  // Generate recommendations
  const recommendations = generateRecommendations(input, {
    rainfallScore,
    fertilizerScore,
    pesticideScore,
  })

  return {
    predictedYield: Math.round(predictedYield * 100) / 100,
    confidence: Math.min(95, Math.max(60, confidence)),
    factors: {
      rainfall: {
        impact: rainfallScore > 70 ? "positive" : rainfallScore < 30 ? "negative" : "neutral",
        score: rainfallScore,
      },
      fertilizer: {
        impact: fertilizerScore > 70 ? "positive" : fertilizerScore < 30 ? "negative" : "neutral",
        score: fertilizerScore,
      },
      pesticide: {
        impact: pesticideScore > 70 ? "positive" : pesticideScore < 30 ? "negative" : "neutral",
        score: pesticideScore,
      },
      historical: {
        impact: historicalData.trend === "increasing" ? "positive" : "neutral",
        score: historicalData.trend === "increasing" ? 80 : 60,
      },
    },
    recommendations,
    historicalData: {
      averageYield: historicalData.avgYield,
      bestYear: { year: 2020, yield: historicalData.bestYield },
      trend: historicalData.trend,
    },
  }
}

function calculateParameterScore(value: number, optimal: number, tolerance: number): number {
  const distance = Math.abs(value - optimal)
  const normalizedDistance = distance / tolerance
  return Math.max(0, Math.min(100, 100 - normalizedDistance * 30))
}

function generateRecommendations(
  input: YieldPredictionInput,
  scores: { rainfallScore: number; fertilizerScore: number; pesticideScore: number },
): string[] {
  const recommendations = []

  if (scores.rainfallScore < 50) {
    if (input.rainfall < 500) {
      recommendations.push("Consider supplemental irrigation due to low rainfall")
    } else {
      recommendations.push("Implement proper drainage to manage excess rainfall")
    }
  }

  if (scores.fertilizerScore < 50) {
    if (input.fertilizer < 50000) {
      recommendations.push("Increase fertilizer application based on soil test results")
    } else {
      recommendations.push("Optimize fertilizer timing and split applications")
    }
  }

  if (scores.pesticideScore < 50) {
    if (input.pesticide < 1000) {
      recommendations.push("Implement integrated pest management practices")
    } else {
      recommendations.push("Review pesticide usage to avoid overuse and resistance")
    }
  }

  // Add crop-specific recommendations
  if (input.crop === "rice") {
    recommendations.push("Maintain proper water levels throughout the growing season")
  } else if (input.crop === "wheat") {
    recommendations.push("Ensure timely sowing for optimal temperature conditions")
  }

  // Add state-specific recommendations
  recommendations.push(`Follow ${input.state} agricultural department guidelines`)

  return recommendations.slice(0, 4)
}

export async function POST(request: NextRequest) {
  try {
    const inputData: YieldPredictionInput = await request.json()

    // Validate required fields
    const requiredFields = ["crop", "state", "season", "area", "rainfall", "fertilizer", "pesticide"]
    for (const field of requiredFields) {
      if (inputData[field] === undefined || inputData[field] === null) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate data ranges
    const validationErrors = []
    if (inputData.area <= 0) validationErrors.push("Area must be greater than 0")
    if (inputData.rainfall < 0 || inputData.rainfall > 5000)
      validationErrors.push("Rainfall should be between 0-5000mm")
    if (inputData.fertilizer < 0) validationErrors.push("Fertilizer usage cannot be negative")
    if (inputData.pesticide < 0) validationErrors.push("Pesticide usage cannot be negative")

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation errors", details: validationErrors }, { status: 400 })
    }

    const prediction = calculateYieldPrediction(inputData)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error in yield prediction:", error)
    return NextResponse.json({ error: "Failed to process yield prediction" }, { status: 500 })
  }
}
