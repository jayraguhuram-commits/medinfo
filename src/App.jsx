import { useState, useRef, useEffect } from "react";

const PRODUCT_DB = `
=== PHARMACY PRODUCT DATABASE ===

1. PARACETAMOL 500mg Tablets (Crocin / Dolo 650 / Calpol)
   - Uses: Fever, mild to moderate pain (headache, toothache, body ache)
   - Dosage: Adults: 1–2 tablets every 4–6 hrs. Max 8 tablets/day. Children (6–12): 1 tablet.
   - Contraindications: Liver disease, alcohol dependency
   - Side effects: Rare at normal doses; overdose causes liver damage
   - Storage: Cool, dry place below 25°C
   - Price: ₹30–₹65 per strip

2. IBUPROFEN 400mg Tablets (Brufen / Combiflam)
   - Uses: Pain, inflammation, fever, menstrual cramps
   - Dosage: 1 tablet 3 times/day after food. Max 3 tablets/day.
   - Contraindications: Peptic ulcer, kidney disease, pregnancy (3rd trimester), asthma
   - Side effects: Stomach upset, nausea, dizziness
   - Storage: Below 30°C, away from moisture
   - Price: ₹25–₹55 per strip

3. CETIRIZINE 10mg Tablets (Zyrtec / Alerid / Cetcip)
   - Uses: Allergic rhinitis, urticaria, hay fever, skin allergies
   - Dosage: 1 tablet once daily at bedtime
   - Contraindications: Severe kidney disease
   - Side effects: Drowsiness, dry mouth, headache
   - Storage: Room temperature
   - Price: ₹20–₹40 per strip

4. OMEPRAZOLE 20mg Capsules (Prilosec / Omez / Ocid)
   - Uses: Acid reflux, GERD, gastric ulcers, heartburn
   - Dosage: 1 capsule before meals daily, usually for 4–8 weeks
   - Contraindications: Hypersensitivity to PPIs
   - Side effects: Headache, nausea, diarrhea, vitamin B12 deficiency (long-term)
   - Storage: Below 25°C in original packaging
   - Price: ₹35–₹80 per strip

5. AMOXICILLIN 500mg Capsules (Mox / Novamox / Amoxil)
   - Uses: Bacterial infections — respiratory, urinary tract, skin, ear infections
   - Dosage: 1 capsule 3 times/day for 5–7 days (as prescribed)
   - Contraindications: Penicillin allergy, mononucleosis
   - Side effects: Diarrhea, rash, nausea
   - Storage: Below 25°C; keep suspension refrigerated
   - Price: ₹60–₹120 per strip
   - PRESCRIPTION REQUIRED

6. METFORMIN 500mg Tablets (Glucophage / Glycomet / Obimet)
   - Uses: Type 2 Diabetes management
   - Dosage: 1 tablet twice daily with meals; dosage adjusted by doctor
   - Contraindications: Kidney disease, liver failure, heavy alcohol use
   - Side effects: Nausea, diarrhea, lactic acidosis (rare)
   - Storage: Room temperature, 15–30°C
   - Price: ₹25–₹70 per strip
   - PRESCRIPTION REQUIRED

7. VITAMIN D3 60000 IU Sachets (D-Rise / Calcirol / Uprise-D3)
   - Uses: Vitamin D deficiency, bone health, immunity
   - Dosage: 1 sachet per week for 8 weeks or as prescribed
   - Contraindications: Hypercalcemia, kidney stones
   - Side effects: Rare at recommended dose; toxicity with overuse
   - Storage: Below 25°C, protected from light
   - Price: ₹150–₹300 per pack

8. AZITHROMYCIN 500mg Tablets (Azee / Zithromax / Azithral)
   - Uses: Bacterial infections — chest, throat, skin, STIs
   - Dosage: 1 tablet daily for 3–5 days
   - Contraindications: Liver disease, QT prolongation risk
   - Side effects: Nausea, diarrhea, stomach pain, QT prolongation
   - Storage: Below 30°C
   - Price: ₹70–₹150 per pack
   - PRESCRIPTION REQUIRED

9. MONTELUKAST 10mg Tablets (Singulair / Montair / Telekast)
   - Uses: Asthma prevention, allergic rhinitis, exercise-induced bronchospasm
   - Dosage: 1 tablet at bedtime daily
   - Contraindications: Phenylketonuria (chewable form)
   - Side effects: Headache, behavior/mood changes, abdominal pain
   - Storage: Protect from moisture and light
   - Price: ₹80–₹180 per strip
   - PRESCRIPTION REQUIRED

10. PANTOPRAZOLE 40mg Tablets (Pantocid / Pan-D / Pantop)
     - Uses: GERD, stomach ulcers, Zollinger-Ellison syndrome, H. pylori eradication
     - Dosage: 1 tablet before breakfast daily
     - Contraindications: Hypersensitivity to PPIs
     - Side effects: Headache, flatulence, nausea, vitamin B12 deficiency (long-term)
     - Storage: Below 25°C
     - Price: ₹30–₹90 per strip
`;

