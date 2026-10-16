window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 19,
  title: "How to avoid cascading failures in a distributed system",
  video: "https://www.youtube.com/watch?v=xrizarXJgC8",
  category: "Advanced Concepts",
  tagline: "A dead server that sheds its load onto tired peers can take the whole fleet down.",
  summary: "Four boxes share request ids 1–400. When S1 dies, the balancer pours 1–100 onto S2–S4. If S4 was already at its 100-request budget, it dies, then S3, then S2 — a cascade, a race to bring capacity before the next timeout. The grown-up fix is a per-server admit queue: at 301 requests on a 300 rps box, refuse and tell the client. Temporary versus permanent errors stop retry storms. Around that core: pre-scale Black Friday, auto-scale when you can afford it, rate-limit virality, chunk the New Year email, jitter PewDiePie notifications, approximate view counts, cache, roll out 10 boxes at a time, and do not cache bank passwords for an hour.",

  theory: [
    {
      heading: "A stampede is a herd, not a single bull",
      body: "The lecture's picture is a bison herd — the <b>thundering herd</b> — charging the server side. Four machines split request ids <code>1–400</code>, about a hundred each. That split is load balancing. It is also a loaded spring: if one machine vanishes, those hundred ids do not vanish with it."
    },
    {
      heading: "S1 dies, and the implicit capacity lie",
      body: "S1 crashes. A smart balancer hands <code>1–100</code> to the survivors — extra slices onto S2, S3, S4. Users still get answers <i>if and only if</i> each survivor had spare compute. S4 was already surviving on a budget of 100. The extra slice drives timeouts; S4 dies. Now two corpses, bigger slices, S3 at roughly double its original range, then S2 holding something like <b>four times</b> the original load. The last box falls and the product is gone. That chain is a <b>cascading failure</b>.",
      bullets: [
        "Redistributing work assumes leftover capacity that often does not exist.",
        "Each death increases the load on whoever is still standing.",
        "You are in a race: add a healthy server before S4's queue of timeouts becomes a crash."
      ]
    },
    {
      heading: "A blunt workaround, then a real admit queue",
      body: "If the survivors cannot take <code>1–100</code>, dropping that range is ugly and better than serving nobody — some users up beats all users down. The actual design is a <b>queue in front of each server</b> with a stated capacity. The talk's numbers: S1 100 rps, S2 200, S3 400, S4 300 (one unit of compute = one request per second). S4's queue may grow to 300. Request 301 is refused. The server stays up. The client hears a failure and can wait. Serving the people you can, on purpose, is the whole policy."
    },
    {
      heading: "Teach the client not to become the herd",
      body: "A refused request that immediately retries is how users finish the stampede you just prevented. Distinguish <b>permanent</b> errors (the request is logically wrong — do not retry) from <b>temporary</b> ones (overload, a slow database — retry later, with backoff). Rate limiting is this idea at the door: a maximum admitted rps until new boxes exist. The queue buys time for scale-out; it is not infinite buffer."
    },
    {
      heading: "Black Friday, virality, and two kinds of scale",
      body: "A known spike (sales Friday, +50% people) is a chance to <b>pre-scale</b>: four boxes become six before the doors open. If the number is fuzzy, <b>auto-scale</b> on a cloud — and do not quote the video when the bill arrives; extra traffic often pays for extra boxes, but not always. Going viral is not on the calendar, so pre-scale cannot save you. Fall back to the admit queue and refuse the overflow until capacity exists."
    },
    {
      heading: "Jobs that become herds: New Year mail and PewDiePie",
      body: "A cron that emails a million users at 00:00 on 1 January is a self-inflicted stampede. <b>Batch</b>: first thousand in minute one, next thousand in minute two — a thousand minutes, a load each box can eat. Recipients of a canned greeting do not need millisecond delivery. A popular upload is the same math: naive fanout to every follower is the email bug again. Chunk the notifications, and add <b>jitter</b> so a million clients do not open the watch page on the same tick."
    },
    {
      heading: "Approximate the metadata; cache the rest; roll out slowly",
      body: "The video bytes are the product. View counts, likes, and comments are not. After hour one shows 1000 views you can display 1500 in hour two from a trend line even if the true number is 1700. Users want a feel, not a ledger, and you skip a storm of counter queries. Same family of tricks: <b>cache</b> identical responses; <b>gradual deploys</b> (10 of 100 boxes, watch, then 10 more — except when a breaking change forces a flag day). The controversial last tool is <b>coupling</b>: remember that a username/token worked in the last hour and skip the auth service. Faster, and a stolen password on a bank would skate through. Cache a profile photo for an hour. Do not cache the credential that spends money. Star that decision."
    }
  ],

  keyTerms: [
    { term: "Thundering herd", def: "A burst of concurrent clients (or jobs) that overwhelms servers the way a stampede overwhelms a fence." },
    { term: "Cascading failure", def: "One instance's death raises load on peers until they die in a chain and the fleet is gone." },
    { term: "Admit queue", def: "A per-server buffer up to declared rps; the next request is refused so the box stays alive." },
    { term: "Temporary vs permanent", def: "Retry-later (overload, slow DB) versus do-not-retry (bad request). Clients must honor the difference." },
    { term: "Pre-scale / auto-scale", def: "Add boxes before a known event, or let the cloud add them when load rises — virality still needs a limiter." },
    { term: "Batch + jitter", def: "Chunk a million emails or notifications across time, and smear client retries so they do not align." },
    { term: "Approximate stats", def: "Show a cheap estimate of views/likes instead of querying the exact counter on every popular play." },
    { term: "Gradual deploy", def: "Ship 10 of 100 instances, observe, continue — unless a breaking change forbids mixed versions." }
  ],

  tradeoffs: [
    { pro: "Rebalancing 1–100 after S1 dies hides the outage from users.", con: "If S4 had no spare compute, the hide becomes a cascade." },
    { pro: "Dropping range 1–100 keeps S2–S4 alive.", con: "A slice of people get nothing — still better than a dark site." },
    { pro: "A 300-deep admit queue plus 429 keeps S4 in the race for a new box.", con: "The 301st caller is unhappy; stupid clients that retry immediately rebuild the herd." },
    { pro: "Pre-scale + auto-scale absorb Black Friday if you guessed the extra 50%.", con: "Viral load has no calendar; limiters still have to refuse." },
    { pro: "Approximate views and skip-auth caches raise admitted rps.", con: "A wrong like-count is fine; a cached bank password is not. Mark that with a star." }
  ],

  interviewTips: [
    "Draw the cascade: S1 dies, S4 overloads, S3 doubles, S2 takes ~4×, site dark — then put an admit queue on each box.",
    "Give capacities in rps (100 / 200 / 400 / 300) and say request 301 is a failure, not a longer wait.",
    "Name temporary versus permanent errors so the client does not retry-storm.",
    "For a known sale, pre-scale; for unknown virality, rate-limit; mention auto-scale without treating it as free.",
    "Chunk New Year mail (1000/minute) and jitter fanout for a PewDiePie-class post.",
    "Approximate non-core counters, roll out 10 boxes at a time, and refuse to cache credentials next to a profile photo."
  ],

  scene: {
    nodes: [
      { id: "herd", label: "Users 1-400", type: "user", pos: [-11.5, 0, -4.5] },
      { id: "lb", label: "Load balancer", type: "lb", pos: [0, 0, -4.5] },
      { id: "s1", label: "S1 100 rps", type: "server", pos: [-9, 0, 1] },
      { id: "s2", label: "S2 200 rps", type: "server", pos: [-3, 0, 1] },
      { id: "s3", label: "S3 400 rps", type: "server", pos: [3, 0, 1] },
      { id: "s4", label: "S4 300 rps", type: "server", pos: [9, 0, 1] },
      { id: "q1", label: "Admit q 100", type: "queue", pos: [-9, 0, 4.5], showAt: 3 },
      { id: "q2", label: "Admit q 200", type: "queue", pos: [-3, 0, 4.5], showAt: 3 },
      { id: "q3", label: "Admit q 400", type: "queue", pos: [3, 0, 4.5], showAt: 3 },
      { id: "q4", label: "Admit q 300", type: "queue", pos: [9, 0, 4.5], showAt: 3 },
      { id: "s5", label: "Extra S5", type: "server", pos: [-9, 0, -2], showAt: 5 },
      { id: "s6", label: "Extra S6", type: "server", pos: [-3, 0, -2], showAt: 5 },
      { id: "mail", label: "New Year cron", type: "worker", pos: [-11.5, 0, 4.5], showAt: 6 },
      { id: "yt", label: "Watch page", type: "cdn", pos: [11.5, 0, -2], showAt: 7 },
      { id: "pew", label: "PewDiePie", type: "user", pos: [11.5, 0, -7.5], showAt: 7 },
      { id: "cache", label: "Resp. cache", type: "cache", pos: [11.5, 0, 4.5], showAt: 8 },

      { id: "n0", label: "Thundering herd", type: "note", pos: [-9, 4, 7.5] },
      { id: "n1", label: "S1 death shifts 1-100", type: "note", pos: [0, 4, 7.5], showAt: 1 },
      { id: "n2", label: "Cascade to dark site", type: "note", pos: [9, 4, 7.5], showAt: 2 },
      { id: "n3", label: "301st request: no", type: "note", pos: [-9, 4, -7.5], showAt: 3 },
      { id: "n4", label: "Temp vs permanent", type: "note", pos: [0, 4, -7.5], showAt: 4 },
      { id: "n5", label: "Approx views OK", type: "note", pos: [9, 4, -7.5], showAt: 7 }
    ],
    edges: [
      { from: "herd", to: "lb", label: "1-400" },
      { from: "lb", to: "s1", label: "1-100" },
      { from: "lb", to: "s2", label: "101-200" },
      { from: "lb", to: "s3", label: "201-300" },
      { from: "lb", to: "s4", label: "301-400" },
      { from: "s1", to: "q1", showAt: 3 },
      { from: "s2", to: "q2", showAt: 3 },
      { from: "s3", to: "q3", showAt: 3 },
      { from: "s4", to: "q4", showAt: 3 },
      { from: "lb", to: "s5", showAt: 5 },
      { from: "lb", to: "s6", showAt: 5 },
      { from: "mail", to: "s2", label: "chunks", showAt: 6 },
      { from: "pew", to: "yt", showAt: 7 },
      { from: "yt", to: "cache", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "Four boxes, ids 1–400",
        text: "A bison stampede is the user-side picture: too many requests, all at once. Four servers are load-balanced across 1–400, about a hundred ids each. That split only holds while every box stays up.",
        highlight: ["herd", "lb", "s1", "s2", "s3", "s4", "n0"],
        flows: [
          { from: "herd", to: "lb", color: "#4ade80", label: "1-400" },
          { from: "lb", to: "s1", color: "#60a5fa", label: "1-100" },
          { from: "lb", to: "s4", color: "#60a5fa", label: "301-400" }
        ]
      },
      {
        title: "S1 dies; the extra slice moves",
        text: "S1 is gone. The balancer pours 1–100 onto S2, S3, and S4. Users still succeed only if those three had leftover compute — the assumption nobody wrote down.",
        highlight: ["s1", "s2", "s3", "s4", "lb", "n1"],
        fail: ["s1"],
        hide: ["n0"],
        flows: [
          { from: "lb", to: "s4", color: "#fb923c", label: "+slice" },
          { from: "lb", to: "s2", color: "#fb923c", label: "+slice" },
          { from: "lb", to: "s3", color: "#fb923c", label: "+slice" }
        ]
      },
      {
        title: "S4, then S3, then S2",
        text: "S4 was already at a 100-request budget. Extra timeouts knock it over. S3 now carries about double; it falls. S2 inherits something like 4× original load and the site goes dark. That chain is the cascade — a race you are already losing.",
        highlight: ["s1", "s4", "s3", "s2", "n2"],
        fail: ["s1", "s4", "s3", "s2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "lb", to: "s4", color: "#f87171", label: "timeouts" },
          { from: "lb", to: "s3", color: "#f87171", label: "200%" },
          { from: "lb", to: "s2", color: "#f87171", label: "~400%" }
        ]
      },
      {
        title: "Admit up to 300; refuse 301",
        text: "Dropping 1–100 keeps someone online, but the real fix is a queue per box. S4 may hold 300 rps. The 301st caller gets a failure, the process stays up, and you have time to launch a healthy instance. Some users served beats none.",
        highlight: ["q4", "s4", "s2", "s3", "n3"],
        fail: ["s1"],
        hide: ["n0", "n2"],
        flows: [
          { from: "lb", to: "s4", color: "#4ade80", label: "≤300" },
          { from: "s4", to: "q4", color: "#4ade80", label: "admit" },
          { from: "herd", to: "lb", color: "#f87171", label: "301 = no" }
        ]
      },
      {
        title: "Temporary, not \"try immediately\"",
        text: "If the client retries in a tight loop, the herd reforms. Permanent errors mean the request is wrong — stop. Temporary errors mean overload or a slow database — wait, then retry. The limiter at the door is the same idea: a max rps until new capacity exists.",
        highlight: ["herd", "lb", "q4", "n4"],
        fail: ["s1"],
        hide: ["n0", "n2"],
        flows: [
          { from: "lb", to: "herd", color: "#f87171", label: "temp 429" },
          { from: "herd", to: "lb", color: "#fb923c", label: "retry later" }
        ]
      },
      {
        title: "Friday you can see; viral you cannot",
        text: "Black Friday at +50% users: start six boxes instead of four. Uncertain numbers: auto-scale, and watch the bill. A viral spike has no calendar, so pre-scale cannot help — the admit queue has to refuse until boxes appear.",
        highlight: ["s5", "s6", "s1", "s2", "s3", "s4", "lb"],
        hide: ["n0", "n2", "n3"],
        flows: [
          { from: "lb", to: "s5", color: "#4ade80", label: "pre-scale" },
          { from: "lb", to: "s6", color: "#4ade80", label: "auto-scale" },
          { from: "herd", to: "lb", color: "#fb923c", label: "viral cap" }
        ]
      },
      {
        title: "A million New Year mails, in chunks",
        text: "Firing one million greetings at 00:00 is a herd you scheduled yourself. First thousand users in minute one, next thousand in minute two — a thousand minutes, a load the fleet can eat. Nobody needed that email in the first second of January.",
        highlight: ["mail", "s2", "s3", "herd"],
        hide: ["n0", "n2", "n4"],
        flows: [
          { from: "mail", to: "s2", color: "#fb923c", label: "1k / min" },
          { from: "s2", to: "herd", color: "#60a5fa", label: "chunk n" }
        ]
      },
      {
        title: "PewDiePie, jitter, fake-enough views",
        text: "Fanout to every follower is the mail bug again — batch it, and jitter so watch pages do not open on one tick. View counts are not the video: show 1500 from a trend when the truth is 1700. You skip a counter storm and nobody is counting by hand.",
        highlight: ["pew", "yt", "s4", "n5"],
        hide: ["n0", "n2", "n3"],
        flows: [
          { from: "pew", to: "yt", color: "#4ade80", label: "upload" },
          { from: "yt", to: "herd", color: "#fb923c", label: "jittered ntfy" },
          { from: "herd", to: "yt", color: "#60a5fa", label: "~1500 views" }
        ]
      },
      {
        title: "Cache, 10-box rollouts, starred coupling",
        text: "Cache identical responses. Deploy 10 of 100, watch, then 10 more — unless a breaking change forces a flag day. Remembering a token for an hour skips auth and raises rps; on a bank it is how a stolen password still spends. Photos can wait. Credentials cannot.",
        highlight: ["cache", "yt", "s1", "s2", "lb"],
        hide: ["n0", "n2", "n4"],
        flows: [
          { from: "yt", to: "cache", color: "#c084fc", label: "hit" },
          { from: "lb", to: "s1", color: "#4ade80", label: "10%" },
          { from: "s2", to: "cache", color: "#f87171", label: "no bank pw" }
        ]
      }
    ]
  }
});
