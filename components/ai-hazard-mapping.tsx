"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { uploadVideoToSupabase } from "@/services/supabase-service";

const HazardMappingTab = () => {
  const [inputVideo, setInputVideo] = useState<File | null>(null);
  const [inputVideoUrl, setInputVideoUrl] = useState<string>("");
  const [outputVideoUrl, setOutputVideoUrl] = useState<string>("");
  const [conf, setConf] = useState<number>(0.1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasUploaded, setHasUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const inputVideoRef = React.useRef<HTMLVideoElement>(null);
  const outputVideoRef = React.useRef<HTMLVideoElement>(null);

  // Handle video upload
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputVideo(file);
      setInputVideoUrl(URL.createObjectURL(file));
      setHasUploaded(true);
    }
  };

  // TODO: Replace with your own upload logic to get a public URL
  // For demo, assume inputVideoUrl is a public URL
  const getPublicVideoUrl = async (file: File): Promise<string> => {
    // You should upload to S3, Supabase, etc. and return the public URL
    // For now, just return the local blob URL (will not work with Replicate)
    return inputVideoUrl;
  };

  // Handle prediction
const handlePredict = async () => {
  setError("");
  setLoading(true);
  setProcessing(true);
  setOutputVideoUrl("");

  try {
    if (!inputVideo) {
      setError("Please upload a video file.");
      setLoading(false);
      setProcessing(false);
      return;
    }

    const videoUrl = await uploadVideoToSupabase(inputVideo);

    const res = await fetch("/api/hazard-mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoUrl,
        conf,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Prediction failed");
    setOutputVideoUrl(data.output); // make sure your API returns `.output`
  } catch (err: any) {
    setError(err?.message || "Prediction failed.");
  } finally {
    setLoading(false);
    setProcessing(false);
  }
};

  React.useEffect(() => {
    if (inputVideoUrl && inputVideoRef.current && hasUploaded && !processing && !outputVideoUrl) {
      inputVideoRef.current.play();
    }
  }, [inputVideoUrl, hasUploaded, processing, outputVideoUrl]);

  React.useEffect(() => {
    if (outputVideoUrl && outputVideoRef.current && inputVideoRef.current) {
      inputVideoRef.current.pause();
      outputVideoRef.current.play();
    }
  }, [outputVideoUrl]);

  return (
    <Card className="w-full h-full min-h-screen bg-background">
      <CardHeader>
        <CardTitle>AI Hazard Mapping (Post-Disaster Drone Imagery)</CardTitle>
      </CardHeader>
      <CardContent className="w-full h-full flex flex-col justify-center items-center">
        <div className="space-y-4 w-full h-full flex flex-col flex-1">
          {!hasUploaded ? (
            <div className="flex flex-col items-center justify-center py-16 w-full h-full flex-1">
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-xl p-8 transition hover:bg-primary/10 w-full h-full min-h-[400px]"
              >
                <UploadCloud className="w-32 h-32 text-primary mb-4" />
                <span className="text-2xl font-semibold text-primary mb-2">
                  Click to upload video
                </span>
                <span className="text-lg text-muted-foreground">
                  Supported: mp4, avi, etc.
                </span>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-medium mb-1 text-lg">
                  Confidence Threshold: {conf}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={conf}
                  onChange={(e) => setConf(Number(e.target.value))}
                  className="w-full"
                  disabled={loading || processing}
                />
              </div>
              <Button
                onClick={handlePredict}
                disabled={loading || !inputVideo || processing}
                className="w-full text-lg py-4"
              >
                {loading ? "Processing..." : "Run Hazard Mapping"}
              </Button>
              {error && (
                <div className="text-red-500 text-lg text-center">{error}</div>
              )}
              <div className="flex flex-col items-center justify-center mt-6 relative w-full flex-1 min-h-[560px]">
                {!outputVideoUrl && !processing && inputVideoUrl && (
                  <video
                    ref={inputVideoRef}
                    src={inputVideoUrl}
                    controls
                    className="w-full h-[560px] rounded shadow mx-auto object-contain bg-black"
                    autoPlay
                    loop
                    muted
                  />
                )}
                {processing && (
                  <>
                    <video
                      ref={inputVideoRef}
                      src={inputVideoUrl}
                      controls
                      className="w-full h-[560px] rounded shadow mx-auto object-contain bg-black opacity-60"
                      autoPlay
                      loop
                      muted
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-b-8 border-primary mb-8"></div>
                      <div className="text-primary font-bold text-3xl drop-shadow-lg">Processing video...</div>
                    </div>
                  </>
                )}
                {outputVideoUrl && (
                  <video
                    ref={outputVideoRef}
                    src={outputVideoUrl}
                    controls
                    className="w-full h-[560px] rounded shadow mx-auto object-contain bg-black"
                    autoPlay
                    loop
                  />
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HazardMappingTab;
