window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 9,
  title: "System Design of UPI Payments",
  video: "https://www.youtube.com/watch?v=fqySz1Me2pI",
  category: "Piyush Garg",
  tagline: "PhonePe → Yes Bank → NPCI debit, ICICI credit ₹1000; no ack and the shopkeeper never got it.",
  summary: "Before UPI you needed account number, bank, branch, and IFSC, then picked IMPS (instant small), NEFT (hours, share a UTR), or RTGS (large, realtime) on RBI-regulated rails. Unified Payments Interface hides that behind a VPA (piyushgarg.dev@okicici) — a QR is just that string. NPCI is closed infrastructure, not a public gateway: only trusted banks (ICICI, HDFC, SBI, Yes Bank) may call it. Customer PSPs (GPay, PhonePe, Paytm) partner a bank to enter. Happy path: PhonePe intent ₹1000 → Yes Bank → NPCI, PIN, debit, ICICI credit, GPay notify. Complete only when both banks ack; ICICI busy means rollback and the money returns.",

  theory: [
    {
      heading: "Before UPI: IFSC, IMPS, NEFT, RTGS",
      body: "Digital transfers used to mean banks as the system: ICICI, HDFC, SBI, all <b>RBI-regulated</b>. To move money from your ICICI account to a friend's HDFC account you collected a unique bundle: <b>account number</b>, <b>bank name</b>, <b>branch code</b>, <b>IFSC</b>, plus the amount. Miss a field and the transaction reverts. Rails: <b>IMPS</b> (Immediate Payment Service) for small instant amounts like ₹1000–₹2000; <b>NEFT</b> (National Electronic Funds Transfer) for larger sums (₹50k–₹1 lakh in the talk) that take <b>2–3 hours</b> — people share a UTR or a screenshot while they wait; <b>RTGS</b> (Real Time Gross Settlement) for ₹5–20 lakh, realtime once you submit. That protocol tax is what UPI wanted to delete.",
      bullets: [
        "IFSC + branch exist because there is no single ICICI in India — many branches.",
        "IMPS = small and now. NEFT = bigger and later. RTGS = huge and now."
      ]
    },
    {
      heading: "UPI and NPCI: a closed backbone, not a public API",
      body: "<b>Unified Payments Interface</b> promised: open the app, enter an id, transfer, done — and instant. The machine under it is <b>NPCI</b> (National Payments Corporation of India). NPCI is <b>infrastructure</b>, not a payment gateway or a consumer app. It runs a <b>secure closed network</b>. You cannot hit NPCI APIs from a laptop. It only trusts API calls from member banks. The lecture's trusted set: ICICI, HDFC, SBI, Yes Bank (and the rest of the popular banks on that mesh). PhonePe and Google Pay are not on that list. Entry barrier is the whole security story: apps must partner a bank to even speak UPI.",
      bullets: [
        "NPCI powers UPI. It is not GPay.",
        "Untrusted callers never get a socket. Banks do."
      ]
    },
    {
      heading: "Customer PSP and VPA: username@handle, QR is lazy typing",
      body: "The app you open is a <b>customer payment service provider (PSP / CPSP)</b>: Google Pay, PhonePe, Paytm. They give UI — scan, type, confirm. Addressing is a <b>virtual payment address (VPA)</b>: unique username + UPI handle, like <code>piyushgarg.dev@okicici</code> or <code>user@ybl</code>. No IFSC, no 11-digit account, shareable and memorable. Scanning a QR is not a different protocol: the QR <b>contains the VPA</b>. Typing it by hand risks a spelling miss; the camera is the lazy, safer enter. PhonePe/GPay still cannot drop that VPA onto NPCI themselves.",
      bullets: [
        "Payer app = UI. PSP bank = the licensed mouth into NPCI.",
        "VPA replaces account+IFSC as the public address."
      ]
    },
    {
      heading: "Partner banks: PhonePe/Yes Bank, GPay/ICICI",
      body: "NPCI will only accept the payment intent from a trusted bank. PhonePe's partner in the walkthrough is <b>Yes Bank</b>. Google Pay's partner on the payee side is <b>ICICI</b>. Razorpay's public list in the talk: GPay ties up Axis, ICICI, HDFC, SBI; PhonePe with Yes Bank, ICICI, Axis; Amazon Pay with its own set. Roles on that slide: payer app, PSP, NPCI, <b>issuing bank</b> (where money is cut), <b>acquiring bank</b> (receiver), <b>payee PSP</b> (the other person's app). High-level only — Piyush could not find NPCI's internal routing or tech stack.",
      bullets: [
        "Customer PSP forwards the intent to its chosen PSP bank.",
        "Issuing bank debits. Acquiring bank credits. NPCI sits in the middle."
      ]
    },
    {
      heading: "Happy path: ₹1000 from user1@yesbank to piyush@okicici",
      body: "User opens PhonePe, builds an intent: from their VPA, to <code>piyushgarg.dev@okicici</code>, amount ₹1000. PhonePe sends that intent to Yes Bank. Yes Bank puts it on NPCI because the call is trusted. NPCI asks Yes Bank: does this user have the balance? Yes Bank says yes, then demands authentication — the UPI PIN screen PhonePe shows. User enters PIN. NPCI tells Yes Bank to <b>debit ₹1000</b>. Then NPCI tells ICICI to <b>credit Piyush's account ₹1000</b>. ICICI pushes a notification to Google Pay (Piyush's customer PSP): received ₹1000. Both banks accepted because the requests came from the trusted NPCI fabric. From-VPA + to-VPA was enough addressing.",
      bullets: [
        "Balance check and PIN happen before the debit.",
        "Credit notify is a bank → payee-app push, not NPCI talking to GPay."
      ]
    },
    {
      heading: "Complete only on two acks; busy ICICI rolls back",
      body: "The transfer is marked complete <b>only when both sides acknowledge</b>: money left the payer and landed at the payee. If ICICI's server is busy and never acks, NPCI treats the credit as failed and <b>rolls back</b> — Yes Bank is told to credit the ₹1000 back. That is the shopkeeper story: your account was debited, they say it never arrived, then the money returns because acknowledgment never happened. Push is you sending. <b>Pull</b> is a collect / \"request ₹1000\" / some online checkouts: the customer creates a pull on NPCI, and NPCI asks the payer to authorize. Same closed network, opposite initiator. Internals of NPCI (how they route, what they run) were not in any blog Piyush read, including Razorpay and Google Pay's responsibility pages. Scale he cites is brutal — he even says billions of operations a second in awe — and building that fault-tolerant realtime fabric is the engineering art NPCI already shipped.",
      bullets: [
        "No second ack → refund the debit. Do not leave money in a hole.",
        "Pull = collect request. Push = you typed send.",
        "Public material stops at this sequence. Low-level NPCI is unpublished."
      ]
    }
  ],

  keyTerms: [
    { term: "UPI", def: "Unified Payments Interface: pay with a VPA instead of account+IFSC, intended to be instant." },
    { term: "NPCI", def: "National Payments Corporation of India. Closed UPI backbone. Not a consumer app. Banks only." },
    { term: "VPA", def: "Virtual payment address, username@handle (piyushgarg.dev@okicici). A QR stores this string." },
    { term: "Customer PSP", def: "The app UI: PhonePe, Google Pay, Paytm. Cannot call NPCI without a partner bank." },
    { term: "PSP / partner bank", def: "Licensed UPI member (Yes Bank, ICICI, …) that forwards intents into NPCI." },
    { term: "IMPS / NEFT / RTGS", def: "Pre-UPI rails: instant small, hours-long with UTR, realtime large." },
    { term: "Issuing / acquiring", def: "Payer's bank vs receiver's bank. Debit then credit, both via NPCI." },
    { term: "Two-ack complete", def: "Transaction finishes only when debit and credit both acknowledge; else NPCI rolls back." }
  ],

  tradeoffs: [
    { pro: "VPA and QR replace account+IFSC+branch for everyday ₹1000 sends.", con: "A misspelled VPA is still the wrong destination; QR only removes typing." },
    { pro: "NPCI's closed bank mesh is why PhonePe cannot spoof a credit.", con: "Apps must partner a bank; there is no public NPCI API for your startup." },
    { pro: "Two-ack rollback explains the shopkeeper \"didn't get it\" refund.", con: "A busy acquiring bank turns a debit into a temporary scare before the reverse credit." },
    { pro: "IMPS/NEFT/RTGS still exist for amounts and delays UPI did not swallow whole.", con: "UPI's public story is high-level; you cannot honestly draw NPCI's inner routers." }
  ],

  interviewTips: [
    "Start pre-UPI: account, IFSC, IMPS vs NEFT (2–3 h, UTR) vs RTGS. Then UPI = VPA.",
    "Say NPCI is infrastructure, closed, banks only. GPay is a customer PSP, not NPCI.",
    "Walk ₹1000: PhonePe → Yes Bank → NPCI → balance → PIN → debit Yes Bank → credit ICICI → GPay notify.",
    "Complete = both acks. Draw ICICI busy, no ack, rollback, money back — the kirana story.",
    "Name issuing vs acquiring bank, and push vs pull (request money).",
    "Admit internals are unpublished. Do not invent a Kafka cluster inside NPCI."
  ],

  scene: {
    nodes: [
      { id: "payer", label: "Payer", type: "phone", pos: [-11, 0, 3.5] },
      { id: "icici0", label: "ICICI", type: "db", pos: [-4, 0, -4] },
      { id: "hdfc", label: "HDFC", type: "db", pos: [2, 0, -4] },
      { id: "sbi", label: "SBI", type: "db", pos: [8, 0, -4] },
      { id: "nIfsc", label: "acct + IFSC + branch", type: "note", pos: [2, 0, -7] },
      { id: "nRails", label: "IMPS now / NEFT hours / RTGS big", type: "note", pos: [2, 0, 0], showAt: 0 },

      { id: "npci", label: "NPCI closed", type: "zone", pos: [2, 0, 0], size: [14, 5.5], showAt: 1 },
      { id: "npciC", label: "NPCI", type: "gateway", pos: [2, 0, 0], showAt: 1 },
      { id: "bYes", label: "Yes Bank", type: "db", pos: [-4, 0, 1.6], showAt: 1 },
      { id: "bIcici", label: "ICICI", type: "db", pos: [8, 0, 1.6], showAt: 1 },
      { id: "bHdfc", label: "HDFC", type: "db", pos: [-4, 0, -1.6], showAt: 1 },
      { id: "bSbi", label: "SBI", type: "db", pos: [8, 0, -1.6], showAt: 1 },
      { id: "nTrust", label: "Banks only; no public API", type: "note", pos: [2, 0, -7], showAt: 1 },

      { id: "ppe", label: "PhonePe PSP", type: "phone", pos: [-11, 0, 3.5], showAt: 2 },
      { id: "vpa", label: "user@ybl → piyush@okicici", type: "note", pos: [-7.5, 0, 7.2], showAt: 2 },
      { id: "qr", label: "QR = VPA bytes", type: "point", pos: [-11, 0, 6.5], showAt: 2 },

      { id: "intent", label: "Intent ₹1000", type: "queue", pos: [-11, 0, 0], showAt: 3 },
      { id: "nPart", label: "PhonePe partner = Yes Bank", type: "note", pos: [-7.5, 0, -3.4], showAt: 3 },

      { id: "nBal", label: "NPCI: balance at Yes Bank?", type: "note", pos: [2, 0, 7.2], showAt: 4 },

      { id: "pin", label: "UPI PIN screen", type: "phone", pos: [-11, 0, -3.5], showAt: 5 },
      { id: "nPin", label: "Yes Bank needs auth", type: "note", pos: [-7.5, 0, -7], showAt: 5 },

      { id: "nDeb", label: "Debit ₹1000 Yes Bank", type: "note", pos: [-4, 0, 7.2], showAt: 6 },
      { id: "nCred", label: "Credit ₹1000 ICICI", type: "note", pos: [8, 0, 7.2], showAt: 6 },

      { id: "gpay", label: "GPay payee", type: "phone", pos: [11, 0, 5.5], showAt: 7 },
      { id: "nAck", label: "Both ack → complete", type: "note", pos: [2, 0, 7.2], showAt: 7 },

      { id: "nFail", label: "No ICICI ack → rollback", type: "note", pos: [8, 0, -7], showAt: 8 },
      { id: "shop", label: "Shop: not received", type: "user", pos: [11, 0, -3.5], showAt: 8 }
    ],
    edges: [
      { from: "payer", to: "icici0", label: "IFSC" },
      { from: "icici0", to: "hdfc", label: "IMPS/NEFT" },
      { from: "ppe", to: "qr", showAt: 2, dashed: true },
      { from: "ppe", to: "intent", showAt: 3 },
      { from: "intent", to: "bYes", showAt: 3 },
      { from: "bYes", to: "npciC", showAt: 3 },
      { from: "npciC", to: "bYes", label: "balance?", showAt: 4 },
      { from: "bYes", to: "ppe", label: "need PIN", showAt: 5 },
      { from: "ppe", to: "pin", showAt: 5 },
      { from: "npciC", to: "bYes", label: "debit", showAt: 6 },
      { from: "npciC", to: "bIcici", label: "credit", showAt: 6 },
      { from: "bIcici", to: "gpay", label: "notify", showAt: 7 },
      { from: "bIcici", to: "npciC", label: "no ack", showAt: 8, dashed: true },
      { from: "npciC", to: "bYes", label: "credit back", showAt: 8 }
    ],
    steps: [
      {
        title: "Pre-UPI: IFSC and three rails",
        text: "RBI-regulated banks. To send ICICI → HDFC you need account number, bank, branch, IFSC, amount. IMPS is instant small (₹1000–2000). NEFT is ₹50k–1 lakh and 2–3 hours (share a UTR). RTGS is ₹5–20 lakh realtime. Miss a field and it reverts.",
        highlight: ["payer", "icici0", "hdfc", "sbi", "nIfsc", "nRails"],
        flows: [
          { from: "payer", to: "icici0", color: "#4ade80", label: "details" },
          { from: "icici0", to: "hdfc", color: "#60a5fa", label: "NEFT?" }
        ]
      },
      {
        title: "NPCI trusts only member banks",
        text: "UPI's backbone is NPCI — infrastructure, not GPay. The mesh is closed. ICICI, HDFC, SBI, Yes Bank (and other popular banks) may call it. PhonePe cannot. That entry barrier is the security model.",
        highlight: ["npci", "npciC", "bYes", "bIcici", "bHdfc", "bSbi", "nTrust"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer"],
        flows: [
          { from: "bYes", to: "npciC", color: "#4ade80", label: "trusted" },
          { from: "bIcici", to: "npciC", color: "#4ade80", label: "trusted" }
        ]
      },
      {
        title: "PhonePe UI: VPA or QR",
        text: "Customer PSP is the app. Address is a VPA — user@ybl, piyushgarg.dev@okicici — no IFSC. QR is the same string so you do not typo it. The app still has no NPCI socket.",
        highlight: ["ppe", "qr", "vpa", "npciC"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer", "nTrust", "bHdfc", "bSbi"],
        flows: [
          { from: "ppe", to: "qr", color: "#60a5fa", label: "scan" }
        ]
      },
      {
        title: "Intent ₹1000 enters via Yes Bank",
        text: "Payer builds: from my VPA, to piyush@okicici, ₹1000. PhonePe forwards the intent to its partner Yes Bank. Yes Bank places it on NPCI. NPCI accepts because the caller is a trusted bank, not because PhonePe is famous.",
        highlight: ["ppe", "intent", "bYes", "npciC", "nPart", "vpa"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer", "nTrust", "bHdfc", "bSbi", "qr"],
        flows: [
          { from: "ppe", to: "intent", color: "#4ade80", label: "₹1000" },
          { from: "intent", to: "bYes", color: "#4ade80", label: "PSP bank" },
          { from: "bYes", to: "npciC", color: "#fb923c", label: "put on UPI" }
        ]
      },
      {
        title: "NPCI asks Yes Bank for balance",
        text: "NPCI reads the intent: a Yes Bank user wants to pay Piyush at ICICI. First check: does the payer have ₹1000? Yes Bank, on the trusted fabric, answers yes. Debit has not happened yet.",
        highlight: ["npciC", "bYes", "nBal", "bIcici"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer", "nTrust", "bHdfc", "bSbi", "qr", "nPart", "vpa", "intent"],
        flows: [
          { from: "npciC", to: "bYes", color: "#60a5fa", label: "balance?" },
          { from: "bYes", to: "npciC", color: "#4ade80", label: "yes" }
        ]
      },
      {
        title: "PIN screen before any debit",
        text: "Yes Bank tells PhonePe: path is ok, I need authentication. PhonePe shows the UPI PIN UI. The user sends the PIN back. Only then will NPCI order a debit. Balance alone is not consent.",
        highlight: ["bYes", "ppe", "pin", "nPin", "npciC"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer", "nTrust", "bHdfc", "bSbi", "qr", "nPart", "vpa", "intent", "nBal"],
        flows: [
          { from: "bYes", to: "ppe", color: "#fb923c", label: "auth?" },
          { from: "ppe", to: "pin", color: "#4ade80", label: "PIN" }
        ]
      },
      {
        title: "Debit Yes Bank, credit ICICI ₹1000",
        text: "NPCI tells Yes Bank to cut ₹1000 (issuing bank). Then NPCI tells ICICI to credit Piyush (acquiring bank). Both obey because the order came from NPCI, not from PhonePe. VPA in, VPA out — no IFSC on this path.",
        highlight: ["npciC", "bYes", "bIcici", "nDeb", "nCred"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer", "nTrust", "bHdfc", "bSbi", "qr", "nPart", "vpa", "intent", "nBal", "pin", "nPin", "ppe"],
        flows: [
          { from: "npciC", to: "bYes", color: "#f87171", label: "debit" },
          { from: "npciC", to: "bIcici", color: "#4ade80", label: "credit" }
        ]
      },
      {
        title: "Both ack, GPay shows +₹1000",
        text: "Only when debit and credit both acknowledge is the transaction complete. ICICI notifies Google Pay, Piyush's customer PSP. GPay shows received ₹1000 from that VPA. That notify is bank → payee app, still not a public NPCI call.",
        highlight: ["bYes", "bIcici", "gpay", "nAck", "npciC"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer", "nTrust", "bHdfc", "bSbi", "qr", "nPart", "vpa", "intent", "nBal", "pin", "nPin", "nDeb", "nCred", "ppe"],
        flows: [
          { from: "bIcici", to: "gpay", color: "#60a5fa", label: "notify" },
          { from: "bYes", to: "npciC", color: "#4ade80", label: "ack" },
          { from: "bIcici", to: "npciC", color: "#4ade80", label: "ack" }
        ]
      },
      {
        title: "ICICI busy: no ack, money comes back",
        text: "Kirana: you paid, they say it never landed. ICICI did not ack (server busy). NPCI rolls back and tells Yes Bank to credit ₹1000 back. Incomplete acknowledgment is a failed UPI, not a silent theft. Pull (request money) uses the same NPCI mesh with the other party starting.",
        highlight: ["bIcici", "npciC", "bYes", "nFail", "shop"],
        fail: ["bIcici"],
        hide: ["icici0", "hdfc", "sbi", "nIfsc", "nRails", "payer", "nTrust", "bHdfc", "bSbi", "qr", "nPart", "vpa", "intent", "nBal", "pin", "nPin", "nDeb", "nCred", "ppe", "gpay", "nAck"],
        flows: [
          { from: "bIcici", to: "npciC", color: "#f87171", label: "timeout" },
          { from: "npciC", to: "bYes", color: "#fb923c", label: "rollback" }
        ]
      }
    ]
  }
});
