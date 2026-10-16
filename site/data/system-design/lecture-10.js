window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 10,
  title: "What is a CDN (Content Delivery Network)?",
  video: "https://www.youtube.com/watch?v=b4_6thkYZXs",
  category: "Communication",
  tagline: "Put static files next to the user so one origin in India is not everyone else's lag.",
  summary: "A CDN is a planet-wide cache of static content. Starting from DNS lookup of interviewready.io and a single origin that reads HTML from disk, the lecture shows why one location can never be fair to India, the US, and Japan, how local law needs local copies, and why edges are real servers you can hit. CloudFront sitting on S3 is the worked example: drop a file, an event pushes it out, clients read from the nearest box.",

  theory: [
    {
      heading: "The simple origin",
      body: "A browser asks DNS what <code>www.interviewready.io</code> is, gets an IP, and talks to that machine. The machine is an origin that keeps HTML on its filesystem (or a nearby disk cache) and returns pages. Caching the files in RAM on that box makes the <i>read</i> cheap. It does nothing for the person who is an ocean away.",
      bullets: [
        "DNS first, then TCP/HTTP to an origin IP",
        "Pages are files; serving them is a cache-friendly, repetitive read",
        "A hot origin cache still lives in one geography"
      ]
    },
    {
      heading: "No single pin on the map is fair",
      body: "Park the origin in India and Indian clients are happy; US clients cross continents; Japan is worse. Move it to the middle of the oceans and nobody is delighted. There is no \"average Earth\" location that makes every round trip short. Half a second of extra render time, in Amazon and Google studies the lecture cites, is enough for people to distrust the site. Speed is product quality, not a luxury.",
      bullets: [
        "Physics: light and routing both cost milliseconds per ocean",
        "A central compromise makes every region a little unhappy",
        "Perceived professionalism tracks how fast the first paint lands"
      ]
    },
    {
      heading: "Law and taste are local too",
      body: "Some titles may only be shown in India, others only in the US. That is regulation, not taste. Separately, what is popular in India may be cold in the US, and a cache cannot hold the entire catalog. So you want many small caches, each near a population, each holding the objects that region is allowed to see and likely to ask for.",
      bullets: [
        "Geo rules belong at the edge that serves that country",
        "A PoP is a cache, so it stores a hot subset, not the whole library",
        "Relevance and legality both argue for splitting one global cache into regional chunks"
      ]
    },
    {
      heading: "A PoP is a server, not a magic box",
      body: "You can resolve an edge to an IP, hit an API, and get bytes. Internally it runs a server and a filesystem. The origin (the \"mother\" server) pushes or invalidates objects on those filesystems. The whole mesh is a <b>content delivery network</b>. Building one as a business means cheap boxes, close to users, in many places, with rule engines you do not want to write yourself.",
      bullets: [
        "Edge = cache + HTTP server + disk, reachable like any other host",
        "Origin remains the source that fills and updates the edges",
        "Vendors win on density of locations, compliance, and easy invalidation"
      ]
    },
    {
      heading: "What you actually buy",
      body: "Good CDNs advertise three things: points of presence near clients, help with local rules so you are not hand-writing geo engines, and painless publication. <b>CloudFront</b> is the example used in production at InterviewReady: put an object in <b>S3</b>, an event fires, the CDN refreshes, the engineer does not babysit rsync. GCP and Azure sell the same shape. You decide <i>which static bytes</i> (videos, images, HTML, other files) leave the origin; the network places them close to people.",
      bullets: [
        "Static objects are the CDN's food; personalized HTML still often comes from origin",
        "Publication should be an event, not a ticket",
        "The CDN is a black box you point at: cheap, fast, nearby"
      ]
    }
  ],

  keyTerms: [
    { term: "Origin", def: "The source server (or object store) that owns the canonical files the edges copy from." },
    { term: "PoP / edge", def: "A cache server placed near users. It is a real host with an IP, an API, and a filesystem." },
    { term: "CDN", def: "The network of those edges plus the control plane that fills, invalidates, and geo-routes them." },
    { term: "DNS", def: "The first hop that turns a hostname into an edge or origin IP, often the closest PoP." },
    { term: "Static content", def: "Bytes that do not change per viewer: images, videos, JS, CSS, many HTML shells." },
    { term: "Geo restriction", def: "Rules that allow an object to be served only in some countries, enforced at the local cache." },
    { term: "CloudFront + S3", def: "An origin bucket whose uploads trigger CDN distribution without a custom publish pipeline." }
  ],

  tradeoffs: [
    { pro: "Nearest-edge reads cut ocean latency and make the first paint feel professional", con: "The origin is still needed on a miss, and cold regions wait on a fill" },
    { pro: "Regional caches can obey local law and keep locally popular titles", con: "You now have many copies to invalidate when a file changes" },
    { pro: "A vendor CDN is cheaper than flying your own racks to every city", con: "You trade control for a black box and a bill tied to egress" },
    { pro: "Event-driven publish (S3 -> CloudFront) removes hand-rolled rsync", con: "Dynamic, per-user HTML still should not be treated as a static object" }
  ],

  interviewTips: [
    "Draw DNS -> nearest PoP -> origin on miss. Say the PoP is a cache of static objects, not your application logic.",
    "Use geography: one origin cannot be fast for India, the US, and Japan at once.",
    "Mention local regulations and locally popular catalogs as reasons the cache must be split, not just speed.",
    "Name a real product (CloudFront, Fastly, Cloudflare) and the origin (S3, GCS) so it does not sound like a floating cloud.",
    "Be explicit about what is static (media, assets) versus what still hits your API."
  ],

  scene: {
    nodes: [
      { id: "inUser", label: "User in India", type: "user", pos: [-10, 0, 4] },
      { id: "usUser", label: "User in US", type: "user", pos: [-10, 0, 0] },
      { id: "jpUser", label: "User in Japan", type: "user", pos: [-10, 0, -4] },
      { id: "dns", label: "DNS", type: "lb", pos: [-6, 0, 0] },

      { id: "origin", label: "Origin (India)", type: "server", pos: [2, 0, 4] },
      { id: "disk", label: "HTML on disk", type: "storage", pos: [6, 0, 4] },
      { id: "originCache", label: "Origin RAM cache", type: "cache", pos: [2, 0, 7], showAt: 1 },
      { id: "noteOne", label: "One pin cannot please Earth", type: "note", pos: [2, 4.5, 0], showAt: 2 },

      { id: "inPop", label: "PoP India", type: "cdn", pos: [2, 0, 4], showAt: 4, color: "#4ade80" },
      { id: "usPop", label: "PoP US", type: "cdn", pos: [2, 0, 0], showAt: 4, color: "#60a5fa" },
      { id: "jpPop", label: "PoP Japan", type: "cdn", pos: [2, 0, -4], showAt: 4, color: "#fb923c" },
      { id: "s3", label: "S3 origin", type: "storage", pos: [8, 0, 0], showAt: 4 },
      { id: "noteLaw", label: "IN-only vs US-only titles", type: "note", pos: [6, 4.2, 6], showAt: 3 },
      { id: "movieIN", label: "IN catalog", type: "point", pos: [5, 0, 5.5], showAt: 3, color: "#4ade80" },
      { id: "movieUS", label: "US catalog", type: "point", pos: [5, 0, -0.5], showAt: 3, color: "#60a5fa" },

      { id: "cf", label: "CloudFront", type: "cdn", pos: [5, 0, -6], showAt: 7 },
      { id: "noteEvent", label: "Upload to S3, event fills CDN", type: "note", pos: [6, 4.5, -8], showAt: 7 },
      { id: "noteSpeed", label: "Amazon/Google: 0.5s costs trust", type: "note", pos: [-4, 4.5, 6], showAt: 5 }
    ],
    edges: [
      { from: "inUser", to: "dns", label: "resolve" },
      { from: "usUser", to: "dns" },
      { from: "jpUser", to: "dns" },
      { from: "dns", to: "origin", label: "one IP" },
      { from: "origin", to: "disk" },
      { from: "origin", to: "originCache", showAt: 1 },
      { from: "dns", to: "inPop", showAt: 4 },
      { from: "dns", to: "usPop", showAt: 4 },
      { from: "dns", to: "jpPop", showAt: 4 },
      { from: "inPop", to: "s3", showAt: 4, dashed: true },
      { from: "usPop", to: "s3", showAt: 4, dashed: true },
      { from: "jpPop", to: "s3", showAt: 4, dashed: true },
      { from: "s3", to: "cf", showAt: 7 }
    ],
    steps: [
      {
        title: "DNS, then a single origin",
        text: "Users look up interviewready.io, get one IP, and fetch HTML from a machine that reads pages off its filesystem. That is the whole product, geographically speaking: one pin.",
        highlight: ["dns", "origin", "disk", "inUser"],
        hide: ["originCache", "noteOne", "inPop", "usPop", "jpPop", "s3", "noteLaw", "movieIN", "movieUS", "cf", "noteEvent", "noteSpeed"],
        flows: [
          { from: "inUser", to: "dns", color: "#60a5fa", label: "DNS" },
          { from: "dns", to: "origin", color: "#4ade80", label: "IP" },
          { from: "origin", to: "disk", color: "#60a5fa", label: "HTML" }
        ]
      },
      {
        title: "Cache the files on the origin",
        text: "Keep hot pages in RAM so disk is not on the path. Indians still get a snappy origin. The read is cheap. The ocean is not.",
        highlight: ["origin", "originCache", "inUser"],
        hide: ["noteOne", "inPop", "usPop", "jpPop", "s3", "noteLaw", "movieIN", "movieUS", "cf", "noteEvent", "noteSpeed"],
        flows: [
          { from: "inUser", to: "dns", color: "#4ade80", label: "hit" },
          { from: "origin", to: "originCache", color: "#60a5fa", label: "RAM" }
        ]
      },
      {
        title: "US and Japan still swim the ocean",
        text: "There is no single place on Earth that is close to India, the United States, and Japan. Park it in India and Americans wait. Park it in the middle and all three grumble. Latency is baked into the map.",
        highlight: ["usUser", "jpUser", "origin", "noteOne"],
        hide: ["inPop", "usPop", "jpPop", "s3", "noteLaw", "movieIN", "movieUS", "cf", "noteEvent", "noteSpeed", "originCache"],
        flows: [
          { from: "usUser", to: "dns", color: "#f87171", label: "far" },
          { from: "jpUser", to: "dns", color: "#f87171", label: "far" },
          { from: "dns", to: "origin", color: "#f87171", label: "cross-ocean" }
        ]
      },
      {
        title: "Rules and catalogs differ by country",
        text: "A title legal in India may be blocked in the US. A hit in India may be unused in Japan. One global cache cannot hold everything and cannot show everything. You need local chunks.",
        highlight: ["noteLaw", "movieIN", "movieUS", "origin"],
        hide: ["inPop", "usPop", "jpPop", "s3", "cf", "noteEvent", "noteSpeed", "originCache", "noteOne"],
        flows: []
      },
      {
        title: "Break the cache into nearby PoPs",
        text: "Smaller caches stand next to each population. Americans hit a US box, not a server in Japan. Each PoP is a real server with an IP and a filesystem the origin can fill. That mesh is the CDN. Misses still fall through to the origin store.",
        highlight: ["inPop", "usPop", "jpPop", "s3", "dns"],
        hide: ["origin", "disk", "originCache", "noteOne", "noteLaw", "movieIN", "movieUS", "cf", "noteEvent", "noteSpeed"],
        flows: [
          { from: "inUser", to: "dns", color: "#4ade80", label: "IN" },
          { from: "dns", to: "inPop", color: "#4ade80", label: "nearby" },
          { from: "usUser", to: "dns", color: "#60a5fa", label: "US" },
          { from: "dns", to: "usPop", color: "#60a5fa", label: "nearby" },
          { from: "jpUser", to: "dns", color: "#fb923c", label: "JP" },
          { from: "dns", to: "jpPop", color: "#fb923c", label: "nearby" }
        ]
      },
      {
        title: "Half a second is a business event",
        text: "Amazon and Google measured it: delay the page by about 0.5 s and people trust the site less. A CDN is how a business buys that first paint without standing a data center in every country.",
        highlight: ["noteSpeed", "usPop", "usUser"],
        hide: ["origin", "disk", "originCache", "noteOne", "noteLaw", "movieIN", "movieUS", "cf", "noteEvent", "s3", "inPop", "jpPop"],
        flows: [
          { from: "usUser", to: "dns", color: "#4ade80", label: "fast" },
          { from: "dns", to: "usPop", color: "#4ade80", label: "local" }
        ]
      },
      {
        title: "Edges hold only what is hot and allowed",
        text: "India's PoP keeps India-legal, India-popular objects. The US PoP keeps a different subset. The origin catalog behind them can be huge; the edge must stay small.",
        highlight: ["inPop", "usPop", "movieIN", "movieUS", "noteLaw"],
        hide: ["origin", "disk", "originCache", "noteOne", "cf", "noteEvent", "noteSpeed", "jpPop"],
        flows: [
          { from: "inPop", to: "s3", color: "#fb923c", label: "miss fill" }
        ]
      },
      {
        title: "CloudFront on S3: publish is an event",
        text: "Drop a file in S3. An event updates CloudFront. You do not manage rsync to Japan. Static bytes (video, images, files) are the payload. That black box, close to every client, is the CDN.",
        highlight: ["s3", "cf", "noteEvent", "jpPop", "usPop", "inPop"],
        hide: ["origin", "disk", "originCache", "noteOne", "noteLaw", "movieIN", "movieUS", "noteSpeed"],
        flows: [
          { from: "s3", to: "cf", color: "#c084fc", label: "event" },
          { from: "cf", to: "jpPop", color: "#c084fc", label: "push" }
        ]
      }
    ]
  }
});
