window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 4,
  title: "Low-Level System Design of an Inventory Management System like Amazon or Zepto",
  video: "https://www.youtube.com/watch?v=T-9s9U28KJM",
  category: "Low-Level Design",
  tagline: "Track units on shelves — onboard, place, pick, and report — not coupons or billing.",
  summary: "Arun and Gaurav design warehouse inventory the way Amazon or a Kirana shop actually cares: product types, countable units, S/M/L shelves from weight and size, a status enum, and end-of-day reports. Three flows — truck in, customer order out, nightly analytics — drive User, System, Product, Unit, Shelf, Order, and a sequential lock so two orders cannot grab the last keyboard.",

  theory: [
    {
      heading: "Inventory is state, not checkout",
      body: "An inventory system tracks whether a product is purchased, where it sits, how many you have, and whether you must reorder. Amazon robots, Zepto dark stores, BigBasket, a mall storeroom — same job. Discounts, sales, and bill printing are <b>out of scope</b>. The walk-in shop story is simple (scan barcode, subtract one); the warehouse story adds location, packing, and purchase orders.",
      bullets: [
        "Onboard a product type (metadata: price, weight, size/dimensions).",
        "Add and remove units when a truck arrives or a customer buys.",
        "Place onto S / M / L shelves from size (small fits anywhere; large only on L).",
        "Unit status: in inventory, packed, in transit, ready for delivery.",
        "End-of-day reports: what sold, what is finished, what to reorder (ten keyboards gone → buy ten)."
      ]
    },
    {
      heading: "Actors, then the class diagram",
      body: "The same recipe as the MakeMyTrip session: requirements → use-case diagram → class diagram → code. Two actors. A <b>User</b> (shopkeeper, warehouse manager, or admin — they collapse permissions for the interview) onboards types and updates counts/prices. The <b>System</b> owns location, status, and reports. Skip registration. Beginners in the chat are told: DSA, then OOP, then a parking-lot LLD, then this.",
      bullets: [
        "User.addProduct(details), User.updateCount(productId, delta).",
        "System.generateReports, manage location, updateStatus.",
        "Patterns they name as homework, not as a shopping list: Singleton, pub/sub, Decorator, State."
      ]
    },
    {
      heading: "Product, Unit, Shelf, Order",
      body: "A <code>Product</code> is a type: id, price, description, weight, size. A <code>Unit</code> is one physical instance: its own id, a product reference, a location, a status enum (<code>INVENTORY</code> / <code>TRANSIT</code> / <code>DELIVERY</code>). A <code>Shelf</code> (they also say Location) has an id and a size class. One unit occupies one slot; over time a slot can hold different units. Do not store unit lists on Product if System already indexes them. An <code>Order</code> is a map of product → count (\"3 milk, 2 chocolates, 1 keyboard\"). A <code>Report</code> is dated metadata; a reporting service consumes events.",
      bullets: [
        "Onboarding adds a type (a new biscuit SKU), not 200 bags.",
        "A truck of 200 bags calls placeUnit 200 times.",
        "placeUnit runs an algorithm: first free shelf of adequate size.",
        "When status leaves inventory, the shelf slot must not be reused until it is actually empty."
      ]
    },
    {
      heading: "Three flows the interviewer asked for",
      body: "<b>Inbound:</b> user adds the product type, then System.placeUnit until the truck is empty. <b>Purchase:</b> an order arrives; System checks units whose status is still INVENTORY; if the count is enough, it fulfills, decrements, and later a robot-pick event sets TRANSIT/DELIVERY and clears the location. <b>Nightly:</b> each add/sold event is pushed on a queue; a reporter drains it into \"sold 13 of 15 keyboards, reorder 13.\" Interviewers care that you <i>can</i> produce a daily report, not that you build a full alerting product.",
      bullets: [
        "Fulfillment filters by status = INVENTORY, not by every unit ever created.",
        "Robot pickup is an event, not a silent field write inside addProduct.",
        "Expiry is noted and deferred."
      ]
    },
    {
      heading: "Concurrency: sequential orders or locks",
      body: "Two parallel orders can both see \"one keyboard left.\" Gaurav's preference in this round: <b>process orders sequentially</b> so the second sees the updated count. Amazon would multithread; then you lock the product (or each unit) you touch. A location still referenced by a TRANSIT unit must not be handed to the next inbound truck — an easy edge. They also mention State as a pattern people reach for once units have several statuses, without implementing it live.",
      bullets: [
        "Sequential queue of orders: simplest correctness story.",
        "Per-object locks: more throughput, deadlock risk if you lock many SKUs.",
        "Do not free a shelf while a unit is still in transit on that id."
      ]
    },
    {
      heading: "What not to swallow",
      body: "Billing, coupons, and \"which database\" are HLD or other services. Ask if you may use Lucidchart or an IDE. Different user levels (worker vs admin) exist in real warehouses; this interview keeps one User. Reports can be email; the requirement is generation, not the inbox.",
      bullets: [
        "Shop barcode minus-one is the same updateCount path as a robot pick.",
        "Weight/volume exist so placement is not a random array index."
      ]
    }
  ],

  keyTerms: [
    { term: "Product", def: "SKU/type with id, price, weight, and size — not a single bag on a shelf." },
    { term: "Unit", def: "One physical instance of a product, with status and a shelf location." },
    { term: "Shelf / location", def: "S, M, or L slot; one unit at a time, reusable after the unit leaves." },
    { term: "Status enum", def: "INVENTORY (sellable), TRANSIT (picked/packing), DELIVERY (ready to leave)." },
    { term: "placeUnit", def: "System algorithm that assigns the first adequate free shelf." },
    { term: "Order", def: "Map of product → count the warehouse must try to fulfill." },
    { term: "Sequential orders", def: "One fulfillment at a time so two buyers cannot take the last unit." },
    { term: "Event queue", def: "Add/sold events drained at end of day into a Report object." }
  ],

  tradeoffs: [
    { pro: "Product vs Unit split: metadata changes without walking every bottle.", con: "More types; a tiny shop might have survived on count-per-SKU." },
    { pro: "S/M/L shelves: placement is explainable in an interview.", con: "Real warehouses use exact cm and weight tiers, not three buckets." },
    { pro: "Sequential orders: no lost updates, easy to code.", con: "Amazon-scale picking wants multithreaded locks and will wait less." },
    { pro: "Events on a queue for reports: inventory path stays thin.", con: "You still need someone to define sold-out vs low-stock alerts." },
    { pro: "Keep billing out: inventory LLD stays about location and count.", con: "A full Zepto app would still need those services next door." }
  ],

  interviewTips: [
    "Start with six requirements; explicitly drop discounts and invoices.",
    "Draw User vs System before Product/Unit/Shelf so actors do not blur.",
    "Walk the three flows: truck, order, nightly report — interviewers asked for all three.",
    "Say how placeUnit picks S/M/L and why a TRANSIT location is still occupied.",
    "Offer sequential orders first; mention per-product locks if they push on throughput.",
    "Ask to use a diagram tool; then code from the class diagram, not from memory."
  ],

  scene: {
    nodes: [
      { id: "user", label: "User / admin", type: "user", pos: [-10.5, 0, 0] },
      { id: "sys", label: "System", type: "service", pos: [-7, 0, 0] },
      { id: "product", label: "Product", type: "storage", pos: [-3.5, 0, 3] },
      { id: "unit", label: "Unit", type: "worker", pos: [-3.5, 0, 0] },
      { id: "shelf", label: "Shelf S/M/L", type: "db", pos: [-3.5, 0, -3] },
      { id: "order", label: "Order", type: "queue", pos: [0, 0, 3], showAt: 4 },
      { id: "robot", label: "Robot pick", type: "worker", pos: [0, 0, 0], showAt: 5 },
      { id: "events", label: "Event queue", type: "queue", pos: [0, 0, -3], showAt: 6 },
      { id: "report", label: "Report", type: "note", pos: [3.5, 0, -3], showAt: 6 },
      { id: "truck", label: "Inbound truck", type: "storage", pos: [-10.5, 0, 3], showAt: 3 },
      { id: "cust", label: "Buyer", type: "user", pos: [-10.5, 0, -3], showAt: 4 },
      { id: "note0", label: "No billing here", type: "note", pos: [3.5, 0, 6] },
      { id: "note1", label: "Type vs instance", type: "note", pos: [3.5, 0, 3], showAt: 2 },
      { id: "note2", label: "placeUnit × 200", type: "note", pos: [7, 0, 3], showAt: 3 },
      { id: "note3", label: "Sequential orders", type: "note", pos: [3.5, 0, 0], showAt: 5 },
      { id: "note4", label: "EOD from events", type: "note", pos: [7, 0, -3], showAt: 6 }
    ],
    edges: [
      { from: "user", to: "sys", label: "onboard" },
      { from: "sys", to: "product", label: "types" },
      { from: "sys", to: "unit", label: "place" },
      { from: "unit", to: "shelf", label: "location" },
      { from: "unit", to: "product", label: "SKU" },
      { from: "truck", to: "user", showAt: 3 },
      { from: "cust", to: "order", showAt: 4 },
      { from: "order", to: "sys", label: "fulfill", showAt: 4 },
      { from: "sys", to: "robot", showAt: 5 },
      { from: "robot", to: "unit", label: "TRANSIT", showAt: 5 },
      { from: "sys", to: "events", showAt: 6 },
      { from: "events", to: "report", showAt: 6 }
    ],
    steps: [
      {
        title: "Inventory, not the cash register",
        text: "Track count, shelf, and whether a unit is still sellable. Amazon, Zepto, or a corner shop: same LLD. Coupons and invoices stay out. User onboards; System places and reports.",
        highlight: ["user", "sys", "note0"]
      },
      {
        title: "Product type vs Unit",
        text: "Product is metadata (price, weight, size). Unit is one bottle with a status enum and a shelf. Shelf is S, M, or L. Small goods may sit on any size; large goods only on L.",
        highlight: ["product", "unit", "shelf", "note1"],
        flows: [
          { from: "sys", to: "product", color: "#60a5fa", label: "get type" },
          { from: "unit", to: "shelf", color: "#4ade80", label: "slot" }
        ]
      },
      {
        title: "Truck in: onboard, then place",
        text: "A new biscuit SKU is addProduct once. Two hundred bags call placeUnit two hundred times. The algorithm grabs the first free shelf that fits. Warehouse fills.",
        highlight: ["truck", "user", "sys", "unit", "shelf", "note2"],
        flows: [
          { from: "truck", to: "user", color: "#4ade80", label: "200 bags" },
          { from: "user", to: "sys", color: "#4ade80", label: "placeUnit" },
          { from: "sys", to: "unit", color: "#4ade80", label: "INVENTORY" }
        ]
      },
      {
        title: "Order is a count map",
        text: "A buyer wants three milk and one keyboard. Order is product→count. System asks which units are still INVENTORY and whether the counts cover the map. If not, the order fails.",
        highlight: ["cust", "order", "sys", "product"],
        flows: [
          { from: "cust", to: "order", color: "#fb923c", label: "1 keyboard" },
          { from: "order", to: "sys", color: "#fb923c", label: "can fulfill?" }
        ]
      },
      {
        title: "Sequential fulfill, then pick",
        text: "Two orders racing the last keyboard would both see stock. This round processes orders one at a time (or locks the SKU). After success, a robot-pick event sets TRANSIT and clears the shelf pointer so inbound cannot reuse a still-busy slot.",
        highlight: ["sys", "robot", "unit", "shelf", "note3"],
        flows: [
          { from: "sys", to: "robot", color: "#fb923c", label: "pick" },
          { from: "robot", to: "unit", color: "#f87171", label: "TRANSIT" }
        ]
      },
      {
        title: "Nightly report from events",
        text: "Every add and sale is an event on a queue. End of day the reporter writes: 13 of 15 keyboards sold, reorder 13. The interviewer wants evidence you can generate a report, not a full BI product.",
        highlight: ["events", "report", "sys", "note4"],
        flows: [
          { from: "sys", to: "events", color: "#c084fc", label: "sold" },
          { from: "events", to: "report", color: "#c084fc", label: "EOD" }
        ]
      },
      {
        title: "Admin zeroing a SKU",
        text: "Rare path: admin sets count to zero. Those shelves become empty on purpose. That is not the robot path; it is an explicit remove, and location must follow.",
        highlight: ["user", "sys", "shelf", "product"],
        flows: [
          { from: "user", to: "sys", color: "#f87171", label: "count=0" }
        ]
      },
      {
        title: "Lock or serialize — say both",
        text: "Sequential orders are the default story. If they want Amazon throughput, lock each product you touch. State pattern can wrap INVENTORY→TRANSIT→DELIVERY later. Billing still lives elsewhere.",
        highlight: ["sys", "order", "unit", "note3"],
        flows: [
          { from: "order", to: "sys", color: "#4ade80", label: "next order" }
        ]
      }
    ]
  }
});
