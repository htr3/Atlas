window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 14,
  title: "What is an API and how do you design it?",
  video: "https://www.youtube.com/watch?v=_YlYuNMTCc8",
  category: "Building Blocks",
  tagline: "A named contract: where it lives, what it takes, what it returns, what can fail.",
  summary: "An API is the documented way outsiders call your code — not a tour of how it works. The lecture designs WhatsApp-style GetAdmins: put it on the group service, name it after the action, keep parameters and the body lean, and publish only expected errors. HTTP routing, GET vs POST, hidden side effects in SetAdmins, pagination vs fragmentation, and cache-versus-consistency close the checklist.",

  theory: [
    {
      heading: "A contract, not an implementation",
      body: "If you sell a sorting library, buyers need a documented way to call it. That document is the API: how to interact, not how the sort works. Same idea at service scale. WhatsApp exposing “admins of this group” is a function: <code>GetAdmins(groupId: string) → Admin[]</code>. Errors worth declaring: group does not exist, group already deleted (whether “deleted” is an error is a product call). Each admin may be a nested object (name, user id, …). Return type, parameters, name, and errors — that is the whole contract.",
      bullets: [
        "Outsiders learn what it does, never how.",
        "Treat it like a public function with a stable signature.",
        "Admin as JSON is fine; stuffing extra aggregates is not."
      ]
    },
    {
      heading: "Where, what, and what you pass",
      body: "In a microservice layout, GetAdmins belongs on the <b>group service</b> — that is the where. The name says the what. The parameter is group id, nothing else. If the function is named getAdmins it must return admins, not “admins plus every group they belong to.” If the caller already has a user list and only wants to verify it, that is a different action (<code>CheckAdmins</code>) with different parameters. Extra arguments are allowed when they <b>cut expensive downstream I/O</b> (auth hops, extra microservice calls) and the endpoint is on fire — even then, prefer renaming rather than silently widening the old method.",
      bullets: [
        "Name = action. Parameters = what that action needs.",
        "Do not take a list “just in case” the caller has one.",
        "Optimization params are a last resort under real load."
      ]
    },
    {
      heading: "Lean responses and honest errors",
      body: "Padding the response with unused fields “for future extensibility” wastes bandwidth and confuses callers. You cannot predict the future payload. On errors, both extremes are ugly: a 40-way enum, or one generic failure for everything. Let the type system reject a non-integer id; do not invent “groupId too long” if that is really a database constraint the caller caused. Do declare <b>expected</b> failures your service owns — group missing (404) and group deleted. Design toward common expectations and actual responsibility, not toward documenting every crash.",
      bullets: [
        "Return what the name promised, not a kitchen sink.",
        "Typed inputs catch many “errors” for free.",
        "Expected domain failures get named status/codes; surprises can stay generic."
      ]
    },
    {
      heading: "HTTP is routing plus a verb",
      body: "On the wire you answer where again: host, resource path, function, optional version (<code>/v1</code> so <code>/v2</code> can ship later). A POST with body <code>{ groupId: 123 }</code> works, but a GET with the id in the path or query is shorter and has no payload. Do not dump a bare group id onto <code>/chat</code> and make the server guess whether you wanted the group, the admins, or the members — and do not smuggle <code>action: getAdmins</code> in the JSON; that is routing hiding in the body. If HTTP already gives you GET, the path can be <code>/admins?groupId=123</code> instead of <code>/getAdmins</code>. Verb in the method, noun in the URL.",
      bullets: [
        "Version in the path when the contract will change.",
        "GET for reads when the id fits in the URL.",
        "Never mix “which function” into the payload."
      ]
    },
    {
      heading: "SetAdmins and hidden side effects",
      body: "<code>SetAdmins(groupId, admins)</code> should fail if those users are not members — unless you silently add them, or silently create the missing group. Those extras are <b>side effects</b>: one call doing three jobs, often steered by a config blob of flags. That is hard to test and impossible for callers to reason about. Atomicity is the only serious argument for bundling (“create group and set admins must not interleave with someone else”). Even then, name the combined action honestly, or split: SetAdmins returns 404, the client calls <code>CreateGroup(members, admins)</code>, and <i>that</i> endpoint is atomic. Poor names have no excuse.",
      bullets: [
        "One API, one job — flags that change behavior are a smell.",
        "Need atomicity? Name a dedicated combined operation.",
        "Client-driven 404 → createGroup keeps SetAdmins pure."
      ]
    },
    {
      heading: "Huge payloads, freshness, and load",
      body: "Two hundred members with fat profiles blow the response. <b>Pagination</b> gives the client a page (first 10, then an offset or cursor). Statelessness holds if the client sends the offset and the server does not remember the session. <b>Fragmentation</b> is the internal analog: when service-to-service messages have a size cap (1–10 KB), split the body into numbered chunks and an end packet — like TCP sequence numbers. Separately, GetAdmins may race with a new admin insert and return two of three; decide if you care. A cache of admins or of comments is stale by seconds — often fine. Under database load, shrink the payload (name only, skip avatars): that is <b>service degradation</b>, still answering instead of melting.",
      bullets: [
        "Pagination: client walks pages. Fragmentation: servers split oversized frames.",
        "Ask “do I need a consistent snapshot?” before paying for it.",
        "Cache and degrade when the store is the bottleneck, not as a default surprise."
      ]
    }
  ],

  keyTerms: [
    { term: "API", def: "Documented contract for calling code or a service: name, inputs, outputs, errors — not internals." },
    { term: "Idempotent naming", def: "The function name matches the action and the returned resource, nothing more." },
    { term: "Side effect", def: "Extra work (create group, add members) hidden behind a narrower name like SetAdmins." },
    { term: "Pagination", def: "Client asks for a slice (offset/limit or cursor) of a large collection." },
    { term: "Fragmentation", def: "Server-to-server split of an oversized payload into sequenced chunks plus an end marker." },
    { term: "API versioning", def: "v1 vs v2 in the route so the contract can evolve without breaking old callers." },
    { term: "Service degradation", def: "Under load, return a thinner but still useful payload instead of failing entirely." },
    { term: "Expected error", def: "A failure the API owns and documents (unknown group), as opposed to a generic crash." }
  ],

  tradeoffs: [
    { pro: "A tight GetAdmins(groupId) is easy to learn, cache, and test.", con: "Callers with extra context may make more round-trips unless you later add a dedicated richer endpoint." },
    { pro: "Extra parameters can skip downstream microservice I/O on a hot path.", con: "The old name starts lying; widen only under proven load and prefer a new name." },
    { pro: "Bundling create-group + set-admins can be atomic.", con: "Hidden side effects make the contract unreadable; split or rename the combined action." },
    { pro: "Cache and smaller payloads keep the database alive.", con: "Callers may see two admins when a third was just added — freshness is a product choice." }
  ],

  interviewTips: [
    "Start with where the API lives, then name, params, return, errors — in that order. It is the lecture’s checklist.",
    "Refuse kitchen-sink responses and “action” fields in JSON; put the verb in HTTP and the noun in the path.",
    "For SetAdmins, walk a side-effect scenario (user not a member, group missing) and show the split CreateGroup design.",
    "Mention pagination for public HTTP and fragmentation for internal size caps so you cover both layers.",
    "Close with consistency: race with a write, cache TTL, and degrade-to-name-only under load."
  ],

  scene: {
    nodes: [
      { id: "zone", label: "Chat / groups", type: "zone", pos: [0, 0, 0], size: [16, 12] },
      { id: "dev", label: "Caller app", type: "user", pos: [-11, 0, 0] },
      { id: "gw", label: "HTTP gateway", type: "gateway", pos: [-6, 0, 0] },
      { id: "group", label: "Group service", type: "service", pos: [0, 0, 0] },
      { id: "db", label: "Groups DB", type: "db", pos: [5.5, 0, 0] },
      { id: "cache", label: "Admin cache", type: "cache", pos: [5.5, 0, -4], showAt: 8 },
      { id: "create", label: "CreateGroup", type: "service", pos: [0, 0, -4], showAt: 5 },
      { id: "members", label: "Member service", type: "service", pos: [0, 0, 4], showAt: 2 },
      { id: "note_sig", label: "GetAdmins(groupId) → Admin[]", type: "note", pos: [0, 3, 0] },
      { id: "note_http", label: "GET /v1/admins?id=123", type: "note", pos: [-6, 3, 0], showAt: 3 },
      { id: "note_side", label: "No hidden create/add", type: "note", pos: [0, 3, -4], showAt: 5 },
      { id: "note_page", label: "offset=0 limit=10 of 200", type: "note", pos: [9.5, 3, 4], showAt: 6 },
      { id: "m1", label: "M1-10", type: "point", pos: [8, 0, 2], showAt: 6 },
      { id: "m2", label: "M11-20", type: "point", pos: [11, 0, 2], showAt: 6 },
      { id: "m3", label: "M21-30", type: "point", pos: [8, 0, 4.5], showAt: 6 },
      { id: "m4", label: "M31-40", type: "point", pos: [11, 0, 4.5], showAt: 6 },
      { id: "m5", label: "…", type: "point", pos: [8, 0, 7], showAt: 6 },
      { id: "m6", label: "M191-200", type: "point", pos: [11, 0, 7], showAt: 6 },
      { id: "pkt1", label: "frag 10", type: "point", pos: [-6, 0, 4], showAt: 7 },
      { id: "pkt2", label: "frag 11", type: "point", pos: [-6, 0, 6], showAt: 7 },
      { id: "pkt3", label: "end", type: "point", pos: [-3, 0, 6], showAt: 7 }
    ],
    edges: [
      { from: "dev", to: "gw", label: "HTTP" },
      { from: "gw", to: "group", label: "route" },
      { from: "group", to: "db", label: "query" },
      { from: "group", to: "members", label: "IO (avoid)", showAt: 2, dashed: true },
      { from: "dev", to: "create", label: "404 then create", showAt: 5 },
      { from: "create", to: "db", label: "atomic write", showAt: 5 },
      { from: "group", to: "m1", label: "page 1", showAt: 6 },
      { from: "gw", to: "pkt1", label: "chunk", showAt: 7 },
      { from: "pkt1", to: "pkt2", label: "seq", showAt: 7 },
      { from: "pkt2", to: "pkt3", label: "end", showAt: 7 },
      { from: "group", to: "cache", label: "set", showAt: 8 },
      { from: "cache", to: "gw", label: "stale hit", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "API as a public function",
        text: "A sorting library, or WhatsApp GetAdmins: outsiders get a name, a groupId string, a list of Admin objects, and two expected failures (missing group, deleted group). They do not get a guided tour of the database.",
        highlight: ["dev", "gw", "group", "note_sig"],
        flows: [{ from: "dev", to: "gw", color: "#4ade80", label: "GetAdmins" }]
      },
      {
        title: "It lives on the group service",
        text: "Where = group service. What = get admins. Input = group id. If you return extra groups those users belong to, the name is already wrong. Keep the contract as small as the action.",
        highlight: ["group", "db", "note_sig"],
        flows: [
          { from: "gw", to: "group", color: "#4ade80", label: "route" },
          { from: "group", to: "db", color: "#60a5fa", label: "admins" }
        ]
      },
      {
        title: "Don’t widen params or the body",
        text: "A caller who already has user ids wants CheckAdmins, not a secret extra list on GetAdmins. Extra fields are forgivable only to skip four more microservice hops when this API is drowning. Stuffing the response “for later” wastes bytes and confuses everyone.",
        highlight: ["group", "members", "dev"],
        flows: [
          { from: "group", to: "members", color: "#f87171", label: "extra IO" },
          { from: "group", to: "dev", color: "#60a5fa", label: "too much JSON" }
        ]
      },
      {
        title: "HTTP: verb + versioned noun",
        text: "Host / resource / v1. POST {groupId:123} works; GET /v1/admins?id=123 is enough. Do not post a naked id to /chat and hope, and do not put action=getAdmins in the body. HTTP already has GET — the path can just say admins.",
        highlight: ["gw", "group", "note_http"],
        flows: [
          { from: "dev", to: "gw", color: "#4ade80", label: "GET" },
          { from: "gw", to: "group", color: "#4ade80", label: "/admins" }
        ]
      },
      {
        title: "Errors you actually own",
        text: "A non-integer id is a type error, not your enum. A giant string that blows a column is the caller’s bug. Group missing and group deleted are expected — return them clearly (404), not a faceless 500 and not a 40-entry error catalog.",
        highlight: ["group", "db", "dev"],
        flows: [
          { from: "dev", to: "gw", color: "#4ade80", label: "bad id" },
          { from: "group", to: "dev", color: "#f87171", label: "404 deleted" }
        ]
      },
      {
        title: "SetAdmins must not create the world",
        text: "If the user is not a member, error — do not silently add them. If the group is missing, 404 — do not silently create it. Those are side effects. Need atomic create+admins? Client calls a dedicated CreateGroup(members, admins) after the 404. Name the combined action; never hide it.",
        highlight: ["group", "create", "db", "note_side"],
        flows: [
          { from: "dev", to: "gw", color: "#f87171", label: "setAdmins" },
          { from: "dev", to: "create", color: "#4ade80", label: "createGroup" },
          { from: "create", to: "db", color: "#c084fc", label: "atomic" }
        ]
      },
      {
        title: "Pagination for 200 fat members",
        text: "Full profiles for 200 people are too big. Let the client ask for ten at a time with an offset (or cursor). The server stays effectively stateless if the offset travels on each request. Page until the collection is done.",
        highlight: ["group", "m1", "m2", "m3", "m4", "m5", "m6", "note_page"],
        flows: [
          { from: "group", to: "m1", color: "#60a5fa", label: "page 0" },
          { from: "group", to: "m2", color: "#60a5fa", label: "page 1" }
        ]
      },
      {
        title: "Fragment the internal pipe",
        text: "Service-to-service frames may cap at a few KB. Split the leftover into sequenced chunks (10, 11, 12, …) and an end packet so the peer knows more is coming. Pagination is for clients; fragmentation is for internal bulk.",
        highlight: ["gw", "pkt1", "pkt2", "pkt3", "group"],
        flows: [
          { from: "gw", to: "pkt1", color: "#fb923c", label: "10" },
          { from: "pkt1", to: "pkt2", color: "#fb923c", label: "11" },
          { from: "pkt2", to: "pkt3", color: "#fb923c", label: "end" }
        ]
      },
      {
        title: "Freshness vs staying up",
        text: "GetAdmins can race a concurrent add and miss the new admin — decide if a snapshot matters. A cache of admins (or of comments) is seconds stale and often fine. When the DB is drowning, return names without avatars: degrade, but still respond.",
        highlight: ["db", "cache", "group", "gw"],
        flows: [
          { from: "group", to: "cache", color: "#c084fc", label: "fill" },
          { from: "cache", to: "gw", color: "#60a5fa", label: "stale" },
          { from: "db", to: "group", color: "#4ade80", label: "names only" }
        ]
      }
    ]
  }
});
