window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 27,
  title: "Strangler Fig and Bounded Context",
  category: "Service Patterns",
  tagline: "Peel one capability out behind a stable door — and do not let two teams share one definition of Order.",
  summary: "A strangler fig replacement puts a facade in front of the old system and moves one behavior at a time until the old path is gone. A bounded context is why you chose that seam: inside one context, \"order\" means one thing and one team owns the model. The facade keeps callers stable. The context boundary keeps you from extracting a service that is really half of someone else's noun.",

  theory: [
    {
      heading: "Do not rewrite the company in a branch",
      body: "A big-bang rewrite runs the old system and a new one until a weekend cutover. Most of those weekends roll back. The <b>strangler fig</b> grows around the trunk: callers talk to a facade, the facade sends some calls to the legacy app and some to a new service, and you expand the new share until the legacy path is unused. Then you delete it. The plant metaphor is literal — the new system surrounds the old one and the old one is removed only after the new one holds the weight.",
      bullets: [
        "The facade is the stable URL or module callers already use.",
        "Pick a thin vertical slice (search, invoices, one report), not \"the user object.\"",
        "Both paths can run while you compare answers. Parity is how you earn the cutover."
      ]
    },
    {
      heading: "The facade is a router, then a remnant",
      body: "At first the facade is almost a pass-through to the monolith. After you extract invoicing, invoice reads and writes go to the new service and everything else stays. Callers do not change. Feature flags or routing rules decide the split, so you can send one percent, then everyone, then nobody to the old invoice code. When the old code has no traffic, deleting it is a cleanup, not a launch.",
      bullets: [
        "Dual-write or compare-and-log while you distrust the new path.",
        "Data moves with the behavior. An invoice service with no invoice rows is a costume.",
        "Keep the slice reversible until the parity checks are boring."
      ]
    },
    {
      heading: "A bounded context is the seam",
      body: "Inside sales, an order is a commercial agreement: price, customer, terms. Inside the warehouse, the same word is a pick list: bins, quantities, ship-by. Forcing one <code>Order</code> class, one database table, and one service for both teams is how extractions stall. A <b>bounded context</b> draws a line: one model, one language, one owner. Between contexts you translate (an \"order placed\" event becomes a \"shipment requested\"). You do not import their entity.",
      bullets: [
        "Same word, different model — that is the signal to split.",
        "Shared-kernel tables (\"everyone writes the users table\") recreate the monolith.",
        "The context is often the team boundary you already have, if you look."
      ]
    },
    {
      heading: "What fails if you ignore either idea",
      body: "Strangling without a context boundary extracts a service whose every change needs the other team's fields, so you ship a distributed monolith. A perfect context map with a big-bang rewrite still bets the company on a cutover. Use the context to choose the slice. Use the strangler to move it. The earlier monolith lecture said to peel analytics first; this is that move, named, plus the rule for where the peel is allowed to happen."
    }
  ],

  keyTerms: [
    { term: "Strangler fig", def: "Incrementally replace a system by routing one behavior at a time to new code behind a stable facade." },
    { term: "Facade", def: "The entry callers already use. It hides whether the answer came from legacy code or the new service." },
    { term: "Bounded context", def: "A boundary inside which a model and its language have one meaning and one owner." },
    { term: "Translation", def: "At the boundary, one context's event or API is mapped into the other context's model. Entities are not shared." },
    { term: "Parity check", def: "Running old and new paths and comparing results before you trust the new one with all traffic." }
  ],

  tradeoffs: [
    { pro: "Callers stay on the old URL while behavior moves.", con: "The facade and the dual path are extra code you must delete later, or they become permanent clutter." },
    { pro: "A thin slice can roll back by routing.", con: "Parity checks and dual writes cost time before the new service earns its keep." },
    { pro: "A bounded context gives you a seam that can move independently.", con: "Two models of \"order\" means translation, and translation can drift." },
    { pro: "You avoid a weekend cutover.", con: "A strangler that never finishes leaves two systems forever. Name the delete date." }
  ],

  interviewTips: [
    "Reject \"we will rewrite it in six months and switch.\" Describe the facade and one slice.",
    "Move data with the behavior. Say what table leaves the monolith.",
    "Use a bounded context to pick the slice: if two teams mean different things by the noun, do not share the entity.",
    "Mention a parity period and a routing flag so the cutover is a percentage, not a night.",
    "End with deletion: the legacy path has to go, or you are paying for two systems on purpose."
  ],

  scene: {
    nodes: [
      { id: "client", label: "Caller", type: "phone", pos: [-10, 0, 0] },
      { id: "facade", label: "Facade", type: "gateway", pos: [-5, 0, 0] },
      { id: "legacy", label: "Monolith", type: "server", pos: [0.5, 0, -3] },
      { id: "invoice", label: "Invoices", type: "service", pos: [0.5, 0, 3], showAt: 2 },
      { id: "idb", label: "Invoice rows", type: "db", pos: [5.5, 0, 3], showAt: 2 },
      { id: "wh", label: "Warehouse", type: "service", pos: [5.5, 0, -3], showAt: 4 },
      { id: "n0", label: "Route one slice", type: "note", pos: [-2, 0, -7] },
      { id: "n1", label: "Do not share Order", type: "note", pos: [6, 0, -7], showAt: 4 }
    ],
    edges: [
      { from: "client", to: "facade" },
      { from: "facade", to: "legacy", label: "rest" },
      { from: "facade", to: "invoice", label: "invoices", showAt: 2 },
      { from: "invoice", to: "idb", showAt: 2 },
      { from: "invoice", to: "wh", label: "event", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Callers hit a facade",
        text: "Nothing has been rewritten. The facade forwards to the monolith. You now have a place to peel without changing clients.",
        highlight: ["client", "facade", "legacy", "n0"],
        flows: [
          { from: "client", to: "facade", color: "#4ade80", label: "same URL" },
          { from: "facade", to: "legacy", color: "#60a5fa", label: "all" }
        ]
      },
      {
        title: "Leave the rest alone",
        text: "Catalog, login, and profiles still live in the monolith. You did not stand up a new copy of the company.",
        highlight: ["facade", "legacy"],
        flows: [{ from: "facade", to: "legacy", color: "#60a5fa", label: "rest" }]
      },
      {
        title: "Invoices move, rows included",
        text: "The new invoice service owns invoice behavior and invoice data. The facade sends only that slice across. A flag can send a trickle, then everyone.",
        highlight: ["facade", "invoice", "idb"],
        flows: [
          { from: "facade", to: "invoice", color: "#4ade80", label: "slice" },
          { from: "invoice", to: "idb", color: "#c084fc", label: "own rows" }
        ]
      },
      {
        title: "Compare, then delete",
        text: "While both implementations exist, compare results. When the monolith's invoice code has no traffic, delete it. The strangler is finished for this slice only.",
        highlight: ["legacy", "invoice", "facade"],
        flows: [{ from: "facade", to: "invoice", color: "#4ade80", label: "100%" }]
      },
      {
        title: "The warehouse does not import Order",
        text: "Sales and the warehouse both say \"order\" and mean different models. Invoices publish an event. The warehouse translates it into a shipment. They do not share a table.",
        highlight: ["invoice", "wh", "n1"],
        flows: [{ from: "invoice", to: "wh", color: "#fb923c", label: "translate" }]
      }
    ]
  }
});
