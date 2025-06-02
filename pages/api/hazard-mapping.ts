import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import fs from "fs";
import path from "path";
import { uploadVideoToSupabaseClient } from "../../services/supabase-service";

// Disable body parser to allow file streaming
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).send("Error parsing form data");
    }

    const conf = parseFloat((fields.conf as string) || "0.1");
    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;

    if (!videoFile || !(videoFile as File).filepath) {
      return res.status(400).send("No video file provided");
    }

    try {
      const ext = path.extname(videoFile.originalFilename || "video.mp4");
      const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
      const fileBuffer = fs.readFileSync(videoFile.filepath);

      // Upload video to Supabase and get public URL
      const publicUrl = await uploadVideoToSupabaseClient(fileBuffer,filename);

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
            video: publicUrl
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
      res.status(500).send(e.message || "Internal server error");
    }
  });
}
