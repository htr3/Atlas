window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 25,
  title: "5 Tips for System Design Interviews",
  video: "https://www.youtube.com/watch?v=CtmBGH8MkX4",
  category: "Interview Prep",
  tagline: "Stay high-level, stay flexible, justify every box, and know what you can buy.",
  summary: "Five habits that separate a clean interview from a ramble: do not dive into protocol details before the interviewer asks, do not force a pet architecture onto new requirements, keep the drawing simple and zoom out, justify every choice instead of dropping buzzwords, and know off-the-shelf products well enough to argue buy versus build. Interviewers score the same session on clarity, knowledge, and flexibility.",

  theory: [
    {
      heading: "Tip 1: Do not go deep until invited",
      body: "A gateway in front of your services is enough of a first stroke. Jumping from there into \"we will use HTTP, here is the header layout, here is TLS\" burns the clock. The interviewer often lets you run, then you have to backtrack, which in the real world would have cost money. Sketch the box, pause, look for a nod. If they want database detail they will usually ask you to draw tables or an ER sketch, not to invent a wire protocol. Wait for the first place that actually needs depth.",
      bullets: [
        "State the hop (\"clients reach services through a gateway\"), then stop",
        "Fill in a protocol only after a pause, and only if they lean in",
        "Depth belongs where the design is still ambiguous, not on every arrow"
      ]
    },
    {
      heading: "Tip 2: Do not bring a frozen architecture",
      body: "Walking in with \"this is a Kafka-plus-microservices drawing I always use\" makes you hammer requirements into that shape. Requirements will shift in the room. If they suddenly care about one corner, do that corner first. A rigid attitude produces a brittle design: it will break before you do. Shape the system from the prompt, then adapt; do not pre-load a template and hope the prompt fits.",
      bullets: [
        "No favorite topology that every problem must wear",
        "Follow the interviewer's pointer even if it is not the part you wanted to show off",
        "Rebuild freely when a new constraint lands"
      ]
    },
    {
      heading: "Tip 3: Keep it simple, and keep looking at the whole wall",
      body: "KISS is not a slogan here; it is a defense against hacks. Staying inside one component too long bloats it. Step back, notice a piece that should be extracted and reused, and resist clever shortcuts that only work for the example on the board. Simple boxes with honest arrows beat a thicket of special cases you cannot explain under a follow-up.",
      bullets: [
        "Zoom out every few minutes and reread the original requirements",
        "Extract a repeated blob instead of copy-pasting it across the diagram",
        "A hack that saves one edge case usually costs the next question"
      ]
    },
    {
      heading: "Tip 4: Every claim needs a reason",
      body: "The most common failure is dropping a name (\"we'll put Kafka here\") with no why. Buzzwords without a problem statement sound like half-hearted thought. Critical reasoning is the actual skill: availability is hurting, so I replicate and partition; the feed is read-heavy, so I cache. If you cannot say the failure you are preventing, erase the box.",
      bullets: [
        "No component without a sentence of justification",
        "Use standard levers (replication, partitioning, decoupling) and then specialize",
        "Half-finished ideas are scored worse than a smaller finished design"
      ]
    },
    {
      heading: "Tip 5: Know what already exists, and when to buy it",
      body: "Stay current on products and practices. If the industry moved to managed NoSQL for a class of workloads, you should know that. If you name Redis, Kafka, or CloudFront, you should know roughly what they give you. Many interview problems are solved by an off-the-shelf piece; you still need the argument for a custom build (control, cost at extreme scale, a missing feature) with real pros and cons. Design habits (load balancing, sticky sessions, decoupling) are how you fill the gaps a product does not cover.",
      bullets: [
        "Products: what you can buy. Practices: how you wire what you buy",
        "Naming a tool implies you know its basic guarantees",
        "Custom is allowed; unexplained custom is not"
      ]
    },
    {
      heading: "What they are scoring",
      body: "Under the five tips sit three axes. <b>Clarity</b>: speak in complete decisions, justify them, use known patterns when a known problem appears. <b>Knowledge</b>: current tools, buy-versus-build, and the practices that make a custom requirement possible. <b>Flexibility</b>: switch targets when they ask, refuse a pre-baked architecture, and zoom out to un-bloat a corner. Keep all three on the back of your mind for the whole hour."
    }
  ],

  keyTerms: [
    { term: "Premature detail", def: "Filling in protocols, headers, or code before the interviewer has asked for that layer." },
    { term: "Pet architecture", def: "A pre-chosen topology you force every prompt into, instead of deriving the drawing from requirements." },
    { term: "KISS", def: "Keep the design as simple as the requirements allow; avoid hacks and local bloat." },
    { term: "Justification", def: "The one-sentence problem a component exists to solve. No sentence, no box." },
    { term: "Buy vs build", def: "Using a known product when it fits, or arguing honestly for a custom piece when it does not." },
    { term: "Flexibility", def: "Willingness to drop a plan and follow a new requirement or a pointed question." },
    { term: "Clarity of thought", def: "Decisions spoken in order, with reasons, using standard mitigations for standard pains." }
  ],

  tradeoffs: [
    { pro: "Staying high-level invites the interviewer to steer you to the part they care about", con: "Too vague for too long looks like you cannot go deep when they finally ask" },
    { pro: "A simple drawing is easy to change when requirements move", con: "Oversimplifying a stated hard constraint (global consistency, multi-region) looks careless" },
    { pro: "Off-the-shelf pieces shrink implementation risk", con: "Name-dropping a product you cannot describe is worse than a plain custom box with a reason" }
  ],

  interviewTips: [
    "After each new box, pause. If they do not lean in, do not narrate the protocol.",
    "When they point at one component, treat that as the new exam; park the rest of your tour.",
    "If you hear yourself say a product name, add a because-clause in the same breath.",
    "Every few minutes, step back from the hot corner and check the original requirements still fit.",
    "Keep a short buy-versus-build sentence ready for cache, queue, and CDN so tip 5 is not a blank stare.",
    "Score yourself on clarity, knowledge, and flexibility, not on how many boxes you drew."
  ],

  scene: {
    nodes: [
      { id: "cand", label: "Candidate", type: "user", pos: [-11, 0, 2] },
      { id: "intv", label: "Interviewer", type: "user", pos: [-11, 0, -3] },
      { id: "board", label: "Whiteboard", type: "zone", pos: [2, 0, 0], size: [16, 12] },

      { id: "client", label: "Clients", type: "phone", pos: [-4, 0, 0] },
      { id: "gw", label: "Gateway", type: "gateway", pos: [0, 0, 0], showAt: 1 },
      { id: "auth", label: "Auth", type: "service", pos: [5, 0, -4], showAt: 1 },
      { id: "feed", label: "Feed", type: "service", pos: [5, 0, 0], showAt: 1 },
      { id: "notify", label: "Notify", type: "service", pos: [5, 0, 4], showAt: 1 },
      { id: "notePause", label: "Stop here. Wait for a nod.", type: "note", pos: [0, 4.5, -6], showAt: 1 },

      { id: "http", label: "HTTP headers, TLS, retries...", type: "note", pos: [-3, 4, 5], showAt: 2, color: "#f87171" },
      { id: "er", label: "ER diagram (when asked)", type: "db", pos: [9, 0, 0], showAt: 2 },

      { id: "kafka", label: "Kafka (pet pick)", type: "queue", pos: [9, 0, 4], showAt: 3, color: "#f87171" },
      { id: "notePet", label: "Do not force a favorite stack", type: "note", pos: [8, 4.2, 7], showAt: 3 },

      { id: "cache", label: "Cache", type: "cache", pos: [9, 0, -4], showAt: 5 },
      { id: "hack", label: "One-off hack", type: "worker", pos: [1, 0, 5], showAt: 4, color: "#fb923c" },
      { id: "noteKiss", label: "Zoom out. Extract. Simplify.", type: "note", pos: [2, 4.5, 7], showAt: 4 },

      { id: "redis", label: "Redis (known)", type: "cache", pos: [9, 0, 4], showAt: 6, color: "#4ade80" },
      { id: "custom", label: "Custom store?", type: "storage", pos: [9, 0, -4], showAt: 6 },
      { id: "noteBuy", label: "Buy unless you can argue custom", type: "note", pos: [8, 4.5, -7], showAt: 6 },

      { id: "clarity", label: "Clarity", type: "point", pos: [-5, 0, -6], showAt: 7, color: "#4ade80" },
      { id: "knowledge", label: "Knowledge", type: "point", pos: [-1, 0, -6], showAt: 7, color: "#60a5fa" },
      { id: "flex", label: "Flexibility", type: "point", pos: [3, 0, -6], showAt: 7, color: "#c084fc" },
      { id: "noteScore", label: "They score these three axes", type: "note", pos: [-1, 3.8, -8], showAt: 7 }
    ],
    edges: [
      { from: "cand", to: "client", dashed: true },
      { from: "intv", to: "gw", dashed: true, showAt: 1 },
      { from: "client", to: "gw", showAt: 1 },
      { from: "gw", to: "auth", showAt: 1 },
      { from: "gw", to: "feed", showAt: 1 },
      { from: "gw", to: "notify", showAt: 1 },
      { from: "client", to: "http", showAt: 2, dashed: true },
      { from: "feed", to: "er", showAt: 2 },
      { from: "notify", to: "kafka", showAt: 3, dashed: true },
      { from: "feed", to: "hack", showAt: 4, dashed: true },
      { from: "feed", to: "cache", showAt: 5 },
      { from: "feed", to: "redis", showAt: 6 },
      { from: "feed", to: "custom", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Open on the prompt, not on the wiring",
        text: "Candidate and interviewer share a blank board. Restate the product in a sentence. Do not start in a corner. The first picture should be clients and a few capabilities, nothing lower.",
        highlight: ["cand", "intv", "client", "board"],
        hide: ["gw", "auth", "feed", "notify", "notePause", "http", "er", "kafka", "notePet", "cache", "hack", "noteKiss", "redis", "custom", "noteBuy", "clarity", "knowledge", "flex", "noteScore"],
        flows: [
          { from: "cand", to: "client", color: "#4ade80", label: "restate" }
        ]
      },
      {
        title: "Tip 1: Gateway, then pause",
        text: "Clients talk to services through a gateway. That is a reasonable first cut. Stop. Wait a beat. If they want more, they will ask. Filling HTTP next is usually premature.",
        highlight: ["gw", "auth", "feed", "notify", "notePause", "intv"],
        hide: ["http", "er", "kafka", "notePet", "cache", "hack", "noteKiss", "redis", "custom", "noteBuy", "clarity", "knowledge", "flex", "noteScore"],
        flows: [
          { from: "client", to: "gw", color: "#4ade80", label: "req" },
          { from: "gw", to: "feed", color: "#4ade80", label: "route" }
        ]
      },
      {
        title: "Premature detail vs asked-for depth",
        text: "Narrating TLS and retry matrices unprompted is the trap: they may not stop you, and you will backtrack. If they want data modeling they will pull you toward tables. Go deep only on the first thing that actually needs it.",
        highlight: ["er", "intv"],
        fail: ["http"],
        hide: ["kafka", "notePet", "cache", "hack", "noteKiss", "redis", "custom", "noteBuy", "clarity", "knowledge", "flex", "noteScore", "notePause"],
        flows: [
          { from: "client", to: "http", color: "#f87171", label: "too soon" },
          { from: "intv", to: "gw", color: "#60a5fa", label: "ask ER" },
          { from: "feed", to: "er", color: "#4ade80", label: "now" }
        ]
      },
      {
        title: "Tip 2: Drop the pet architecture",
        text: "Kafka appeared because it is the candidate's comfort stack, not because the prompt needed a log. A frozen architecture will not survive a requirement change. If they point at notifications, design notifications; do not retrofit the old drawing.",
        highlight: ["intv", "notify", "notePet"],
        fail: ["kafka"],
        hide: ["http", "er", "cache", "hack", "noteKiss", "redis", "custom", "noteBuy", "clarity", "knowledge", "flex", "noteScore", "notePause"],
        flows: [
          { from: "intv", to: "gw", color: "#fb923c", label: "new constraint" },
          { from: "notify", to: "kafka", color: "#f87171", label: "forced" }
        ]
      },
      {
        title: "Tip 3: KISS, then zoom out",
        text: "A one-off hack on the feed makes that corner fat. Step back. Extract the repeated idea, delete the special case, look at the whole wall. Simple beats clever when the next question lands.",
        highlight: ["feed", "noteKiss", "gw"],
        fail: ["hack"],
        hide: ["http", "er", "kafka", "notePet", "cache", "redis", "custom", "noteBuy", "clarity", "knowledge", "flex", "noteScore", "notePause"],
        flows: [
          { from: "feed", to: "hack", color: "#fb923c", label: "bloat" }
        ]
      },
      {
        title: "Tip 4: Justify the cache",
        text: "Adding a cache is allowed only with a reason: the feed is read-heavy, the database is the source of truth, stale data for N seconds is acceptable. A box without that sentence is a buzzword. Standard pain, standard lever, then your twist.",
        highlight: ["cache", "feed", "cand"],
        hide: ["http", "er", "kafka", "notePet", "hack", "noteKiss", "redis", "custom", "noteBuy", "clarity", "knowledge", "flex", "noteScore", "notePause"],
        flows: [
          { from: "feed", to: "cache", color: "#4ade80", label: "because reads" }
        ]
      },
      {
        title: "Tip 5: Buy Redis, or argue custom",
        text: "Name the product and what it gives you, or argue a custom store with pros and cons. Off-the-shelf shrinks the build. Custom needs a missing feature, a cost model, or a constraint a vendor cannot meet. Practices (balancing, decoupling) fill the rest.",
        highlight: ["redis", "custom", "noteBuy", "feed"],
        hide: ["http", "er", "kafka", "notePet", "hack", "noteKiss", "cache", "clarity", "knowledge", "flex", "noteScore", "notePause"],
        flows: [
          { from: "feed", to: "redis", color: "#4ade80", label: "known cache" },
          { from: "feed", to: "custom", color: "#fb923c", label: "only if needed" }
        ]
      },
      {
        title: "Three scores running in the background",
        text: "Clarity of thought, knowledge of current tools and practices, flexibility when the prompt moves. The five tips are how you perform on those axes. Keep them in your pocket for the whole hour.",
        highlight: ["clarity", "knowledge", "flex", "noteScore", "intv", "cand"],
        hide: ["http", "er", "kafka", "notePet", "hack", "noteKiss", "cache", "redis", "custom", "noteBuy", "notePause"],
        flows: [
          { from: "cand", to: "client", color: "#4ade80", label: "clarity" },
          { from: "intv", to: "gw", color: "#c084fc", label: "steer" }
        ]
      }
    ]
  }
});