const SYSTEM_PROMPT = `You are MedInfo Assistant — an intelligent, empathetic AI for a professional pharmacy. You help patients and pharmacists with product-related queries using the internal database below.

${PRODUCT_DB}

RESPONSE RULES:
1. End EVERY response with this exact disclaimer block:
---
⚕️ Medical Disclaimer: This information is for educational purposes only and does not replace professional medical advice. Always consult a licensed doctor or pharmacist before starting, stopping, or changing any medication.
2. For prescription medicines (PRESCRIPTION REQUIRED), firmly state: "A valid prescription from a licensed physician is mandatory to dispense this medicine."
3. Never diagnose. Never recommend a medicine for a new symptom — always say "Please consult your doctor."
4. If a product is not in the database, say: "This product is not in our current catalog. Please visit our pharmacy or consult your healthcare provider."
5. For children under 6, always recommend consulting a pediatrician.
6. Use a warm, clear, professional tone. Structure responses with bold section headers where relevant.
7. Keep responses focused, helpful, and concise.
8. You represent a trusted, premium pharmacy brand. Every response should build patient trust.`;

const FEATURES = [
  { icon: "ti-database", title: "Product Catalog", desc: "Instant access to detailed info on 10+ medicines including dosage, uses, and pricing." },
  { icon: "ti-shield-check", title: "Safety First", desc: "Every response includes medical disclaimers and prescription warnings automatically." },
  { icon: "ti-clock", title: "24/7 Available", desc: "Get answers any time of day — no waiting for pharmacy hours or hold music." },
  { icon: "ti-message-circle", title: "Natural Language", desc: "Just ask in plain language. No medical jargon needed to get clear, accurate answers." },
];

const PILLS = [
  "What is Paracetamol used for?",
  "Side effects of Ibuprofen?",
  "Is Cetirizine safe daily?",
  "Omeprazole vs Pantoprazole?",
  "Vitamin D3 dosage info",
  "Does Amoxicillin need a prescription?",
];

