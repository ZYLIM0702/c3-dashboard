import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Increase the JSON body size limit to 4MB
    },
    maxDuration: 60, // Increase Vercel serverless function timeout to 60 seconds (max for Pro/Enterprise)
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { videoUrl, conf = 0.1 } = req.body || {};
    if (!videoUrl) {
      return res.status(400).json({ error: "No video URL provided" });
    }

    // Make HTTP request to Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "zylim0702/disaster-detection-vision:7be15686cd8c8b29be48b4dde461aa10f0953a82744d713716124fdd1680b734",
        input: {
          conf: conf,
          video: videoUrl
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Replicate API error: ${errorText}`);
    }

    const output = await response.json();
    res.status(200).json(output);
  } catch (e: any) {
    console.error("Error:", e);
    res.status(500).json({ error: e.message || "Internal server error" });
  }
}
