import { type NextRequest, NextResponse } from "next/server"

// Mock ResNet model - In production, you'd load your trained model
function predictDisease(imageBuffer: Buffer) {
  // Mock prediction logic - In production, this would use your trained ResNet model
  // For demonstration, we'll return different diseases based on random selection

  const diseases = [
    {
      disease: "Leaf Blight",
      confidence: 94,
      severity: "High" as const,
      description:
        "A fungal disease that causes brown spots and lesions on leaves, leading to reduced photosynthesis and yield loss.",
      symptoms: [
        "Brown or tan spots on leaves",
        "Lesions with dark borders",
        "Yellowing of affected leaves",
        "Premature leaf drop",
      ],
      treatment: [
        "Apply copper-based fungicide spray",
        "Remove and destroy infected plant debris",
        "Improve air circulation around plants",
        "Apply preventive fungicide during humid conditions",
      ],
      prevention: [
        "Use disease-resistant varieties",
        "Avoid overhead watering",
        "Maintain proper plant spacing",
        "Rotate crops annually",
      ],
    },
    {
      disease: "Powdery Mildew",
      confidence: 89,
      severity: "Medium" as const,
      description: "A fungal disease characterized by white, powdery growth on leaf surfaces, stems, and flowers.",
      symptoms: [
        "White powdery coating on leaves",
        "Yellowing and curling of leaves",
        "Stunted plant growth",
        "Reduced fruit/grain quality",
      ],
      treatment: [
        "Apply sulfur-based fungicide",
        "Use baking soda spray (1 tsp per quart water)",
        "Improve air circulation",
        "Remove severely affected plant parts",
      ],
      prevention: [
        "Plant in sunny, well-ventilated areas",
        "Avoid overcrowding plants",
        "Water at soil level, not on leaves",
        "Apply preventive fungicide sprays",
      ],
    },
    {
      disease: "Healthy Plant",
      confidence: 96,
      severity: "Low" as const,
      description: "The plant appears healthy with no visible signs of disease or pest damage.",
      symptoms: [
        "Green, vibrant foliage",
        "No visible spots or lesions",
        "Normal growth pattern",
        "Good overall plant vigor",
      ],
      treatment: [
        "Continue current care routine",
        "Monitor regularly for any changes",
        "Maintain proper nutrition",
        "Ensure adequate water and sunlight",
      ],
      prevention: [
        "Regular monitoring and inspection",
        "Maintain proper plant nutrition",
        "Ensure good air circulation",
        "Practice crop rotation",
      ],
    },
    {
      disease: "Bacterial Spot",
      confidence: 87,
      severity: "Medium" as const,
      description:
        "A bacterial infection causing dark spots on leaves and fruits, potentially leading to significant crop loss.",
      symptoms: [
        "Small, dark spots on leaves",
        "Spots with yellow halos",
        "Fruit lesions and cracking",
        "Defoliation in severe cases",
      ],
      treatment: [
        "Apply copper-based bactericide",
        "Remove infected plant material",
        "Avoid working with wet plants",
        "Use drip irrigation instead of sprinklers",
      ],
      prevention: [
        "Use certified disease-free seeds",
        "Avoid overhead irrigation",
        "Practice crop rotation",
        "Maintain proper plant spacing",
      ],
    },
  ]

  // Randomly select a disease for demonstration
  const randomIndex = Math.floor(Math.random() * diseases.length)
  return diseases[randomIndex]
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer())

    // Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const prediction = predictDisease(imageBuffer)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error in disease prediction:", error)
    return NextResponse.json({ error: "Failed to process disease prediction" }, { status: 500 })
  }
}