const STATS = [
  { value: "10+", label: "Medicines Indexed" },
  { value: "100%", label: "Safe Responses" },
  { value: "24/7", label: "Always On" },
  { value: "0s", label: "Wait Time" },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "2px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#0F6E56",
          display: "inline-block",
          animation: `blink 1.4s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function ChatMessage({ msg, idx }) {
  const isUser = msg.role === "user";
  const parts = (msg.content || "").split(/(\*\*[^*]+\*\*)/g);
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 16,
      animation: `msgIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both`,
      animationDelay: `${idx * 0.03}s`,
    }}>
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: "linear-gradient(135deg,#0F6E56,#1d9e75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 10, flexShrink: 0, marginTop: 2, boxShadow: "0 2px 8px rgba(15,110,86,0.25)"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </div>
      )}
      <div style={{
        maxWidth: "76%",
        background: isUser
          ? "linear-gradient(135deg, #0F6E56, #1d9e75)"
          : "#fff",
        color: isUser ? "#fff" : "#1a2e25",
        border: isUser ? "none" : "1px solid #e8f5f0",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "12px 16px",
        fontSize: 14,
        lineHeight: 1.65,
        boxShadow: isUser ? "0 4px 16px rgba(15,110,86,0.2)" : "0 2px 12px rgba(0,0,0,0.06)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {parts.map((p, i) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={i} style={{ fontWeight: 600, color: isUser ? "#fff" : "#0F6E56" }}>{p.slice(2, -2)}</strong>
            : <span key={i}>{p}</span>
        )}
        <div style={{
          fontSize: 11, marginTop: 6,
          color: isUser ? "rgba(255,255,255,0.6)" : "#9cb8ae",
          textAlign: "right", letterSpacing: "0.02em"
        }}>{msg.ts}</div>
      </div>
      {isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: "#f0f9f5",
          border: "1px solid #c8e8dc",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginLeft: 10, flexShrink: 0, marginTop: 2,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hello! I'm MedInfo Assistant — your intelligent pharmacy guide.\n\nI can answer questions about medicine uses, dosage, side effects, pricing, storage requirements, and prescription rules.\n\nWhat would you like to know today?",
    ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (view === "chat") setTimeout(() => inputRef.current?.focus(), 300);
  }, [view]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function send(text) {
    const txt = (text || input).trim();
    if (!txt || loading) return;
    setInput("");
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "44px";
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const next = [...messages, { role: "user", content: txt, ts }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: next.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "I'm having trouble responding. Please try again.";
      const ats = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(m => [...m, { role: "assistant", content: reply, ts: ats }]);
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function resetChat() {
    setMessages([{
      role: "assistant",
      content: "Chat reset. How can I help you with medicine information today?",
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
    setError(null);
  }

  if (view === "chat") return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5faf8", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes msgIn { from { opacity:0; transform:translateY(10px) scale(0.97); } to { opacity:1; transform:none; } }
        @keyframes blink { 0%,100%{opacity:.25;transform:scale(.7)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#c8e8dc;border-radius:4px}
        textarea:focus{outline:none;}
        button{cursor:pointer;font-family:inherit;}
      `}</style>

      {/* Topbar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e8f5f0", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, boxShadow:"0 1px 0 #e8f5f0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setView("landing")} style={{ background:"none", border:"none", color:"#6b9e8c", padding:"6px 8px", borderRadius:8, display:"flex", alignItems:"center", gap:4, fontSize:13, fontWeight:500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </button>
          <div style={{ width:1, height:20, background:"#e8f5f0" }} />
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#0F6E56,#1d9e75)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(15,110,86,0.25)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:"#0a1f16", letterSpacing:"-0.01em" }}>MedInfo Assistant</div>
              <div style={{ fontSize:12, color:"#1d9e75", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#1d9e75", display:"inline-block", boxShadow:"0 0 0 2px #a3e4ca" }} />
                AI Pharmacy Guide · Online
              </div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ background:"#f0faf6", border:"1px solid #c8e8dc", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#0F6E56", fontWeight:500, display:"flex", alignItems:"center", gap:5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
            10 Products
          </div>
          <button onClick={resetChat} style={{ background:"none", border:"1px solid #e8f5f0", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#6b9e8c", display:"flex", alignItems:"center", gap:5, fontWeight:500 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            New chat
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background:"#e8f5f0", borderBottom:"1px solid #c8e8dc", padding:"9px 24px", fontSize:12, color:"#085041", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span><strong>Medical Disclaimer:</strong> This chatbot provides general product information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed healthcare provider.</span>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 24px 8px" }}>
        {messages.map((m, i) => <ChatMessage key={i} msg={m} idx={i} />)}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#0F6E56,#1d9e75)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(15,110,86,0.25)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <div style={{ background:"#fff", border:"1px solid #e8f5f0", borderRadius:"18px 18px 18px 4px", padding:"12px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <TypingDots />
            </div>
          </div>
        )}
        {error && (
          <div style={{ background:"#fff5f5", border:"1px solid #fdc5c5", borderRadius:12, padding:"12px 16px", fontSize:13, color:"#c0392b", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick pills if early */}
      {messages.length <= 1 && (
        <div style={{ padding:"0 24px 12px", display:"flex", flexWrap:"wrap", gap:8 }}>
          <div style={{ width:"100%", fontSize:11, color:"#9cb8ae", marginBottom:2, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>Suggested questions</div>
          {PILLS.map((p, i) => (
            <button key={i} onClick={() => send(p)} style={{ background:"#fff", border:"1px solid #c8e8dc", borderRadius:20, padding:"6px 14px", fontSize:12.5, color:"#0F6E56", fontWeight:500, whiteSpace:"nowrap", transition:"all 0.15s", boxShadow:"0 1px 4px rgba(15,110,86,0.08)" }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ background:"#fff", borderTop:"1px solid #e8f5f0", padding:"14px 20px", flexShrink:0, boxShadow:"0 -1px 0 #e8f5f0" }}>
        <div style={{ display:"flex", gap:10, alignItems:"flex-end", background:"#f5faf8", border:"1.5px solid #c8e8dc", borderRadius:16, padding:"8px 8px 8px 16px", transition:"border-color 0.2s" }}
          onFocus={() => {}} >
          <textarea
            ref={el => { inputRef.current = el; textareaRef.current = el; }}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(); }}
            onKeyDown={onKey}
            placeholder="Ask about any medicine — uses, dosage, side effects, price..."
            rows={1}
            style={{ flex:1, resize:"none", border:"none", background:"transparent", fontSize:14, lineHeight:1.55, color:"#1a2e25", outline:"none", fontFamily:"inherit", minHeight:44, maxHeight:120, paddingTop:10 }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{ width:40, height:40, borderRadius:12, background: input.trim() && !loading ? "linear-gradient(135deg,#0F6E56,#1d9e75)" : "#e8f5f0", border:"none", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s", boxShadow: input.trim() && !loading ? "0 3px 10px rgba(15,110,86,0.3)" : "none", transform: input.trim() && !loading ? "scale(1)" : "scale(0.95)" }}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "#fff" : "#9cb8ae"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div style={{ textAlign:"center", fontSize:11, color:"#b0ccc3", marginTop:8 }}>Press Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );

  // ─── LANDING PAGE ───────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f5faf8", minHeight:"100vh", color:"#1a2e25" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        button{cursor:pointer;font-family:inherit;}
        .card-hover { transition:all 0.2s ease; }
        .card-hover:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(15,110,86,0.12) !important; border-color:#a3e4ca !important; }
        .pill-hover { transition:all 0.15s; }
        .pill-hover:hover { background:#0F6E56 !important; color:#fff !important; border-color:#0F6E56 !important; }
        .cta-btn:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(15,110,86,0.35) !important; }
        .cta-btn:active { transform:scale(0.98); }
      `}</style>

      {/* NAV */}
      <nav style={{ background:"rgba(255,255,255,0.9)", backdropFilter:"blur(12px)", borderBottom:"1px solid #e8f5f0", position:"sticky", top:0, zIndex:100, padding:"0 48px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#085041,#1d9e75)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 10px rgba(15,110,86,0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:16, color:"#0a1f16", letterSpacing:"-0.02em", fontFamily:"'DM Serif Display',serif" }}>MedInfo</div>
            <div style={{ fontSize:10, color:"#6b9e8c", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:-1 }}>AI Pharmacy Assistant</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:"#e8f5f0", border:"1px solid #c8e8dc", borderRadius:20, padding:"4px 14px", fontSize:12, color:"#0F6E56", fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#1d9e75", display:"inline-block", animation:"pulse 2s ease infinite" }} />
            Live · 10 Products
          </div>
          <button onClick={() => setView("chat")} className="cta-btn" style={{ background:"linear-gradient(135deg,#0F6E56,#1d9e75)", color:"#fff", border:"none", borderRadius:10, padding:"9px 22px", fontWeight:600, fontSize:14, display:"flex", alignItems:"center", gap:7, transition:"all 0.2s", boxShadow:"0 4px 14px rgba(15,110,86,0.25)", letterSpacing:"-0.01em" }}>
            Open Chat
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding:"100px 48px 80px", maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
        <div style={{ animation:"fadeUp 0.7s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#e8f5f0", border:"1px solid #a3e4ca", borderRadius:20, padding:"5px 14px", fontSize:12, color:"#0F6E56", fontWeight:600, marginBottom:24, letterSpacing:"0.02em" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            AI-Powered · Always Accurate · Always Safe
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(40px,5vw,58px)", fontWeight:400, lineHeight:1.1, letterSpacing:"-0.02em", color:"#0a1f16", marginBottom:24 }}>
            Your intelligent<br/>
            <em style={{ color:"#0F6E56", fontStyle:"italic" }}>pharmacy guide,</em><br/>
            available 24/7
          </h1>
          <p style={{ fontSize:17, color:"#4a7a65", lineHeight:1.7, marginBottom:36, maxWidth:480 }}>
            Ask about any medicine — dosage, side effects, interactions, pricing, and more. Instant, accurate answers powered by AI with built-in medical safety guardrails.
          </p>
          <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
            <button onClick={() => setView("chat")} className="cta-btn" style={{ background:"linear-gradient(135deg,#0F6E56,#1d9e75)", color:"#fff", border:"none", borderRadius:12, padding:"14px 30px", fontWeight:600, fontSize:15, display:"flex", alignItems:"center", gap:9, transition:"all 0.2s", boxShadow:"0 6px 20px rgba(15,110,86,0.3)", letterSpacing:"-0.01em" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Start Chatting Free
            </button>
            <div style={{ fontSize:13, color:"#6b9e8c", display:"flex", alignItems:"center", gap:6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              No signup required
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"flex", gap:32, marginTop:48, paddingTop:32, borderTop:"1px solid #e8f5f0" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ animation:`fadeUp 0.7s ease ${0.15 + i*0.08}s both` }}>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#0F6E56", fontWeight:400, letterSpacing:"-0.02em" }}>{s.value}</div>
                <div style={{ fontSize:12, color:"#6b9e8c", fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Preview */}
        <div style={{ animation:"fadeUp 0.7s ease 0.2s both", position:"relative" }}>
          <div style={{ position:"absolute", inset:"-20px", background:"radial-gradient(ellipse at 50% 50%,rgba(29,158,117,0.1),transparent 70%)", borderRadius:40, zIndex:0 }} />
          <div style={{ position:"relative", zIndex:1, background:"#fff", borderRadius:24, border:"1px solid #e8f5f0", boxShadow:"0 24px 80px rgba(10,31,22,0.12), 0 4px 16px rgba(15,110,86,0.08)", overflow:"hidden" }}>
            {/* Mock header */}
            <div style={{ background:"#fff", borderBottom:"1px solid #e8f5f0", padding:"14px 18px", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#0F6E56,#1d9e75)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:13, color:"#0a1f16" }}>MedInfo Assistant</div>
                <div style={{ fontSize:11, color:"#1d9e75", display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"#1d9e75", display:"inline-block" }} /> Online
                </div>
              </div>
              <div style={{ marginLeft:"auto", display:"flex", gap:5 }}>
                {["#e8f5f0","#e8f5f0","#e8f5f0"].map((c,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:c,border:"1px solid #c8e8dc"}}/>)}
              </div>
            </div>
            {/* Mock messages */}
            <div style={{ padding:18, background:"#f9fdfb", display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { role:"assistant", text:"Hello! Ask me about any medicine — I'm here to help with uses, dosage, and safety information." },
                { role:"user", text:"What are the side effects of Ibuprofen?" },
                { role:"assistant", text:"**Ibuprofen 400mg** may cause stomach upset, nausea, and dizziness. Take it after food to minimize gastric effects..." },
              ].map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:8, animation:`fadeUp 0.5s ease ${0.4+i*0.15}s both` }}>
                  {m.role==="assistant"&&<div style={{width:24,height:24,borderRadius:7,background:"linear-gradient(135deg,#0F6E56,#1d9e75)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>}
                  <div style={{ maxWidth:"80%", background:m.role==="user"?"linear-gradient(135deg,#0F6E56,#1d9e75)":"#fff", color:m.role==="user"?"#fff":"#1a2e25", border:m.role==="user"?"none":"1px solid #e8f5f0", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px", padding:"9px 13px", fontSize:12.5, lineHeight:1.5, boxShadow:m.role==="user"?"0 3px 10px rgba(15,110,86,0.2)":"0 1px 4px rgba(0,0,0,0.05)" }}>
                    {m.text.split(/(\*\*[^*]+\*\*)/).map((p,j)=>p.startsWith("**")&&p.endsWith("**")?<strong key={j}>{p.slice(2,-2)}</strong>:<span key={j}>{p}</span>)}
                  </div>
                </div>
              ))}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                {["Uses?","Dosage?","Price?"].map((l,i)=>(
                  <div key={i} style={{ background:"#fff", border:"1px solid #c8e8dc", borderRadius:12, padding:"4px 10px", fontSize:11, color:"#0F6E56", fontWeight:500 }}>{l}</div>
                ))}
              </div>
            </div>
            {/* Mock input */}
            <div style={{ padding:12, background:"#fff", borderTop:"1px solid #e8f5f0", display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ flex:1, background:"#f5faf8", border:"1px solid #e0f0e8", borderRadius:10, padding:"9px 14px", fontSize:12, color:"#9cb8ae" }}>Ask about a medicine...</div>
              <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#0F6E56,#1d9e75)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"80px 48px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#e8f5f0", border:"1px solid #a3e4ca", borderRadius:20, padding:"4px 14px", fontSize:12, color:"#0F6E56", fontWeight:600, marginBottom:16, letterSpacing:"0.03em" }}>Why MedInfo?</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(28px,4vw,42px)", color:"#0a1f16", fontWeight:400, letterSpacing:"-0.02em" }}>Built for trust, designed for clarity</h2>
          <p style={{ fontSize:16, color:"#4a7a65", marginTop:12, maxWidth:520, margin:"12px auto 0" }}>Every feature is designed with patient safety and pharmacy efficiency in mind.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card-hover" style={{ background:"#fff", border:"1px solid #e8f5f0", borderRadius:20, padding:"28px 24px", boxShadow:"0 4px 20px rgba(10,31,22,0.04)", animation:`fadeUp 0.6s ease ${i*0.1}s both` }}>
              <div style={{ width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#e8f5f0,#c8e8dc)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                <i className={`ti ${f.icon}`} style={{ fontSize:22, color:"#0F6E56" }} aria-hidden="true" />
              </div>
              <div style={{ fontWeight:600, fontSize:15, color:"#0a1f16", marginBottom:8, letterSpacing:"-0.01em" }}>{f.title}</div>
              <div style={{ fontSize:13.5, color:"#4a7a65", lineHeight:1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK QUESTIONS */}
      <section style={{ padding:"60px 48px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ background:"linear-gradient(135deg,#0a1f16,#0F6E56)", borderRadius:28, padding:"56px 48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.12)", borderRadius:20, padding:"4px 14px", fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:600, marginBottom:20 }}>Popular Queries</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:34, color:"#fff", fontWeight:400, lineHeight:1.2, letterSpacing:"-0.02em", marginBottom:16 }}>Ask anything about your medicines</h2>
            <p style={{ fontSize:14.5, color:"rgba(255,255,255,0.65)", lineHeight:1.7, marginBottom:28 }}>From basic dosage questions to complex drug interactions — get clear, safe answers instantly.</p>
            <button onClick={() => setView("chat")} className="cta-btn" style={{ background:"#fff", color:"#0F6E56", border:"none", borderRadius:12, padding:"13px 26px", fontWeight:700, fontSize:14, display:"inline-flex", alignItems:"center", gap:7, transition:"all 0.2s", boxShadow:"0 4px 16px rgba(0,0,0,0.2)" }}>
              Try it now
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {PILLS.map((p, i) => (
              <button key={i} onClick={() => { setView("chat"); setTimeout(() => send(p), 400); }} className="pill-hover" style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"9px 18px", fontSize:13, color:"rgba(255,255,255,0.9)", fontWeight:500, transition:"all 0.15s", backdropFilter:"blur(8px)" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY SECTION */}
      <section style={{ padding:"60px 48px 100px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ background:"#fff", border:"1px solid #e8f5f0", borderRadius:24, padding:"48px", display:"flex", gap:32, alignItems:"flex-start", boxShadow:"0 4px 24px rgba(10,31,22,0.05)" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"#e8f5f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:17, color:"#0a1f16", marginBottom:8, letterSpacing:"-0.01em" }}>Medical Safety & Disclaimer</div>
            <p style={{ fontSize:14, color:"#4a7a65", lineHeight:1.75, maxWidth:720 }}>
              MedInfo Assistant provides general pharmaceutical product information for educational purposes only. All responses include automatic medical disclaimers. This tool does not replace professional medical advice, diagnosis, or treatment. Users are always encouraged to consult a licensed doctor or pharmacist before making any medication decisions. Prescription medicines require a valid prescription from a licensed physician.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#0a1f16", padding:"40px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#0F6E56,#1d9e75)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:"#fff", fontWeight:400 }}>MedInfo</div>
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center" }}>
          For educational use only · Not a substitute for medical advice · Always consult your doctor
        </div>
        <button onClick={() => setView("chat")} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 18px", color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:7 }}>
          Open Assistant
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </footer>
    </div>
  );
}
