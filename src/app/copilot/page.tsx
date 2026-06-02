"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  ArrowLeft, 
  Settings, 
  Volume2, 
  Mic, 
  Maximize2, 
  Layers, 
  Trash2, 
  Upload, 
  ChevronDown, 
  Check, 
  Play, 
  Square,
  Lock,
  Unlock,
  Sparkles,
  Home
} from "lucide-react";
import mammoth from "mammoth";

interface STTResult {
  text: string;
  is_final: boolean;
}

export default function CopilotPage() {
  // Credentials and Config (persisted locally)
  const [deepgramKey, setDeepgramKey] = useState("");
  const [llmKey, setLlmKey] = useState("");
  const [activeLlmProvider, setActiveLlmProvider] = useState("groq");
  const [isManualProvider, setIsManualProvider] = useState(false);
  const [opacity, setOpacity] = useState(0.85);

  // Pre-Interview Context Setup States
  const [interviewRole, setInterviewRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [candidateResume, setCandidateResume] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  // Key Validation States
  const [deepgramKeyStatus, setDeepgramKeyStatus] = useState<'idle' | 'verified' | 'failed'>('idle');
  const [llmProviderStatus, setLlmProviderStatus] = useState<'idle' | 'verified' | 'failed'>('idle');

  // App States
  const [isOverlayMode, setIsOverlayMode] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [isLocked, setIsLocked] = useState(false);

  // Audio & Stream Buffers
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [latency, setLatency] = useState<number | null>(null);

  // Audio toggles
  const [captureMic, setCaptureMic] = useState(true);
  const [captureSystem, setCaptureSystem] = useState(true);

  // Audio engine nodes references
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const systemStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Web socket reference
  const wsRef = useRef<WebSocket | null>(null);

  // Timing and request references
  const speechStartRef = useRef<number | null>(null);
  const activeRequestIdRef = useRef<number>(0);
  const voiceBufferRef = useRef("");
  const voiceDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceSegmentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Draggable HUD coordinates
  const [hudPosition, setHudPosition] = useState({ x: 20, y: 20 });
  const hudRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load configuration from localStorage
  useEffect(() => {
    setDeepgramKey(localStorage.getItem("ctl_deepgram_key") || "");
    setLlmKey(localStorage.getItem("ctl_llm_key") || "");
    setActiveLlmProvider(localStorage.getItem("ctl_active_llm_provider") || "groq");
    setIsManualProvider(localStorage.getItem("ctl_is_manual_provider") === "true");
    setInterviewRole(localStorage.getItem("ctl_interview_role") || "");
    setJobDescription(localStorage.getItem("ctl_job_description") || "");
    setCandidateResume(localStorage.getItem("ctl_candidate_resume") || "");
    setResumeFileName(localStorage.getItem("ctl_resume_file_name") || "");
  }, []);

  // Save configurations on changes
  useEffect(() => {
    localStorage.setItem("ctl_deepgram_key", deepgramKey);
  }, [deepgramKey]);

  useEffect(() => {
    localStorage.setItem("ctl_llm_key", llmKey);
  }, [llmKey]);

  useEffect(() => {
    localStorage.setItem("ctl_active_llm_provider", activeLlmProvider);
  }, [activeLlmProvider]);

  useEffect(() => {
    localStorage.setItem("ctl_is_manual_provider", String(isManualProvider));
  }, [isManualProvider]);

  useEffect(() => {
    localStorage.setItem("ctl_interview_role", interviewRole);
  }, [interviewRole]);

  useEffect(() => {
    localStorage.setItem("ctl_job_description", jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    localStorage.setItem("ctl_candidate_resume", candidateResume);
  }, [candidateResume]);

  useEffect(() => {
    localStorage.setItem("ctl_resume_file_name", resumeFileName);
  }, [resumeFileName]);

  // Key detection
  useEffect(() => {
    if (!isManualProvider && llmKey) {
      const k = llmKey.trim();
      let detected = "manual";
      if (k.startsWith("gsk_")) detected = "groq";
      else if (k.startsWith("sk-ant-")) detected = "anthropic";
      else if (k.startsWith("AIzaSy")) detected = "gemini";
      else if (k.startsWith("xai-")) detected = "xai";
      else if (k.startsWith("sk-")) detected = "openai";

      if (detected !== "manual") {
        setActiveLlmProvider(detected);
      }
    }
  }, [llmKey, isManualProvider]);

  // Key validation state updater
  useEffect(() => {
    setDeepgramKeyStatus(deepgramKey.trim().startsWith("dg_") || deepgramKey.length > 20 ? 'verified' : 'idle');
  }, [deepgramKey]);

  useEffect(() => {
    setLlmProviderStatus(llmKey.trim().length > 10 ? 'verified' : 'idle');
  }, [llmKey]);

  // Handle resume parsing
  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    setStatus(`Parsing: ${file.name}...`);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let extractedText = "";
      if (file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (file.name.endsWith(".pdf")) {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }
        extractedText = text;
      } else {
        setStatus("Unsupported format");
        return;
      }
      setCandidateResume(extractedText);
      setStatus("Resume parsed successfully!");
    } catch (err: any) {
      console.error(err);
      setStatus(`Parse Failed: ${err.message || err}`);
    }
  }

  // Linear downsampler to 16kHz
  function downsample(input: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array {
    if (fromSampleRate === toSampleRate) {
      return input;
    }
    const ratio = fromSampleRate / toSampleRate;
    const outputLength = Math.round(input.length / ratio);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const idx = Math.floor(i * ratio);
      output[i] = input[idx];
    }
    return output;
  }

  // Convert Float32Array into 16-bit PCM bytes
  function convertFloat32To16BitPCM(input: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  }

  // Start direct-in-browser capture engine
  async function startCaptureEngine() {
    if (isCapturing) return;
    setStatus("Initializing audio context...");
    setTranscript("");
    setAnswer("");
    setLatency(null);
    speechStartRef.current = null;
    voiceBufferRef.current = "";

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      let micStream: MediaStream | null = null;
      let systemStream: MediaStream | null = null;

      // 1. Capture Microphone
      if (captureMic) {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = micStream;
      }

      // 2. Capture System loopback (Display media audio share)
      if (captureSystem) {
        try {
          systemStream = await navigator.mediaDevices.getDisplayMedia({
            video: { width: 1, height: 1 }, // Request minimal video to pass browser constraints
            audio: true
          });
          systemStreamRef.current = systemStream;
        } catch (err) {
          console.warn("System capture cancelled or blocked. Proceeding with microphone only.", err);
          setCaptureSystem(false);
        }
      }

      if (!micStream && !systemStream) {
        throw new Error("No audio capture sources are selected/enabled.");
      }

      // Create Web Audio Node Graph
      const merger = audioCtx.createChannelMerger(2);
      let micConnected = false;
      let systemConnected = false;

      if (micStream && micStream.getAudioTracks().length > 0) {
        const micSource = audioCtx.createMediaStreamSource(micStream);
        micSource.connect(merger, 0, 0);
        micConnected = true;
      }

      if (systemStream && systemStream.getAudioTracks().length > 0) {
        const systemSource = audioCtx.createMediaStreamSource(systemStream);
        systemSource.connect(merger, 0, 1);
        systemConnected = true;
      }

      // Processor node to downsample to 16kHz mono PCM
      const processor = audioCtx.createScriptProcessor(4096, 2, 1);
      processorRef.current = processor;

      // Analyser node for rendering waveform on canvas
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      if (micConnected || systemConnected) {
        merger.connect(processor);
      } else {
        throw new Error("Failed to connect audio sources to Web Audio graph");
      }
      
      processor.connect(analyser);
      analyser.connect(audioCtx.destination); // Required to pull audio through script processor

      // Connect WebSocket to Deepgram
      const dgUrl = "wss://api.deepgram.com/v1/listen?model=nova-2&encoding=linear16&sample_rate=16000&channels=1&interim_results=true&punctuate=true&endpointing=300";
      console.log("[STT] Connecting to Deepgram WebSocket...");
      const ws = new WebSocket(dgUrl, ["token", deepgramKey]);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[STT] Deepgram WebSocket Connected Successfully!");
        setStatus("Listening...");
        setIsCapturing(true);
      };

      ws.onerror = (e) => {
        console.error("[STT] Deepgram connection error:", e);
        setStatus("STT Connection Error");
      };

      ws.onclose = () => {
        console.log("[STT] Deepgram connection closed.");
        stopCaptureEngine();
      };

      ws.onmessage = (event) => {
        try {
          const json = JSON.parse(event.data);
          const is_final = json.is_final;
          const text = json.channel?.alternatives?.[0]?.transcript || "";
          const cleanText = text.trim();

          if (!cleanText) return;
          console.log(`[STT EVENT] Text received: "${cleanText}" | is_final: ${is_final}`);

          // Postpone debounce timeouts on active speech
          if (voiceDebounceTimeoutRef.current) {
            clearTimeout(voiceDebounceTimeoutRef.current);
            voiceDebounceTimeoutRef.current = null;
          }
          if (voiceSegmentTimeoutRef.current) {
            clearTimeout(voiceSegmentTimeoutRef.current);
            voiceSegmentTimeoutRef.current = null;
          }

          if (is_final) {
            const separator = voiceBufferRef.current ? " " : "";
            voiceBufferRef.current = voiceBufferRef.current + separator + cleanText;
            setTranscript(voiceBufferRef.current);
            setInterimTranscript("");

            // Schedule the 300ms speech pause debounce timer
            voiceDebounceTimeoutRef.current = setTimeout(() => {
              const fullQuery = voiceBufferRef.current.trim();
              const wordCount = fullQuery.split(/\s+/).filter(Boolean).length;
              const isLikelyQuestion = 
                fullQuery.endsWith("?") || 
                wordCount >= 5 || 
                (fullQuery.length >= 18 && (
                  fullQuery.toLowerCase().includes("describe") ||
                  fullQuery.toLowerCase().includes("explain") ||
                  fullQuery.toLowerCase().includes("tell me") ||
                  fullQuery.toLowerCase().includes("how") ||
                  fullQuery.toLowerCase().includes("what") ||
                  fullQuery.toLowerCase().includes("why")
                ));

              console.log(`[DEBOUNCE] 0.3s silence delay met. Firing query to LLM: "${fullQuery}"`);
              if (isLikelyQuestion) {
                triggerLLM(fullQuery);
              } else {
                console.log(`[DEBOUNCE] Ignored non-question/incomplete query: "${fullQuery}"`);
              }
              voiceDebounceTimeoutRef.current = null;

              // Schedule conversational turn-completion timer to clear speech buffer
              voiceSegmentTimeoutRef.current = setTimeout(() => {
                console.log("[DEBOUNCE] 6s silence met. Clearing voice buffer queue.");
                voiceBufferRef.current = "";
                voiceSegmentTimeoutRef.current = null;
              }, 6000);
            }, 300);

          } else {
            setInterimTranscript(cleanText);
          }
        } catch (err) {
          console.error("[STT] Error parsing WebSocket message:", err);
        }
      };

      // Audio Processing loop
      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        const left = e.inputBuffer.getChannelData(0);
        const right = e.inputBuffer.getChannelData(1);

        // Mix stereo input into mono Float32Array
        const mono = new Float32Array(left.length);
        for (let i = 0; i < left.length; i++) {
          mono[i] = (left[i] + right[i]) / 2;
        }

        // Resample from AudioContext rate (typically 44.1kHz/48kHz) to 16kHz
        const resampled = downsample(mono, audioCtx.sampleRate, 16000);

        // Convert to 16-bit signed PCM
        const pcmBytes = convertFloat32To16BitPCM(resampled);

        // Send over WebSocket to Deepgram
        ws.send(pcmBytes);
      };

      // Start rendering waveform on canvas
      startWaveformRender(analyser);

    } catch (err: any) {
      console.error("[CAPTURE ERROR]", err);
      setStatus(`Capture Error: ${err.message || err}`);
      stopCaptureEngine();
    }
  }

  // Stop direct browser capture
  function stopCaptureEngine() {
    console.log("[CAPTURE] Stopping audio engine...");
    
    // Stop all media tracks
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (systemStreamRef.current) {
      systemStreamRef.current.getTracks().forEach((track) => track.stop());
      systemStreamRef.current = null;
    }

    // Disconnect Web Audio nodes
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clear timers
    if (voiceDebounceTimeoutRef.current) {
      clearTimeout(voiceDebounceTimeoutRef.current);
      voiceDebounceTimeoutRef.current = null;
    }
    if (voiceSegmentTimeoutRef.current) {
      clearTimeout(voiceSegmentTimeoutRef.current);
      voiceSegmentTimeoutRef.current = null;
    }

    setIsCapturing(false);
    setStatus("Stopped");
  }

  // Trigger stateless CORS proxy completion stream
  async function triggerLLM(promptText: string) {
    if (!llmKey) {
      setStatus(`${activeLlmProvider.toUpperCase()} Key missing`);
      return;
    }

    setAnswer("");
    setStatus("Streaming Copilot...");
    speechStartRef.current = Date.now();

    // Increment request ID to cancel older streams
    const currentRequestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = currentRequestId;

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: activeLlmProvider,
          prompt: promptText,
          apiKey: llmKey,
          role: interviewRole,
          jobDescription: jobDescription || null,
          candidateResume: candidateResume || null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        // Stop reading and abort stream if a newer request has started
        if (activeRequestIdRef.current !== currentRequestId) {
          console.log(`[LLM] Aborted older completion stream ${currentRequestId}`);
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        while (true) {
          const pos = buffer.indexOf("\n");
          if (pos === -1) break;

          const line = buffer.substring(0, pos).trim();
          buffer = buffer.substring(pos + 1);

          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            if (jsonStr === "[DONE]") break;

            try {
              const json = JSON.parse(jsonStr);
              let token = "";

              switch (activeLlmProvider) {
                case "groq":
                case "openai":
                case "xai":
                  token = json.choices?.[0]?.delta?.content || "";
                  break;
                case "anthropic":
                  if (json.type === "content_block_delta") {
                    token = json.delta?.text || "";
                  }
                  break;
                case "gemini":
                  token = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  break;
              }

              if (token) {
                setAnswer((prev) => prev + token);
                
                // Calculate latency based on first streamed token
                if (speechStartRef.current) {
                  const delta = (Date.now() - speechStartRef.current) / 1000;
                  setLatency(Number(delta.toFixed(2)));
                }
              }
            } catch (e) {
              // Ignore parse errors on incomplete JSON chunks
            }
          }
        }
      }

      setStatus("Copilot ready");
    } catch (err: any) {
      console.error(err);
      setStatus(`LLM Error: ${err.message || err}`);
    }
  }

  // Draw Audio Waveform on Canvas
  function startWaveformRender(analyser: AnalyserNode) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isCapturing && !audioContextRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#0B0D19";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      
      // Select visual gradient matching active provider
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, "#6610F2"); // Purple
      grad.addColorStop(0.5, "#0D6EFD"); // Blue
      grad.addColorStop(1, "#0DCAF0"); // Teal
      ctx.strokeStyle = grad;

      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }

  // Toggle capturing stream
  async function handleToggleCapture() {
    if (isCapturing) {
      stopCaptureEngine();
    } else {
      if (!interviewRole.trim()) {
        setStatus("Error: Interview Role is required");
        return;
      }
      if (!deepgramKey.trim()) {
        setStatus("Error: Deepgram Key missing");
        return;
      }
      if (!llmKey.trim()) {
        setStatus(`Error: ${activeLlmProvider.toUpperCase()} Key missing`);
        return;
      }
      await startCaptureEngine();
    }
  }

  // Clear Console / Chat
  function handleClearChat() {
    setTranscript("");
    setInterimTranscript("");
    setAnswer("");
    setLatency(null);
    speechStartRef.current = null;
    voiceBufferRef.current = "";
    if (voiceDebounceTimeoutRef.current) {
      clearTimeout(voiceDebounceTimeoutRef.current);
      voiceDebounceTimeoutRef.current = null;
    }
    if (voiceSegmentTimeoutRef.current) {
      clearTimeout(voiceSegmentTimeoutRef.current);
      voiceSegmentTimeoutRef.current = null;
    }
    setStatus(isCapturing ? "Console Cleared (Listening)" : "Console Cleared");
  }

  // Handle Dragging of the floating HUD card
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (isLocked) return;
    dragStartRef.current = {
      x: e.clientX - hudPosition.x,
      y: e.clientY - hudPosition.y
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStartRef.current) return;
      setHudPosition({
        x: event.clientX - dragStartRef.current.x,
        y: event.clientY - dragStartRef.current.y
      });
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  // Toggle Overlay (Floating HUD Mode)
  function handleToggleOverlay() {
    const nextOverlay = !isOverlayMode;
    setIsOverlayMode(nextOverlay);
    setIsLocked(false);
    if (nextOverlay) {
      setStatus("Overlay Unlocked");
      if (!isCapturing) {
        startCaptureEngine();
      }
    } else {
      setStatus("Dashboard");
      stopCaptureEngine();
    }
  }

  // Hot toggles
  async function handleToggleMic() {
    const nextMic = !captureMic;
    setCaptureMic(nextMic);
    if (isCapturing) {
      stopCaptureEngine();
      setTimeout(startCaptureEngine, 200);
    }
  }

  async function handleToggleSystem() {
    const nextSystem = !captureSystem;
    setCaptureSystem(nextSystem);
    if (isCapturing) {
      stopCaptureEngine();
      setTimeout(startCaptureEngine, 200);
    }
  }

  const renderProviderLogo = (provider: string) => {
    const size = "w-4 h-4";
    switch (provider) {
      case "openai":
        return (
          <svg className={`${size} text-emerald-400`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.73 10.24c.08-.26.12-.54.12-.82 0-.9-.55-1.72-1.37-2.07-.15-.06-.32-.1-.48-.12.03-.23.04-.47.02-.7-.07-.94-.85-1.7-1.79-1.77-.18-.01-.36.01-.54.04-.15-.43-.45-.8-.85-1.04a2.38 2.38 0 00-2.65.18c-.14.1-.26.22-.36.35-.35-.22-.76-.34-1.18-.34-.97 0-1.83.63-2.12 1.55-.17-.06-.35-.1-.53-.12A2.398 2.398 0 008.2 6.55c-.01.18.01.36.04.53-.43.15-.8.45-1.04.85a2.38 2.38 0 00.18 2.65c.1.14.22.26.35.36-.22.35-.34.76-.34 1.18 0 .97.63 1.83 1.55 2.12-.06.17-.1.35-.12.53a2.398 2.398 0 001.13 2.18c.18.01.36-.01.53-.04.15.43.45.8.85 1.04a2.38 2.38 0 002.65-.18c.14-.1.26-.22.36-.35.35.22.76.34 1.18.34.97 0 1.83-.63 2.12-1.55.17.06.35.1.53.12a2.398 2.398 0 002.18-1.13c.01-.18-.01-.36-.04-.53.43-.15.8-.45 1.04-.85a2.38 2.38 0 00-.18-2.65c-.09-.14-.21-.26-.34-.36.21-.35.33-.76.33-1.18zm-8.83 8.35c-.2-.04-.39-.12-.55-.25l-4.48-2.59c-.43-.25-.6-.79-.35-1.22.15-.26.41-.42.7-.45l3.29-.12.01-.01c.21.05.44.02.63-.09l4.57-2.64c.43-.25.98-.1 1.23.33.17.3.15.68-.06.96L14.7 17.51c-.26.4-.73.61-1.2.53c-.2.03-.4.01-.6-.05zm-3.13-2.18c-.1-.17-.15-.36-.15-.56V10.6c0-.5.33-.94.81-1.07.28-.08.57-.02.8.14l2.84 1.64c.2.11.33.32.33.55v5.27c0 .5-.33.94-.81 1.07-.28.08-.57.02-.8-.14l-2.84-1.64c-.11-.2-.17-.4-.2-.61z" />
          </svg>
        );
      case "anthropic":
        return (
          <svg className={`${size} text-amber-500`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h4l2.5-5.5h7L18 22h4L12 2zm-2.5 12L12 7.8l2.5 6.2h-5z" />
          </svg>
        );
      case "gemini":
        return (
          <svg className={`${size} text-blue-500`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
          </svg>
        );
      case "groq":
        return (
          <svg className={`${size} text-teal-400`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 1.93-.72 3.68-1.9 5.03z" />
          </svg>
        );
      case "xai":
        return (
          <svg className={`${size} text-slate-300`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.9 3h-2.24L12 9.54 7.34 3H5.1L10.9 11.2 5 21h2.24L12 14.46l4.66 6.54h2.24L13.1 12.8 18.9 3z" />
          </svg>
        );
      default:
        return (
          <Settings className={`${size} text-slate-400`} />
        );
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-transparent p-2 relative overflow-hidden select-none">
      
      {/* Background Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/5 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0D6EFD]/5 bg-blur-glow"></div>

      {/* Floating overlay hud card (rendered on toggle overlay) */}
      {isOverlayMode && (
        <div 
          ref={hudRef}
          style={{ 
            transform: `translate(${hudPosition.x}px, ${hudPosition.y}px)`,
            background: `rgba(11, 13, 25, ${opacity})`,
            zIndex: 100
          }}
          className={`absolute top-0 left-0 w-[800px] h-[520px] glass-panel rounded-3xl p-5 flex flex-col gap-4 animate-fade-in text-white transition-all duration-300 ${
            isLocked 
              ? "border-transparent pointer-events-none" 
              : `border-2 border-dashed border-${activeLlmProvider} pointer-events-auto shadow-2xl`
          }`}
        >
          {/* HUD Drag Header */}
          <div 
            onMouseDown={handleMouseDown}
            className={`flex justify-between items-center border-b border-white/10 pb-3 select-none z-30 ${isLocked ? "cursor-default" : "cursor-move"}`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                activeLlmProvider === "openai" ? "bg-emerald-400 shadow-[0_0_10px_#10a37f]" :
                activeLlmProvider === "anthropic" ? "bg-amber-500 shadow-[0_0_10px_#d97706]" :
                activeLlmProvider === "gemini" ? "bg-blue-500 shadow-[0_0_10px_#2563eb]" :
                activeLlmProvider === "groq" ? "bg-teal-400 shadow-[0_0_10px_#14b8a6]" :
                "bg-slate-300 shadow-[0_0_10px_#f8fafc]"
              }`}></span>
              <span className={`text-[10px] font-black tracking-widest uppercase select-none text-gradient-${activeLlmProvider}`}>
                WEB HUD OVERLAY
              </span>
            </div>

            {/* Custom Control Actions */}
            <div className="flex items-center gap-2 pointer-events-auto">
              
              {!isLocked && (
                <button
                  onClick={handleToggleCapture}
                  className={`text-[11px] px-2 py-1 rounded-lg font-black transition active:scale-95 cursor-pointer flex items-center gap-1 border ${
                    isCapturing
                      ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/35"
                      : "bg-gradient-to-r from-sky-500/25 to-indigo-500/25 hover:brightness-110 text-sky-300 border-sky-500/35"
                  }`}
                >
                  {isCapturing ? "⏹ Stop" : "▶ Start"}
                </button>
              )}

              {!isLocked && (
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-lg text-[10px]">
                  <button
                    onClick={handleToggleMic}
                    className={`px-1.5 py-0.5 rounded transition cursor-pointer font-bold ${
                      captureMic ? "bg-sky-500/25 text-sky-300" : "text-slate-500"
                    }`}
                  >
                    🎤 {captureMic ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={handleToggleSystem}
                    className={`px-1.5 py-0.5 rounded transition cursor-pointer font-bold ${
                      captureSystem ? "bg-emerald-500/25 text-emerald-300" : "text-slate-500"
                    }`}
                  >
                    🔊 {captureSystem ? "ON" : "OFF"}
                  </button>
                </div>
              )}

              {!isLocked && (
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[10px]">
                  <span className="text-slate-400 font-medium">Opacity:</span>
                  <input
                    type="range"
                    min="0.15"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-14 h-1 bg-white/20 accent-sky-400 rounded-lg cursor-pointer"
                  />
                  <span className="text-slate-350 font-bold w-5 text-right">{Math.round(opacity * 100)}%</span>
                </div>
              )}

              {!isLocked && (
                <button
                  onClick={handleClearChat}
                  className="text-[11px] px-2 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-black border border-rose-500/25 rounded-lg transition active:scale-95 cursor-pointer"
                >
                  🧹 Clear
                </button>
              )}

              {isLocked ? (
                <button 
                  onClick={() => setIsLocked(false)}
                  className="text-[10px] text-white/55 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-white/10"
                >
                  <Lock className="w-3 h-3 text-rose-400 animate-pulse" />
                  Unlock
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLocked(true);
                    setStatus("HUD Locked");
                  }}
                  className="text-[11px] px-2 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-black border border-sky-500/30 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Unlock className="w-3 h-3" />
                  Lock
                </button>
              )}

              {!isLocked && (
                <button
                  onClick={() => {
                    setIsOverlayMode(false);
                    setIsLocked(false);
                    setStatus("Dashboard");
                    stopCaptureEngine();
                  }}
                  className="text-[10px] px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg font-black transition active:scale-95 cursor-pointer"
                >
                  Exit HUD
                </button>
              )}
            </div>
          </div>

          {/* Real-time Transcription Stream */}
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] text-white/50 font-black uppercase tracking-widest flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              Interviewer Speech (Live STT Feed)
            </span>
            <div className="text-[14px] text-white/90 bg-slate-950/45 p-3.5 rounded-2xl border border-white/5 h-[90px] overflow-y-auto leading-relaxed scrollbar-thin shadow-inner select-text pointer-events-auto">
              {transcript || interimTranscript ? (
                <p className="font-medium select-text">
                  {transcript}
                  <span className="text-sky-300 font-bold italic">{interimTranscript ? ` ${interimTranscript}...` : ""}</span>
                </p>
              ) : (
                <span className="text-white/25 italic text-xs select-none">Waiting for live conversation speech stream...</span>
              )}
            </div>
          </div>

          {/* AI Copilot Answer Panel */}
          <div className="flex flex-col gap-1.5 flex-1 min-h-0 z-10">
            <div className="flex justify-between items-center px-1">
              <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-gradient-${activeLlmProvider}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  activeLlmProvider === "openai" ? "bg-emerald-400" :
                  activeLlmProvider === "anthropic" ? "bg-amber-500" :
                  activeLlmProvider === "gemini" ? "bg-blue-500" :
                  activeLlmProvider === "groq" ? "bg-teal-400" :
                  "bg-slate-300"
                }`}></span>
                AI Copilot Guidance
              </span>
              {latency && (
                <span className="text-[10px] text-slate-400 font-bold bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-lg shadow-sm">
                  Latency: {latency}s
                </span>
              )}
            </div>
            <div className={`flex-1 text-[16px] bg-slate-950/50 p-5 rounded-2xl border border-${activeLlmProvider} overflow-y-auto font-semibold text-emerald-50/95 shadow-[inset_0_2px_12px_rgba(0,0,0,0.4)] leading-relaxed scrollbar-thin select-text pointer-events-auto`}>
              {answer ? (
                <div className="whitespace-pre-wrap leading-relaxed select-text font-bold text-emerald-50/95 text-shadow-sm animate-fade-in pointer-events-auto">
                  {answer}
                  {status === "Streaming Copilot..." && (
                    <span className={`inline-block w-2.5 h-4.5 ml-1.5 animate-pulse align-middle ${
                      activeLlmProvider === "openai" ? "bg-emerald-400 shadow-[0_0_8px_#10a37f]" :
                      activeLlmProvider === "anthropic" ? "bg-amber-500 shadow-[0_0_8px_#d97706]" :
                      activeLlmProvider === "gemini" ? "bg-blue-500 shadow-[0_0_8px_#2563eb]" :
                      activeLlmProvider === "groq" ? "bg-teal-400 shadow-[0_0_8px_#14b8a6]" :
                      "bg-slate-300 shadow-[0_0_8px_#f8fafc]"
                    }`}></span>
                  )}
                </div>
              ) : (
                <div className="h-full flex justify-center items-center select-none">
                  <span className="text-white/25 italic text-sm">Awaiting interview questions to generate real-time feedback...</span>
                </div>
              )}
            </div>
          </div>

          {/* Evasion / Shield Footer */}
          <div className="flex justify-between items-center text-[10px] text-white/40 pt-3 border-t border-white/5 select-none z-10">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400/80">
              <Shield className="w-4 h-4 text-emerald-400" />
              Direct Browser Tab Streaming Affinity Protected
            </span>
            <span className="font-extrabold uppercase tracking-widest text-slate-300 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded">{status}</span>
          </div>
        </div>
      )}

      {/* Main dashboard configuration panel */}
      {!isOverlayMode && (
        <div 
          style={{ background: `rgba(11, 13, 25, ${opacity})` }}
          className="w-[780px] h-[640px] glass-panel rounded-3xl p-6 flex flex-col justify-between text-white border-white/10 relative overflow-hidden shadow-2xl animate-fade-in"
        >
          {/* Subtle glowing orbs */}
          <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-[#6610F2]/10 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[220px] h-[220px] bg-[#0D6EFD]/10 rounded-full blur-[90px] pointer-events-none"></div>

          {/* Header */}
          <div className="flex justify-between items-center relative z-10 select-none">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" className="w-10 h-10 rounded-xl border border-white/10 shadow-md" alt="Logo" />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gradient flex items-center gap-2">
                  CrackTheLoop <span className="text-[10px] font-bold bg-[#6610F2]/20 text-[#0DCAF0] border border-[#0DCAF0]/30 px-2 py-0.5 rounded-md tracking-widest uppercase">WEB v2.0</span>
                </h1>
                <p className="text-xs text-white/40 mt-0.5 font-medium">Anti-Share Stealth Browser Audio Copilot</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-20">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${isCapturing ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" : "bg-white/20"}`}></span>
                <span className="text-white/80 font-bold uppercase tracking-wider">{status}</span>
              </div>
              <a
                href="/"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-350 flex justify-center items-center border border-white/10 font-black transition active:scale-90 cursor-pointer"
                title="Go Back to Home Landing"
              >
                <Home className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Credentials Inputs (Double Columns) */}
          <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl relative z-10">
            {/* Deepgram Column */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  🎤 Deepgram API Key
                  {deepgramKeyStatus === "verified" && (
                    <span className="text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider badge-deepgram">
                      ✅ Key Configured
                    </span>
                  )}
                </label>
                {deepgramKey && <span className="text-[9px] text-emerald-400 font-bold">✓ Saved</span>}
              </div>
              <input
                type="password"
                value={deepgramKey}
                onChange={(e) => setDeepgramKey(e.target.value)}
                placeholder="dg_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className={`w-full bg-[#090e1a]/85 border ${
                  deepgramKeyStatus === "verified" ? "border-deepgram" : "border-white/10"
                } px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-deepgram transition placeholder-white/10 text-white/90`}
              />
            </div>

            {/* Universal LLM Column */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {renderProviderLogo(activeLlmProvider)}
                  <span className={`text-gradient-${activeLlmProvider} font-black`}>LLM Key ({activeLlmProvider.toUpperCase()})</span>
                  {llmProviderStatus === "verified" && (
                    <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider badge-${activeLlmProvider}`}>
                      ✅ Key Configured
                    </span>
                  )}
                </label>

                {/* Manual Override controls */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isManualProvider}
                      onChange={(e) => setIsManualProvider(e.target.checked)}
                      className="rounded bg-[#0d1326] border-white/10 text-sky-400 accent-sky-400 cursor-pointer"
                    />
                    Manual
                  </label>
                  {isManualProvider && (
                    <select
                      value={activeLlmProvider}
                      onChange={(e) => setActiveLlmProvider(e.target.value)}
                      className="bg-[#0b0f1c] border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-slate-355 focus:outline-none focus:border-sky-455 cursor-pointer"
                    >
                      <option value="groq">Groq</option>
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Claude</option>
                      <option value="gemini">Gemini</option>
                      <option value="xai">Grok (xAI)</option>
                    </select>
                  )}
                </div>
              </div>
              <input
                type="password"
                value={llmKey}
                onChange={(e) => setLlmKey(e.target.value)}
                placeholder="Paste any Groq, OpenAI, Claude, Gemini or Grok key..."
                className={`w-full bg-[#090e1a]/85 border ${
                  llmProviderStatus === "verified" ? `border-${activeLlmProvider}` : "border-white/10"
                } px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-${activeLlmProvider} transition placeholder-white/10 text-white/90`}
              />
            </div>
          </div>

          {/* Pre-Interview Context Setup Widget */}
          <div className="flex flex-col gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl relative z-10">
            <span className="text-[10px] text-white/55 font-black uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-1.5">
              💼 Pre-Interview Context Setup
              {!interviewRole.trim() && (
                <span className="text-[9px] px-1.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/35 rounded animate-pulse font-black uppercase">
                  ⚠️ Interview Role Required
                </span>
              )}
              {interviewRole.trim() && (
                <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded font-black uppercase">
                  Ready
                </span>
              )}
            </span>

            <div className="flex flex-col gap-3 mt-1">
              {/* Row 1: Mandatory Interview Role */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1">
                  Interview Role <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={interviewRole}
                  onChange={(e) => setInterviewRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={`w-full bg-[#090e1a]/85 border ${
                    !interviewRole.trim() ? "border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.1)]" : "border-white/10"
                  } px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-sky-400 transition placeholder-white/20 text-white/95 font-medium`}
                />
              </div>

              {/* Row 2: Job Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                  Job Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job details, requirements, or tech stack..."
                  className="bg-[#090e1a]/85 border border-white/10 rounded-xl p-3 text-xs placeholder-white/20 scrollbar-thin h-[50px] min-h-[50px] max-h-[50px] focus:outline-none focus:border-sky-400 text-white/95"
                />
              </div>

              {/* Row 3: Resume Uploader */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                  Resume File (Optional)
                </label>
                {!resumeFileName ? (
                  <label className="flex flex-col items-center justify-center border border-dashed border-white/15 hover:border-sky-400/40 bg-white/2 rounded-xl p-2 cursor-pointer select-none transition group h-[50px]">
                    <span className="text-xs group-hover:scale-110 transition duration-300">📎</span>
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-wider mt-0.5 group-hover:text-white transition">Upload Resume PDF or DOCX</span>
                    <input 
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-xl text-xs text-emerald-400 font-bold shadow-sm animate-fade-in relative overflow-hidden group h-[50px]">
                    <div className="flex items-center gap-2 relative z-10">
                      <span className="text-base">📄</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-200 font-extrabold truncate w-[220px]">{resumeFileName}</span>
                        <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Extraction Active</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeFileName("");
                        setCandidateResume("");
                      }}
                      className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/35 rounded-lg text-[8.5px] font-black text-rose-300 transition active:scale-90 cursor-pointer relative z-10 uppercase tracking-wider"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Waveform Visualizer & Audio Source Panel */}
          <div className="flex justify-between items-center bg-white/5 border border-white/5 px-4 py-2 rounded-2xl relative z-10 text-xs gap-4">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider select-none shrink-0 text-slate-400">
              Waveform:
            </div>
            
            {/* Visual Waveform Canvas */}
            <div className="flex-1 h-9 bg-[#0b0e1b] rounded-xl overflow-hidden border border-white/5 shadow-inner shrink min-w-0">
              <canvas ref={canvasRef} width="320" height="36" className="w-full h-full" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mic Toggle Button */}
              <button
                onClick={handleToggleMic}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition border cursor-pointer ${
                  captureMic 
                    ? "bg-sky-500/10 text-sky-300 border-sky-500/20 hover:bg-sky-500/20" 
                    : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {captureMic ? "Mic ON" : "Mic Muted"}
              </button>

              {/* System Toggle Button */}
              <button
                onClick={handleToggleSystem}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition border cursor-pointer ${
                  captureSystem 
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20" 
                    : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10"
                }`}
                title="Captures shared Chrome/Edge tab audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {captureSystem ? "Tab Audio ON" : "Tab Muted"}
              </button>
            </div>
          </div>

          {/* Action Panel */}
          <div className="flex gap-4 relative z-10">
            <button
              onClick={handleToggleOverlay}
              disabled={!interviewRole.trim() || !deepgramKey.trim() || !llmKey.trim()}
              className={`w-full py-3 bg-gradient-to-r from-${activeLlmProvider === "openai" ? "emerald-400 to-teal-500" : activeLlmProvider === "anthropic" ? "amber-500 to-orange-600" : activeLlmProvider === "gemini" ? "blue-500 to-indigo-600" : activeLlmProvider === "groq" ? "teal-400 to-cyan-500" : "slate-400 to-slate-600"} hover:brightness-110 text-white rounded-xl font-black text-xs transition active:scale-98 flex justify-center items-center gap-2 cursor-pointer shadow-lg tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Maximize2 className="w-4 h-4" />
              Launch Web Stealth Overlay
            </button>
          </div>

          {/* Shield Status */}
          <div className="flex justify-between items-center text-xs text-white/30 border-t border-white/5 pt-3 mt-1 select-none">
            <span className="flex items-center gap-1.5 text-emerald-400/80 font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              Web Audio Sandbox: EXCLUSIVE
            </span>
            <span className="font-bold tracking-wider">SECURE CLIENT SESSIONS</span>
          </div>
        </div>
      )}
    </div>
  );
}
