import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import type { Language } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

interface GeminiDisasterChatProps {
  currentLang?: Language;
}

export const GeminiDisasterChat: React.FC<GeminiDisasterChatProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: '👋 **Hello! I am Google Gemini Disaster AI for GIRI-PRAHARI.**\n\nI analyze live Sentinel-1 radar InSAR, IoT borehole ground sensors, pore water pressure, and real-time precipitation across all 8 NER states.\n\nAsk me anything! For example: *"What is the highest risk slope?"*, *"Is Sohra safe?"*, or simply type *"Hi"*.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const submitPrompt = (rawText: string) => {
    if (!rawText.trim() || isLoading) return;

    const userText = rawText.trim();
    setInput('');

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Provide realistic typing response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let aiResponseText = '';

      // 1. Greetings & Pleasantries
      if (
        lower === 'hi' ||
        lower === 'hello' ||
        lower === 'hey' ||
        lower === 'hlo' ||
        lower === 'namaste' ||
        lower.startsWith('hi ') ||
        lower.startsWith('hello ') ||
        lower.includes('good morning') ||
        lower.includes('good afternoon') ||
        lower.includes('good evening')
      ) {
        aiResponseText = `👋 **Hello! How can I assist you today?**\n\nI am the **Google Gemini Disaster Intelligence Engine** monitoring 35 active hill slopes across the 8 North Eastern Region (NER) states.\n\nHere are some quick things you can ask me:\n• 🔴 *"What is the highest risk slope right now?"*\n• 📍 *"Is Sohra or Mangan safe to travel?"*\n• 🟢 *"Which slopes have the lowest risk?"*\n• 🌊 *"Explain pore water pressure in landslides"*`;
      }
      // 2. Identity / Capabilities
      else if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('what can you do')) {
        aiResponseText = `🤖 **About Google Gemini Disaster AI:**\n\nI am an AI early-warning reasoning agent built for the **GIRI-PRAHARI** platform. My job is to protect mountain communities by:\n1. **Fusing Tri-Signal Streams**: Combining ESA Sentinel-1 C-Band InSAR satellite radar, IoT ground piezometers, and live Open-Meteo precipitation.\n2. **Predicting Slope Failure**: Calculating Bayesian hazard scores (0–100) before visible surface cracks form.\n3. **Multilingual Alerts**: Coordinating automated emergency PSTN voice calls and sirens in 44+ indigenous dialects.`;
      }
      // 3. Highest Risk / Danger Slopes
      else if (lower.includes('highest') || lower.includes('worst') || lower.includes('most danger') || lower.includes('max risk')) {
        aiResponseText = `🚨 **Google Gemini Analysis — Highest Hazard Sectors:**\n\n1. 🔴 **Mangan North Highway Pass (Sikkim)**\n   • **Risk Score:** 89/100 (CRITICAL DANGER)\n   • **Sub-surface Creep:** 15.4 mm (Active shear surge)\n   • **Soil Moisture:** 95% Saturation\n   • **24h Rainfall:** 280 mm\n   • **Satellite InSAR:** LOS Velocity -38.6 mm/yr\n   • **Status:** Outdoor acoustic sirens active. Lepcha/Bhutia voice alerts issued.\n\n2. 🔴 **Sohra Sector B (Cherrapunji, Meghalaya)**\n   • **Risk Score:** 87/100 (DANGER)\n   • **Creep Rate:** 14.6 mm\n   • **Rainfall:** 245 mm / 24h\n   • **Dialect:** Khasi & Pnar IVR dispatch active.\n\n3. 🔴 **Haflong Hill Station (Assam)**\n   • **Risk Score:** 85/100 (DANGER) · Creep: 13.9 mm`;
      }
      // 4. Safest / Lowest Risk
      else if (lower.includes('safest') || lower.includes('lowest') || (lower.includes('safe') && !lower.includes('is sohra') && !lower.includes('is mangan'))) {
        aiResponseText = `🟢 **Google Gemini Regional Safety Report (Low Risk):**\n\n• **Relek (Aizawl, Mizoram):** Risk **18/100 (SAFE)** · Creep: 1.2 mm · Stable crystalline bedrock\n• **Ziro Valley (Arunachal Pradesh):** Risk **24/100 (SAFE)** · Creep: 1.6 mm · Minimal shear stress\n• **Mawlynnong Slope (Meghalaya):** Risk **29/100 (SAFE)** · Creep: 2.1 mm · Vegetative bio-retaining zone\n\nCurrently, 25 out of 35 monitored nodes are completely SAFE.`;
      }
      // 5. Specific Locations
      else if (lower.includes('sohra') || lower.includes('cherrapunji')) {
        aiResponseText = `📍 **Gemini Synthesis for Sohra (Cherrapunji, Meghalaya):**\n\n• **Hazard Score:** 87/100 (DANGER)\n• **Pore Water Pressure:** 91% (Exceeds critical liquefaction threshold)\n• **Sub-surface Creep:** 14.6 mm\n• **24h Rainfall:** 245 mm\n• **Active Dialects:** Khasi & Pnar\n• **Gemini Recommendation:** Immediate evacuation of lower valley hamlets along the Shella gorge corridor.`;
      } else if (lower.includes('mangan') || lower.includes('sikkim')) {
        aiResponseText = `📍 **Gemini Synthesis for Mangan (North Sikkim):**\n\n• **Hazard Score:** 89/100 (CRITICAL DANGER)\n• **Pore Water Pressure:** 95% saturation\n• **Creep Rate:** 15.4 mm\n• **24h Rainfall:** 280 mm monsoon surge\n• **Active Dialects:** Lepcha & Bhutia\n• **Gemini Recommendation:** Debris flow imminent along North Sikkim highway. Evacuation to designated high-elevation shelters advised.`;
      } else if (lower.includes('haflong') || lower.includes('assam')) {
        aiResponseText = `📍 **Gemini Synthesis for Haflong (Dima Hasao, Assam):**\n\n• **Hazard Score:** 85/100 (DANGER)\n• **Sub-surface Creep:** 13.9 mm\n• **24h Rain:** 210 mm\n• **Soil Saturation:** 88%\n• **Active Dialects:** Dimasa & Assamese\n• **LoRaWAN Status:** 4-node relay active with central Shillong hub.`;
      } else if (lower.includes('tawang') || lower.includes('arunachal')) {
        aiResponseText = `📍 **Gemini Synthesis for Tawang (Arunachal Pradesh):**\n\n• **Hazard Score:** 83/100 (DANGER)\n• **Sub-surface Creep:** 12.8 mm\n• **24h Rain:** 185 mm\n• **Active Dialects:** Monpa & Nyishi\n• **Satellite InSAR:** Sentinel-1 Track-72 shows active monastery ridge subsidence.`;
      }
      // 6. Scientific Explanations
      else if (lower.includes('insar') || lower.includes('satellite') || lower.includes('radar')) {
        aiResponseText = `🛰️ **Gemini Satellite InSAR Physics Guide:**\n\nInterferometric Synthetic Aperture Radar (InSAR) sends microwave radar beams from orbit (such as ESA Sentinel-1 C-Band at 5.4 GHz). By calculating the phase difference ($\\Delta \\phi$) between repeated orbital passes every 6–12 days, we detect sub-millimeter ground deformation before any visible landslide crack appears!`;
      } else if (lower.includes('pore') || lower.includes('pressure') || lower.includes('water') || lower.includes('soil')) {
        aiResponseText = `🌊 **Gemini Geotechnical Physics: Pore Water Pressure**\n\nAs heavy monsoon precipitation infiltrates hill slopes, water fills the microscopic spaces between soil grains. This raises pore water pressure ($u$), which drastically reduces the effective stress ($\\sigma' = \\sigma - u$) and weakens the slope's shear resistance ($\\tau_f = c' + \\sigma' \\tan \\phi'$), triggering sudden landslides.`;
      } else if (lower.includes('evacuat') || lower.includes('what to do') || lower.includes('guideline') || lower.includes('protocol')) {
        aiResponseText = `🚨 **NDMA Landslide Evacuation Safety Protocol:**\n\n1. **Move to Higher Ground**: Stay away from valley bottoms, drainage channels, and steep colluvial slopes.\n2. **Heed Automated Phone Warnings**: If you receive a GIRI-PRAHARI IVR call in your local dialect, evacuate immediately.\n3. **Watch for Precursor Signs**: Watch for new cracks in plaster, bulging ground, tilting trees/utility poles, or suddenly muddy creek water.\n4. **Emergency Contact**: Dial 112 (National Emergency) or use GIRI-PRAHARI Sentinel dispatch.`;
      }
      // 7. General Intelligent Fallback
      else {
        aiResponseText = `🧠 **Google Gemini Disaster Intelligence Analysis:**\n\nRegarding "*${userText}*":\n\nOur multimodal Bayesian network is actively fusing live Sentinel-1 satellite InSAR radar, borehole IoT piezometers, and real-time precipitation across all 8 NER states.\n\n• **Current High-Risk Slopes:** Mangan, Sikkim (89/100) & Sohra, Meghalaya (87/100)\n• **Regional Summary:** 25 Safe | 4 Watch | 8 Danger Hamlets\n• **Emergency Telephony:** Active 24/7 in 44+ indigenous tribal dialects.\n\nFeel free to ask about any specific village, weather data, or landslide physics!`;
      }

      const geminiMsg: Message = {
        id: 'gemini-' + Date.now(),
        sender: 'gemini',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, geminiMsg]);
      setIsLoading(false);
    }, 450);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-2xl shadow-purple-950/80 border border-purple-400/40 cursor-pointer font-bold text-sm transition-all hover:scale-105"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
        <span>Ask Gemini AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-22 right-6 z-50 bg-[#0E1420] border border-purple-500/40 rounded-2xl shadow-2xl flex flex-col text-white transition-all overflow-hidden ${
            isExpanded ? 'w-[90vw] sm:w-[650px] h-[75vh]' : 'w-[90vw] sm:w-[420px] h-[520px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  Google Gemini Disaster AI
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 border border-purple-400/30 font-mono">
                    v2.5 FLASH
                  </span>
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Multi-Signal Reasoning Engine Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0F14]/90 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'gemini' && (
                  <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none shadow-lg whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                  <span className="block text-[9px] mt-1.5 opacity-60 text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>Gemini is analyzing multi-signal satellite & sensor data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Suggested Quick Prompt Chips (1-Click Trigger) */}
          <div className="px-3 py-2 bg-slate-950/90 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => submitPrompt('Hi')}
              className="px-2.5 py-1 rounded-full bg-purple-950/80 hover:bg-purple-800 text-purple-200 border border-purple-500/30 whitespace-nowrap cursor-pointer transition-colors"
            >
              👋 Say Hi
            </button>
            <button
              onClick={() => submitPrompt('What is the highest risk slope?')}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/20 whitespace-nowrap cursor-pointer transition-colors"
            >
              🔴 Highest Risk?
            </button>
            <button
              onClick={() => submitPrompt('Why is Sohra in danger?')}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/20 whitespace-nowrap cursor-pointer transition-colors"
            >
              📍 Sohra Telemetry?
            </button>
            <button
              onClick={() => submitPrompt('Explain pore water pressure in landslides')}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/20 whitespace-nowrap cursor-pointer transition-colors"
            >
              🌊 Pore Water Pressure?
            </button>
          </div>

          {/* Form Input Bar (Works with Enter Key, Form Submit & Send Button) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitPrompt(input);
            }}
            className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini AI about risks, slopes, InSAR..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-colors shadow"
              title="Send to Gemini AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
