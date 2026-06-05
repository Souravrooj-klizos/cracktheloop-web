import type { Metadata } from "next";
import LiveTranscriptionContent from "./LiveTranscriptionContent";

export const metadata: Metadata = {
  title: "Real-Time Audio Transcription Copilot | CrackTheLoop",
  description:
    "Capture system loopback sound and microphone inputs in real time. Downsample audio to 16kHz mono PCM chunks and transcribe interviewer questions with sub-second latency.",
  keywords: [
    "live interview transcription",
    "real-time speech to text helper",
    "audio loopback mixer",
    "WASAPI sound capture",
    "interview assistant",
  ],
};

export default function LiveTranscriptionPage() {
  return <LiveTranscriptionContent />;
}
