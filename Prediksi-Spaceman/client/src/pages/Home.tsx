import React, { useState, useEffect, useRef } from "react";
import StarfieldBackground from "@/components/StarfieldBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, History, Play, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import dimekGif from "@assets/DIMEK_1767354917015.gif";

type RiskLevel = "SAFE" | "RISKY" | "DANGER";

interface SlotData {
  value: string;
  risk?: RiskLevel;
}

interface PredictionResult {
  id: number;
  multiplier: string;
  risk: RiskLevel;
  timestamp: string;
}

const RISK_CONFIG: Record<RiskLevel, { color: string; border: string; bg: string; shadow: string; icon: any; label: string }> = {
  SAFE: {
    color: "text-blue-400",
    border: "border-blue-500",
    bg: "bg-blue-500/10",
    shadow: "shadow-[0_0_25px_rgba(59,130,246,0.6)]",
    icon: ShieldCheck,
    label: "Aman"
  },
  RISKY: {
    color: "text-yellow-400",
    border: "border-yellow-500",
    bg: "bg-yellow-500/10",
    shadow: "shadow-[0_0_25px_rgba(234,179,9,0.6)]",
    icon: Zap,
    label: "Beresiko"
  },
  DANGER: {
    color: "text-red-500",
    border: "border-red-500",
    bg: "bg-red-500/10",
    shadow: "shadow-[0_0_25px_rgba(220,38,38,0.6)]",
    icon: AlertTriangle,
    label: "Berbahaya"
  }
};

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [slot, setSlot] = useState<SlotData>({ value: "0.00x" });
  const [isRevealing, setIsRevealing] = useState(false);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [predictedTime, setPredictedTime] = useState<string>("--:--:--");
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const generatePrediction = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setSlot({ value: "0.00x" });
    setIsRevealing(false);
    setPredictedTime("--:--:--");

    // Start "spinning" effect
    intervalRef.current = setInterval(() => {
      setSlot({ value: `x${(Math.random() * 9.9).toFixed(2)}` });
    }, 50);

    // Schedule stop
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Calculated weighted probability for multiplier
      let multiplierValue: number;
      const roll = Math.random() * 100;
      let isMeteor = false;

      if (roll < 70) {
        // 1-20 (70% chance)
        multiplierValue = Math.random() * (20 - 1) + 1;
      } else if (roll < 90) {
        // 20-50 (20% chance)
        multiplierValue = Math.random() * (50 - 20) + 20;
      } else if (roll < 95) {
        // 50-70 (5% chance)
        multiplierValue = Math.random() * (70 - 50) + 50;
      } else if (roll < 99) {
        // 70-100 (4% chance)
        multiplierValue = Math.random() * (100 - 70) + 70;
      } else {
        // 100-1000 (1% chance)
        multiplierValue = Math.random() * (1000 - 100) + 100;
        isMeteor = true;
      }

      const resultVal = `x${multiplierValue.toFixed(2)}`;
      
      const risks: RiskLevel[] = ["SAFE", "RISKY", "DANGER"];
      // Auto-assign risk based on multiplier value
      let risk: RiskLevel = "SAFE";
      if (multiplierValue > 50) risk = "DANGER";
      else if (multiplierValue > 20) risk = "RISKY";
      
      // Calculate predicted time (1-5 minutes in future)
      const futureDate = new Date();
      const randomMinutes = Math.floor(Math.random() * 5) + 1;
      const randomSeconds = Math.floor(Math.random() * 60);
      futureDate.setMinutes(futureDate.getMinutes() + randomMinutes);
      futureDate.setSeconds(randomSeconds);
      setPredictedTime(futureDate.toLocaleTimeString([], { hour12: false }));
      
      setSlot({ value: resultVal, risk: risk });
      setIsRevealing(true);

      const newEntry: PredictionResult = {
        id: Date.now(),
        multiplier: resultVal,
        risk: risk,
        timestamp: new Date().toLocaleTimeString()
      };

      setHistory(prev => [newEntry, ...prev].slice(0, 10));
      
      if (isMeteor) {
        triggerMeteorEffect();
      }
      
      setTimeout(() => setIsRevealing(false), 200);
      setIsGenerating(false);

    }, 2000);
  };

  const triggerMeteorEffect = () => {
    const meteorContainer = document.createElement("div");
    meteorContainer.className = "fixed inset-0 pointer-events-none z-[100] overflow-hidden";
    document.body.appendChild(meteorContainer);

    for (let i = 0; i < 15; i++) {
      const meteor = document.createElement("div");
      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 1 + 0.5;
      const delay = Math.random() * 1;
      
      meteor.style.cssText = `
        position: absolute;
        top: -100px;
        left: ${Math.random() * 100}vw;
        width: ${size}px;
        height: ${size * 20}px;
        background: linear-gradient(to bottom, transparent, #f43f5e, #fbbf24);
        filter: blur(1px);
        opacity: 0.8;
        transform: rotate(45deg);
        animation: meteor-fall ${duration}s linear ${delay}s forwards;
      `;
      meteorContainer.appendChild(meteor);
    }

    setTimeout(() => {
      document.body.removeChild(meteorContainer);
    }, 3000);
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      <StarfieldBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col items-center min-h-screen justify-center max-w-lg">
        
        <img 
          src={dimekGif} 
          alt="Spaceman Animation" 
          className="w-40 h-40 md:w-64 md:h-64 object-contain mb-4 animate-in fade-in zoom-in duration-1000 translate-x-4 md:translate-x-8"
        />

        <div className="text-center mb-6 space-y-3 animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-slate-900/50 border border-indigo-500/30 backdrop-blur-md mb-2 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Rocket className="w-5 h-5 md:w-8 md:h-8 text-indigo-400 mr-2" />
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter font-['Orbitron'] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SPACEMAN v3.0
            </h1>
          </div>
          <p className="text-slate-400 font-['Rajdhani'] text-lg md:text-xl tracking-widest uppercase font-bold">
            PREDIKSI POLA SPACEMAN
          </p>
        </div>

        {/* Timer Section */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8 font-['Orbitron']">
          <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl backdrop-blur-md text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Waktu Saat Ini</div>
            <div className="text-lg md:text-xl font-bold text-indigo-400">{currentTime.toLocaleTimeString([], { hour12: false })}</div>
          </div>
          <div className="bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl backdrop-blur-md text-center shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <div className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1">Waktu Prediksi</div>
            <div className="text-lg md:text-xl font-bold text-pink-400">{predictedTime}</div>
          </div>
        </div>

        <div className="flex justify-center mb-8 w-full">
          <div 
            id="slot-main"
            className={cn(
              "w-44 h-56 md:w-64 md:h-80 rounded-3xl border-4 flex items-center justify-center text-4xl md:text-6xl font-black transition-all duration-300 backdrop-blur-md shadow-2xl font-['Orbitron']",
              isGenerating && !slot.risk
                ? "border-indigo-500/50 bg-slate-800/80 text-indigo-400 animate-pulse" 
                : slot.risk 
                  ? `${RISK_CONFIG[slot.risk].border} ${RISK_CONFIG[slot.risk].color} ${RISK_CONFIG[slot.risk].shadow} ${RISK_CONFIG[slot.risk].bg}`
                  : "border-slate-700 bg-slate-900/90 text-slate-500",
              isRevealing && "scale-105 z-20 brightness-125"
            )}
          >
            {slot.value}
          </div>
        </div>

        <div className="mb-8 w-full flex flex-col gap-4">
          <Button 
            onClick={generatePrediction}
            disabled={isGenerating}
            className={cn(
              "w-full h-16 md:h-20 text-xl md:text-2xl font-bold rounded-2xl font-['Orbitron'] tracking-widest transition-all duration-300",
              isGenerating 
                ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_rgba(79,70,229,0.7)] active:scale-95 border-2 border-indigo-400"
            )}
          >
            {isGenerating ? (
              <span className="flex items-center">
                ANALYZING <span className="animate-pulse ml-1">...</span>
              </span>
            ) : (
              <span className="flex items-center">
                <Play className="w-6 h-6 md:w-8 md:h-8 mr-3 fill-current" /> CEK POLA SEKARANG
              </span>
            )}
          </Button>

          <a 
            href="https://24klub777.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-14 md:h-16 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-['Orbitron'] font-black text-lg md:text-xl rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.02] border-2 border-emerald-400 uppercase tracking-widest"
          >
            COBA DISINI
          </a>
        </div>

        <Card className="w-full bg-slate-900/80 border-indigo-500/20 backdrop-blur-xl text-slate-200 shadow-2xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <h3 className="font-['Orbitron'] text-sm md:text-lg flex items-center text-indigo-300 uppercase tracking-wider">
                <History className="w-4 h-4 md:w-5 md:h-5 mr-2" /> HISTORY
              </h3>
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 font-mono text-[10px]">
                V3.0
              </Badge>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar" id="history-list">
              {history.length === 0 ? (
                <div className="text-center py-6 text-slate-600 font-['Rajdhani'] italic text-sm">
                  Awaiting analysis data...
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5 animate-in slide-in-from-left-5 duration-300 hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-1.5 md:p-2 rounded-full bg-slate-900", RISK_CONFIG[item.risk].color)}>
                        {React.createElement(RISK_CONFIG[item.risk].icon, { 
                          className: "w-3 h-3 md:w-4 md:h-4"
                        })}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] md:text-[10px] text-slate-500">{item.timestamp}</span>
                        <span className={cn("text-[9px] md:text-[10px] font-bold tracking-wider uppercase", RISK_CONFIG[item.risk].color)}>
                          {parseFloat(item.multiplier.replace('x', '')) >= 100 ? "JACKPOT" : RISK_CONFIG[item.risk].label}
                        </span>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "font-black text-lg md:text-xl italic font-['Orbitron']",
                      RISK_CONFIG[item.risk].color
                    )}>
                      {item.multiplier}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
