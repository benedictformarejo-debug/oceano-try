import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Coral, the AI concierge for Oceano Con Vista — a luxury resort in Davao, Philippines. You speak in a warm, helpful, and professional tone.

RESORT DETAILS:
- Location: Purok 6, Barangay Aumbay, Island Garden City of Samal., Samal, Philippines, 8119
- Contact: oceanoconvista@gmail.com
- Booking: Guests can book directly on our website or visit /rooms to browse available rooms
- Manage Booking: Guests can manage their booking using the link which will be sent to their email after booking (unregistered users) while registered users can manage through their account dashboard

ROOMS (all rates per night):
- Oceanus Room: capacity 2 guests — intimate and cozy ocean-view room
- Athena Room: capacity 4 guests — elegant room perfect for small families
- Apollo Room: capacity 4 guests — bright and spacious with premium amenities
- Ouranus Room: capacity 10 guests — ideal for groups and large families
- Cronos Room: capacity 10 guests — expansive suite perfect for events and big groups

BOOKING POLICY:
- Bookings are subject to resort confirmation after payment
- Guests can pay in full or 50% downpayment (balance paid upon arrival)
- Payment methods: GCash, Maya, Credit/Debit Card, GrabPay via PayMongo
- Cancellations can be made via link sent to users email or in their account dashboard before check-in
- A unique reference code (e.g. OCV-XXXX) is sent to the guest's email after booking

GENERAL POLICIES:
- Booking status: pending → confirmed → checked-in → checked-out
- Special requests can be submitted during booking
- Login is optional — guests can book as visitors and manage via reference code

Keep responses concise (2-4 sentences), warm, and professional. If asked about real-time availability or pricing, direct them to the Rooms page or the booking form. If asked about an existing booking, direct them to their account dashboard or the link sent to their email.

