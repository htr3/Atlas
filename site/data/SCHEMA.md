# Lecture data file schema

Each lecture lives in `site/data/lecture-N.js` (N = 1..26). It is a plain classic script (NOT a module, NO imports/exports) that pushes one object:

```js
window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  id: 3,                                   // lecture number
  title: "What is Load Balancing?",        // clean title, no emojis
  video: "https://www.youtube.com/watch?v=...",
  category: "Fundamentals",                // one of: "Fundamentals", "Building Blocks", "Data & Storage", "Communication", "Case Studies", "Interview Prep"
  tagline: "One-line hook (max ~90 chars)",
  summary: "2-4 sentence overview of what the lecture teaches.",

  // Theory notes - written in YOUR OWN WORDS (do not copy transcript sentences).
  // 4-8 sections. Body may use simple HTML: <b>, <i>, <code>, <br>.
  theory: [
    { heading: "The problem", body: "Paragraph...", bullets: ["optional", "bullet list"] },
  ],

  keyTerms: [ { term: "Hash function", def: "Short definition" } ],     // 4-10 terms
  tradeoffs: [ { pro: "...", con: "..." } ],                            // optional, 0-5 rows
  interviewTips: ["Short actionable tip", "..."],                       // 3-6 tips

  // 3D scene: an animated, step-by-step diagram of the lecture's main idea.
  scene: {
    nodes: [
      // id: unique short string. type: see list below. pos: [x, y, z]
      { id: "c1", label: "Client 1", type: "user", pos: [-8, 0, -3] },
      { id: "lb", label: "Load Balancer", type: "lb", pos: [-3, 0, 0], showAt: 1 },
      { id: "dc", label: "Data Center A", type: "zone", pos: [4, 0, 0], size: [8, 7] },
      { id: "n1", label: "Hash = h(id) % n", type: "note", pos: [0, 3, -5], showAt: 2 }
    ],
    edges: [
      // straight lines between node centers. showAt optional (default 0).
      { from: "c1", to: "lb", label: "HTTP", showAt: 1, dashed: false }
    ],
    steps: [
      // 5-10 steps that walk through the lecture's narrative in order.
      {
        title: "Step title",
        text: "1-3 sentences explaining what is shown at this step.",
        highlight: ["lb"],                 // ids that glow (optional)
        fail: ["s2"],                      // ids shown as crashed/red (optional)
        hide: ["s3"],                      // ids hidden ONLY at this step (optional)
        flows: [                           // animated packets travelling from -> to (optional)
          { from: "c1", to: "lb", color: "#4ade80", label: "req" }
        ]
      }
    ]
  }
});
```

## Rules for the scene

- Node visibility: a node is visible at step i if `i >= (node.showAt || 0)` and it is not in that step's `hide` list. Use `showAt` to build the diagram up progressively as the story unfolds.
- Edge visibility: visible when both endpoints are visible and `i >= (edge.showAt || 0)`.
- Flows don't need an edge; they animate a glowing packet along a straight line (repeating). Both endpoints must be visible at that step.
- Coordinates: ground plane is y = 0. Keep x within [-12, 12] and z within [-8, 8]. Leave at least ~2.5 units between node centers so labels don't overlap. y can be raised (e.g. 2-5) for stacking layers or floating notes.
- Node types (renderer draws a distinct 3D shape for each):
  - `user` (person/client device), `server`, `service` (microservice), `lb` (load balancer / router), `gateway` (API gateway), `db` (database cylinder), `cache`, `queue` (message queue / log), `cdn`, `storage` (blob/S3/file store), `worker` (background worker/consumer), `phone` (mobile device)
  - `zone`: flat translucent platform used to group things (region, data center, shard). Requires `size: [width, depth]`. Put zones at y = 0 and the grouped nodes on top of them.
  - `note`: floating text label only (formulas, numbers, short facts). Keep label short (< 40 chars).
  - `point`: small sphere (data points, hash positions on a ring, users on a map, etc.)
- Optional per node: `color: "#hex"` to override the default color.
- Labels must be short (< 24 chars except notes).
- Use colors for flows: green "#4ade80" for requests/writes, blue "#60a5fa" for responses/reads, orange "#fb923c" for events/messages, red "#f87171" for errors/failures, purple "#c084fc" for replication/sync.
- Be creative: rings of `point`/`server` nodes for consistent hashing, grids of zones for quadtrees, layered pipelines for video processing, etc. The scene should directly mirror the examples and analogies the lecture uses (e.g. the pizza shop analogy).

## Content rules

- Write everything in your own words, as clear study notes. Do NOT copy transcript text; short phrases are fine.
- The theory must be accurate and also fill gaps the speaker glosses over (add the standard textbook explanation where helpful), but center it on what the lecture actually covers, including its specific examples, numbers and analogies.
- Strings use double quotes; escape inner double quotes. Make sure the file is valid JavaScript.
