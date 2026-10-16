window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 8,
  title: "Low-Level System Design of Amazon Inventory Lockers",
  video: "https://www.youtube.com/watch?v=Ku6xVU2lM38",
  category: "Low-Level Design",
  tagline: "Place and pick warehouse items with size, distance, and pluggable strategies.",
  summary: "Arun Goel and Gaurav Sen design Amazon-style inventory lockers as an extension of warehouse inventory. They compress a long requirements dump into use cases, split Product from Item, wire a System that maps lockers and instances, and use Strategy so add and remove can optimize for size, walking distance, expiry, or load.",

  theory: [
    {
      heading: "The warehouse problem",
      body: "A huge locker farm stores packages the way a shop stores SKUs, but each object lives in a physical cell. Lockers come in <b>small, medium, and large</b>. A small package may sit in a medium or large cell when smaller ones are gone; you still prefer the tightest fit unless walking distance or convenience says otherwise. A delivery agent scans a QR on the package, the system knows the product, opens the right door, and later the same system finds a product so a picker can empty that cell. Populate, empty, and get look like CRUD until you add an algorithm and constraints.",
      bullets: [
        "Perishables (think BigBasket) want soon-to-expire stock in front, long-dated stock in back.",
        "Fast sellers should sit near the origin so pickers walk less.",
        "A conveyor-belt sort is a nice physical picture; whether you can build one is a later question."
      ]
    },
    {
      heading: "Use cases before classes",
      body: "The lecture's habit is requirements → use-case diagram → class diagram → code, and they treat UML as language-agnostic. Actors that matter here are the <b>System</b>, the <b>Locker</b>, and the <b>Product</b> — not a richly specified user. The agent mostly brings a package; the system scans, lists products, chooses a locker (distance today, expiry or popularity tomorrow), and reports where a pick lives. A locker adds and removes. Storage size is an enum-shaped state on the locker. Compressing a page of English into that diagram is the interview skill.",
      bullets: [
        "Find product returns the locker you walk to, then you remove.",
        "Choose-locker is the add path: appropriate size plus distance (and later other scores).",
        "QR scan and product listing are assumed to exist before your code runs."
      ]
    },
    {
      heading: "Product versus item",
      body: "Surf Excel is a <b>product</b> (blueprint: id, size, description). Ten packets on the shelf are <b>items</b> (instances), each with its own id and exactly one locker. Listing a product can leave the instance list empty; two cartons of milk are two items under one product. If every barcode were unique and you only stored id → object, \"give me five milk cartons\" would mean scanning descriptions. Keep a product catalog (id → Product), a map of product → list of items, and a locker map (id → Locker). Counts of free small/medium/large cells (or a map of free lockers by type) tell you when to upsize.",
      bullets: [
        "An item references a Product object, not a copy of every field — composition, not inheritance.",
        "A product is not defined by the items it currently holds; putting the instance list on Product creates a cycle.",
        "Each locker holds at most one item; empty means the item field is null."
      ]
    },
    {
      heading: "System, locker, and distance",
      body: "System stores lockers, products, free counts, and product instances. It <code>findLocker(item)</code> / place, <code>onboardProduct</code>, <code>addItem</code>, and <code>removeItem</code>. Distance is stored on the locker as a number from a depot at (0,0): Euclidean or Manhattan, whatever measures picker walk. You do not recompute coordinates on every place. Add item sets both sides of a 1-1 mapping (locker.setItem, item.setLocker) and appends the instance list; remove is the inverse. Interviewers rarely want constructors and getters written out — they argue about arguments and return types on the class diagram.",
      bullets: [
        "Find locker returns the Locker where this item should live.",
        "Get-for-product returns a locker (or lockers) to empty, not the product blueprint.",
        "Machine-learning placement is a stub unless the prompt specifies the score."
      ]
    },
    {
      heading: "Strategy for place and pick",
      body: "Add and remove each kick off a <i>series</i> of operations (wire item ↔ locker, update instance lists, decrement free counts). The part that should vary is <b>which empty locker</b> (or which item to pick). That is Strategy: an interface the system holds, plug-in classes that receive the item and the locker map and return the best cell. The common wiring stays in <code>addItem</code>; <code>findBestLocker</code> stays private to the strategy. One strategy might minimize distance and respect size; another might read expiry; another might send pickers down different aisles when the warehouse is busy so robots do not jam a short lane.",
      bullets: [
        "Single Responsibility: System orchestrates; a strategy only scores lockers.",
        "Remove is also a strategy: closest vs farthest vs soonest expiry.",
        "Light load can walk farther; a spike wants the nearest open door."
      ]
    },
    {
      heading: "What the round actually grades",
      body: "Most LLD time is spent debating the class diagram, not filling hash maps. Everyone can insert; the interesting questions are why an item is not a product, why strategy is not a random <code>doOperation</code> that duplicates wiring, and whether you need CQRS (you do not, unless populate and query truly diverge). Optional color: cooling lockers, sell-fast categories, even ant-colony style routing for multi-stop picks — mention them, then ship the simpler model first. Open-source reading (Caffeine was the cache example) is for after the interview.",
      bullets: [
        "Language-agnostic companies care about problem solving; syntax is searchable.",
        "Ask which non-functional actually matters; latency is not always king.",
        "Pass product id or name on get as the prompt specifies; id is the safe default."
      ]
    }
  ],

  keyTerms: [
    { term: "Locker sizes", def: "Small, medium, large cells; a smaller package may occupy a larger cell when tight bins are gone." },
    { term: "Product", def: "SKU blueprint (id, size, description) that can exist with zero items on the floor." },
    { term: "Item", def: "One physical instance of a product, always bound to exactly one locker while stored." },
    { term: "System", def: "Orchestrator holding locker, product, free-count, and instance maps plus place/get APIs." },
    { term: "Distance", def: "Walk from depot to locker, stored as a scalar (Euclidean or Manhattan)." },
    { term: "Use-case diagram", def: "Actors and actions compressed from the requirements dump before any class boxes." },
    { term: "Strategy pattern", def: "Swappable policy that picks the best locker (or item) given size, distance, expiry, or load." },
    { term: "Onboard product", def: "Register a new SKU in the catalog without requiring an instance yet." },
    { term: "1-1 mapping", def: "Locker points at its item and the item points back; empty locker stores null." }
  ],

  tradeoffs: [
    { pro: "Tightest-fit locker saves large cells for large goods.", con: "A far small bin can cost more walking than a nearby large one." },
    { pro: "Product/item split supports \"ten Surf Excel packets\" and empty listings.", con: "Extra maps and a 1-1 locker link to keep consistent on add and remove." },
    { pro: "Storing distance on the locker avoids recomputing geometry.", con: "You cannot later ask \"from picker B\" without extra fields." },
    { pro: "Strategy makes distance, expiry, and congestion policies plug-in.", con: "A vague doOperation that still wires item and locker duplicates System work." },
    { pro: "Interviewers grade signatures and the class diagram.", con: "Writing every setter wastes the round; they already tested algorithms elsewhere." }
  ],

  interviewTips: [
    "Draw use cases first: System (scan, choose, find), Locker (add/remove), Product (listed SKU).",
    "Say Product is a category and Item is an instance — Surf Excel vs packet — and refuse inheritance.",
    "Store distance on the locker; name Euclidean vs Manhattan as the walk metric.",
    "Put Strategy on find-best-locker, not on the shared item↔locker wiring.",
    "Mention expiry-front and hot-SKU-front as future scores, then implement size plus distance.",
    "Spend the round on APIs and relationships; do not implement HashMap.put unless asked."
  ],

  scene: {
    nodes: [
      { id: "wh", label: "Warehouse", type: "zone", pos: [3, 0, 0], size: [14, 12] },

      { id: "agent", label: "Delivery agent", type: "user", pos: [-10, 0, 0] },
      { id: "sys", label: "System", type: "service", pos: [-5, 0, 0] },
      { id: "catalog", label: "Product catalog", type: "db", pos: [-5, 0, -5] },
      { id: "inst", label: "Item instances", type: "db", pos: [-5, 0, 5] },

      { id: "ls", label: "Small locker", type: "storage", pos: [1, 0, -4] },
      { id: "lm", label: "Medium locker", type: "storage", pos: [4, 0, 0] },
      { id: "ll", label: "Large locker", type: "storage", pos: [7, 0, 4] },

      { id: "item", label: "Milk carton", type: "point", pos: [1, 0, 4], showAt: 3 },
      { id: "prod", label: "Product: milk", type: "cache", pos: [-8, 0, -5], showAt: 2 },
      { id: "strat", label: "Place strategy", type: "worker", pos: [10, 0, -4], showAt: 6 },
      { id: "rstrat", label: "Pick strategy", type: "worker", pos: [10, 0, 4], showAt: 7 },

      { id: "n0", label: "QR then place/get", type: "note", pos: [-10, 0, 5] },
      { id: "n1", label: "S fits S,M,L", type: "note", pos: [4, 0, -7], showAt: 1 },
      { id: "n2", label: "SKU vs instance", type: "note", pos: [-10, 0, -7], showAt: 2 },
      { id: "n3", label: "1-1 item locker", type: "note", pos: [10, 0, 0], showAt: 4 },
      { id: "n4", label: "walk from (0,0)", type: "note", pos: [7, 0, -7], showAt: 5 },
      { id: "n5", label: "plug-in scoring", type: "note", pos: [10, 0, 7], showAt: 6 }
    ],
    edges: [
      { from: "agent", to: "sys", label: "scan QR" },
      { from: "sys", to: "catalog" },
      { from: "sys", to: "inst" },
      { from: "sys", to: "ls", label: "open", showAt: 1 },
      { from: "sys", to: "lm", showAt: 1 },
      { from: "sys", to: "ll", showAt: 1 },
      { from: "prod", to: "catalog", showAt: 2 },
      { from: "item", to: "ls", label: "occupies", showAt: 4 },
      { from: "item", to: "prod", label: "of type", showAt: 3, dashed: true },
      { from: "sys", to: "strat", label: "find best", showAt: 6 },
      { from: "strat", to: "ls", showAt: 6, dashed: true },
      { from: "sys", to: "rstrat", label: "which item", showAt: 7 },
      { from: "rstrat", to: "lm", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Scan, then CRUD with rules",
        text: "The agent arrives with a package. After QR scan and product listing (out of scope for your code), the system must add, remove, and get — but size, distance, and later expiry sit on top of that CRUD.",
        highlight: ["agent", "sys", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "agent", to: "sys", color: "#4ade80", label: "scan" }
        ]
      },
      {
        title: "Small, medium, large",
        text: "Three locker sizes exist. A small good can occupy any size; you still try small first unless the walk is absurd. Free-count maps tell you when to spill into the next size.",
        highlight: ["ls", "lm", "ll", "wh", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "sys", to: "ls", color: "#4ade80", label: "prefer S" },
          { from: "sys", to: "lm", color: "#fb923c", label: "spill" }
        ]
      },
      {
        title: "Use cases, then Product",
        text: "Actors: System, Locker, Product. Surf Excel is a listed product; it may have zero packets today. Onboard writes the catalog even when the instance list is empty.",
        highlight: ["sys", "catalog", "prod", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5"],
        flows: [
          { from: "sys", to: "catalog", color: "#4ade80", label: "onboard" },
          { from: "prod", to: "catalog", color: "#60a5fa", label: "SKU" }
        ]
      },
      {
        title: "Item is an instance",
        text: "A milk carton is an item: own id, reference to Product, one locker. Composition, not inheritance — tomorrow the product grows description, temperature, spillable flags that must not be copied onto every carton.",
        highlight: ["item", "prod", "inst", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5"],
        flows: [
          { from: "item", to: "prod", color: "#c084fc", label: "type" },
          { from: "sys", to: "inst", color: "#4ade80", label: "append" }
        ]
      },
      {
        title: "Wire item and locker both ways",
        text: "Add sets locker.item and item.locker. Empty is null. Remove clears both and drops the instance. That 1-1 mapping is how \"get two cartons\" walks from product list to doors.",
        highlight: ["item", "ls", "sys", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "sys", to: "ls", color: "#4ade80", label: "setItem" },
          { from: "item", to: "ls", color: "#c084fc", label: "setLocker" }
        ]
      },
      {
        title: "Distance from the depot",
        text: "Each locker stores a walk cost from (0,0) — Cartesian or Manhattan. Place uses it so pickers do not hike to a far small bin when a large one is next to the dock.",
        highlight: ["ls", "lm", "ll", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5"],
        flows: [
          { from: "agent", to: "ls", color: "#60a5fa", label: "near" },
          { from: "agent", to: "ll", color: "#f87171", label: "far" }
        ]
      },
      {
        title: "Place is a strategy",
        text: "findBestLocker lives in a Strategy the system calls. Distance-plus-size is the basic plug-in; expiry or profit can replace it without rewriting addItem's wiring.",
        highlight: ["strat", "sys", "ls", "lm", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "sys", to: "strat", color: "#fb923c", label: "score" },
          { from: "strat", to: "ls", color: "#4ade80", label: "best empty" }
        ]
      },
      {
        title: "Pick is a strategy too",
        text: "Closest, farthest, or soonest-expiry item can be different remove policies. Quiet hours walk farther; a burst sends people down staggered aisles so the short lane does not jam.",
        highlight: ["rstrat", "sys", "lm", "ll"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "sys", to: "rstrat", color: "#fb923c", label: "which" },
          { from: "rstrat", to: "lm", color: "#60a5fa", label: "nearest" }
        ]
      },
      {
        title: "Grade the diagram, not put()",
        text: "The round is an argument about types: why item is not product, why strategy is not CQRS, why findLocker returns a Locker. Implement maps only if they ask you to code.",
        highlight: ["sys", "catalog", "inst", "ls", "strat"],
        hide: ["n0", "n1", "n4"],
        flows: [
          { from: "agent", to: "sys", color: "#4ade80", label: "add" },
          { from: "sys", to: "strat", color: "#fb923c", label: "place" },
          { from: "sys", to: "ls", color: "#60a5fa", label: "open" }
        ]
      }
    ]
  }
});