Never break character. You are always Coral, the friendly AI concierge of Oceano Con Vista.`;


// Suggestions for quick start (3 only)
const SUGGESTIONS = [
  "Tell me about the resort",
  "How do I make a booking?",
  "Tell me about the amenities",
];

const formatText = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");

const BotIcon = ({ size = 24, color = "white" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 1024 1024" fill={color}>
    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
  </svg>
);

export default function HotelChatbot() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (started) setTimeout(() => inputRef.current?.focus(), 100);
  }, [started]);

  const startChat = (text) => {
    setStarted(true);
    sendMessage(text, []);
  };

  const sendMessage = async (text, existingMessages) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    const base = existingMessages !== undefined ? existingMessages : messages;
    const newMessages = [...base, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "I apologize, I seem to be having a moment. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "My apologies — I'm having trouble connecting. Please try again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setStarted(false); setMessages([]); setInput(""); }, 300);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ocv-wrap {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          font-family: 'Inter', sans-serif;
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
        }

        /* Window */
        .ocv-window {
          width: 370px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
          display: flex; flex-direction: column; overflow: hidden;
          border: 1px solid #e5e7eb;
          transform-origin: bottom right;
          animation: win-in 0.25s cubic-bezier(0.34,1.4,0.64,1);
        }
        @keyframes win-in {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Header */
        .ocv-header {
          background: #064e3b;
          padding: 14px 16px;
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        }
        .ocv-header-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ocv-header-info { flex: 1; }
        .ocv-header-name {
          font-size: 15px; font-weight: 600; color: white; line-height: 1.2;
        }
        .ocv-header-status {
          font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 1px;
          display: flex; align-items: center; gap: 5px;
        }
        .ocv-status-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #4ade80;
        }
        .ocv-close {
          background: rgba(255,255,255,0.15); border: none; cursor: pointer;
          color: white; width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .ocv-close:hover { background: rgba(255,255,255,0.25); }

        /* Welcome */
        .ocv-welcome {
          flex: 1; padding: 18px 20px 14px;
          background: #f9fafb;
          display: flex; flex-direction: column; align-items: center;
        }
        .ocv-welcome-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: #0891b2;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0 4px 16px rgba(2,44,34,0.3);
        }
        .ocv-welcome-title {
          font-size: 17px; font-weight: 600; color: #111827;
          margin-bottom: 4px; text-align: center;
        }
        .ocv-welcome-sub {
          font-size: 13px; color: #6b7280; text-align: center;
          margin-bottom: 16px; line-height: 1.5;
        }
        .ocv-suggestions { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .ocv-suggestion {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 400;
          padding: 11px 16px; border-radius: 10px; width: 100%;
          border: 1.5px solid #e5e7eb;
          background: white; color: #374151; cursor: pointer; text-align: left;
          transition: all 0.15s;
        }
        .ocv-suggestion:hover {
          border-color: #000000; color: #111827;
          background: #f0fdf4;
        }

        /* Messages */
        .ocv-messages {
          flex: 1; overflow-y: auto; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 10px;
          background: #f9fafb; min-height: 300px; max-height: 300px;
        }
        .ocv-messages::-webkit-scrollbar { width: 4px; }
        .ocv-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

        .ocv-msg { display: flex; gap: 8px; align-items: flex-end; }
        .ocv-msg.user { flex-direction: row-reverse; }

        .ocv-msg-avatar {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          background: #064e3b;
          display: flex; align-items: center; justify-content: center;
        }

        .ocv-bubble {
          max-width: 78%; padding: 10px 13px;
          font-size: 14px; line-height: 1.55; font-weight: 400;
        }
        .ocv-bubble.bot {
          background: white; color: #111827;
          border-radius: 16px 16px 16px 4px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .ocv-bubble.user {
          background: #064e3b; color: white;
          border-radius: 16px 16px 4px 16px;
        }

        /* Typing */
        .ocv-typing { display: flex; align-items: center; gap: 4px; padding: 10px 13px; }
        .ocv-typing span {
          width: 7px; height: 7px; border-radius: 50%; background: #9ca3af;
          animation: dot-bounce 1.2s ease-in-out infinite;
        }
        .ocv-typing span:nth-child(2) { animation-delay: 0.2s; }
        .ocv-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%,60%,100% { transform: translateY(0); }
          30%          { transform: translateY(-5px); }
        }

        /* Input */
        .ocv-input-area {
          padding: 12px 14px; background: white;
          border-top: 1px solid #e5e7eb; flex-shrink: 0;
        }
        .ocv-input-row { display: flex; align-items: center; gap: 8px; }
        .ocv-input {
          flex: 1; border: 1.5px solid #e5e7eb; border-radius: 10px;
          padding: 9px 13px; font-family: 'Inter', sans-serif;
          font-size: 14px; color: #111827; background: #f9fafb;
          outline: none; transition: border-color 0.15s, background 0.15s;
        }
        .ocv-input:focus { border-color: #064e3b; background: white; }
        .ocv-input::placeholder { color: #9ca3af; }
        .ocv-send {
          width: 38px; height: 38px; border-radius: 10px; border: none; flex-shrink: 0;
          background: #064e3b; color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, opacity 0.15s;
        }
        .ocv-send:hover:not(:disabled) { background: #064e3b; }
        .ocv-send:disabled { opacity: 0.4; cursor: default; }

        /* FAB */
        .ocv-fab {
          width: 50px; height: 50px; border-radius: 50%;
          background: #064e3b;
          border: none;
          box-shadow: 0 4px 20px rgba(2,44,34,0.45);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fab-bounce 1.8s ease-in-out infinite;
        }
        .ocv-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 24px rgba(2,44,34,0.55);
          animation-play-state: paused;
        }

        @keyframes fab-bounce {
          0%, 100% { transform: translateY(0); }
          30%       { transform: translateY(-10px); }
          50%       { transform: translateY(-6px); }
          70%       { transform: translateY(-10px); }
        }

        @media (max-width: 420px) {
          .ocv-window { width: calc(100vw - 32px); }
          .ocv-wrap { right: 16px; bottom: 16px; }
        }
      `}</style>

      <div className="ocv-wrap">

        {open && (
          <div className="ocv-window">

            {/* Header */}
            <div className="ocv-header">
              <div className="ocv-header-avatar">
                <BotIcon size={30} color="white" />
              </div>
              <div className="ocv-header-info">
                <div className="ocv-header-name">Coral</div>
                <div className="ocv-header-status">
                  <span className="ocv-status-dot" />
                  Oceano Con Vista · Concierge
                </div>
              </div>
              <button className="ocv-close" onClick={handleClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Welcome */}
            {!started ? (
              <div className="ocv-welcome">
                <img src="images/chatbot.png" width={70} height={70} style={{ borderRadius: "0%", objectFit: "cover", marginBottom: "12px" }} />
                <div className="ocv-welcome-title">Hi, I'm Coral 👋</div>
                <div className="ocv-welcome-sub">Your concierge at Oceano Con Vista.<br/>How can I help you today?</div>
                <div className="ocv-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="ocv-suggestion" onClick={() => startChat(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ocv-messages">
                {messages.map((m, i) => (
                  <div key={i} className={`ocv-msg ${m.role === "user" ? "user" : ""}`}>
                    {m.role === "assistant" && (
                      <div className="ocv-msg-avatar">
                        <BotIcon size={16} color="white" />
                      </div>
                    )}
                    <div
                      className={`ocv-bubble ${m.role === "assistant" ? "bot" : "user"}`}
                      dangerouslySetInnerHTML={{ __html: formatText(m.content) }}
                    />
                  </div>
                ))}
                {loading && (
                  <div className="ocv-msg">
                    <div className="ocv-msg-avatar">
                      <BotIcon size={16} color="white" />
                    </div>
                    <div className="ocv-bubble bot">
                      <div className="ocv-typing"><span/><span/><span/></div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Input */}
            <div className="ocv-input-area">
              <div className="ocv-input-row">
                <input
                  ref={started ? inputRef : null}
                  className="ocv-input"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      started ? sendMessage() : input.trim() && startChat(input.trim());
                    }
                  }}
                  disabled={loading}
                  maxLength={500}
                />
                <button
                  className="ocv-send"
                  onClick={() => started ? sendMessage() : input.trim() && startChat(input.trim())}
                  disabled={!input.trim() || loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* FAB */}
        {!open && (
          <button className="ocv-fab" onClick={() => setOpen(true)} aria-label="Chat with Coral">
            <BotIcon size={40} color="white" />
          </button>
        )}

      </div>
    </>
  );
}