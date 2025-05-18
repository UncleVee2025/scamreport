import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Export the OpenAI instance (this was missing)
export { openai }

// Scam Classification
export async function classifyScam(description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant specializing in classifying scams. Categorize the following scam into one of these categories: phishing, investment_fraud, romance_scam, tech_support, shopping_scam, job_scam, lottery_scam, advance_fee, identity_theft, other. Return only the category name, nothing else.",
        },
        {
          role: "user",
          content: description,
        },
      ],
      max_tokens: 50,
      temperature: 0.2,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error("Error classifying scam:", error)
    return "other" // Default fallback category
  }
}

// Generate safety tips based on scam type
export async function generateSafetyTips(scamType: string, description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a cybersecurity expert. Generate 3 concise, practical safety tips to help users avoid this type of scam in the future. Keep the tips under 40 words each and format them as bullet points.",
        },
        {
          role: "user",
          content: `Scam type: ${scamType}\nScam description: ${description}`,
        },
      ],
      max_tokens: 250,
      temperature: 0.7,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error("Error generating safety tips:", error)
    return "• Always verify requests for personal information\n• Don't click on suspicious links\n• Report scams to authorities"
  }
}

// Check if a URL is potentially malicious
export async function analyzePotentialPhishingURL(url: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a security analyst specializing in identifying phishing URLs. Analyze the provided URL for signs it may be malicious or a phishing attempt. Consider domain name, subdomains, URL structure, and known phishing patterns. Respond with a JSON object with keys: riskScore (0-100), recommendation (string), reasonsForConcern (array).",
        },
        {
          role: "user",
          content: url,
        },
      ],
      max_tokens: 250,
      temperature: 0.3,
      response_format: { type: "json_object" },
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error("Error analyzing URL:", error)
    return {
      riskScore: 50,
      recommendation: "Exercise caution with this URL",
      reasonsForConcern: ["Analysis service unavailable"],
    }
  }
}

// Analyze sentiment of a comment to detect harmful content
export async function analyzeSentiment(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Analyze the sentiment and safety of the following text. Return a JSON object with these properties: sentiment (positive, neutral, negative), toxicScore (0-100), containsPersonalInfo (boolean), containsOffensiveLanguage (boolean), flaggedWords (array of concerning words), recommendedAction (approve, review, reject).",
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 150,
      temperature: 0.2,
      response_format: { type: "json_object" },
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return {
      sentiment: "neutral",
      toxicScore: 0,
      containsPersonalInfo: false,
      containsOffensiveLanguage: false,
      flaggedWords: [],
      recommendedAction: "approve",
    }
  }
}

// Find similar scams based on description
export async function findSimilarScams(
  targetDescription: string,
  scamDescriptions: { id: number; description: string }[],
) {
  try {
    // Function to calculate similarity between two strings using cosine similarity
    // (This is a simplified implementation - in production, you'd use embeddings API)
    const calculateSimilarity = async (desc1: string, desc2: string) => {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You're assessing similarity between two scam descriptions. On a scale of 0-100, how similar are they? Return only a number.",
          },
          {
            role: "user",
            content: `Description 1: ${desc1}\nDescription 2: ${desc2}`,
          },
        ],
        max_tokens: 10,
        temperature: 0.2,
      })

      return Number.parseInt(response.choices[0].message.content.trim())
    }

    // Calculate similarity for each scam
    const similarities = await Promise.all(
      scamDescriptions.map(async (scam) => {
        const similarity = await calculateSimilarity(targetDescription, scam.description)
        return {
          id: scam.id,
          similarity,
        }
      }),
    )

    // Sort by similarity and return top matches (similarity > 70)
    return similarities.filter((item) => item.similarity > 70).sort((a, b) => b.similarity - a.similarity)
  } catch (error) {
    console.error("Error finding similar scams:", error)
    return []
  }
}

// Summarize a scam report
export async function generateScamSummary(description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Create a concise 1-2 sentence summary of this scam report, highlighting the key details and warning signs.",
        },
        {
          role: "user",
          content: description,
        },
      ],
      max_tokens: 120,
      temperature: 0.5,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error("Error generating summary:", error)
    return "Could not generate summary for this scam report."
  }
}

// Phone call scam analysis
export async function analyzePhoneScamRisk(transcription: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are analyzing a phone conversation for signs of scam attempts. Provide a JSON response with: riskLevel (low, medium, high), warningSignsDetected (array), recommendedAction (string), scamType (string).",
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      max_tokens: 300,
      temperature: 0.4,
      response_format: { type: "json_object" },
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error("Error analyzing phone scam risk:", error)
    return {
      riskLevel: "unknown",
      warningSignsDetected: ["Analysis service unavailable"],
      recommendedAction: "Exercise caution and verify the caller through official channels",
      scamType: "unknown",
    }
  }
}
