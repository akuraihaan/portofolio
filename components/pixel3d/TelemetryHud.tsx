"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Cpu, ShieldCheck, Wifi } from "lucide-react";
import { isAudioMuted, toggleAudioMute, playCyberSound } from "./CyberAudio";

export function TelemetryHud() {
  const [timeStr, setTimeStr] = useState("");
  const [latency, setLatency] = useState(14);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(isAudioMuted());

    const updateClock = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString("id-ID", {
          timeZone: "Asia/Makassar",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WITA"
      );
    };

    updateClock();
    const clockTimer = setInterval(updateClock, 1000);

    const pingTimer = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 6));
    }, 4500);

    return () => {
      clearInterval(clockTimer);
      clearInterval(pingTimer);
    };
  }, []);

  const handleAudioToggle = () => {
    const nextMuted = toggleAudioMute();
    setMuted(nextMuted);
    if (!nextMuted) {
      playCyberSound("click");
    }
  };

  return (
    <div className="w-full bg-[#0E1013] border-b border-[#171816]/30 dark:border-white/10 text-[#A1A49A] font-mono text-[9px] sm:text-[10px] py-1.5 px-4 sm:px-8 select-none z-40 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
        {/* Left Telemetry */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#C8F169]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169] animate-ping" />
            <span className="font-bold tracking-wider">SYSTEM ONLINE</span>
          </div>

          <span className="text-[#171816]/40 dark:text-white/20">|</span>

          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[#C8F169]" />
            <span>NODE: BANJARMASIN, KALIMANTAN SELATAN</span>
          </div>

          <span className="text-[#171816]/40 dark:text-white/20 hidden md:inline">|</span>

          <div className="flex items-center gap-1 text-[#F4F3EE] hidden md:flex">
            <Wifi className="w-3 h-3 text-[#C8F169]" />
            <span>EDGE LATENCY: {latency}ms</span>
          </div>
        </div>

        {/* Right Telemetry & Audio Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#C8F169]" />
            <span>NEXT.JS 16 TURBOPACK // SUPABASE RLS</span>
          </div>

          <span className="text-[#171816]/40 dark:text-white/20 hidden sm:inline">|</span>

          <span className="text-[#F4F3EE] font-bold">{timeStr || "12:00:00 WITA"}</span>

          <span className="text-[#171816]/40 dark:text-white/20">|</span>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`flex items-center gap-1.5 px-2 py-0.5 border font-pixel text-[8px] transition-colors cursor-pointer ${
              !muted
                ? "border-[#C8F169] text-[#C8F169] bg-[#C8F169]/10"
                : "border-white/20 text-[#A1A49A] hover:border-white/40"
            }`}
            title={muted ? "Nyalakan Cyber SFX" : "Matikan Cyber SFX"}
            aria-label="Toggle SFX"
          >
            {!muted ? (
              <>
                <Volume2 className="w-2.5 h-2.5" />
                <span>SFX: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-2.5 h-2.5" />
                <span>SFX: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
