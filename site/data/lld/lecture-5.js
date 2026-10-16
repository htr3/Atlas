window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 5,
  title: "Low Level System Design: MakeMyTrip Booking Management System with Arun Goel",
  video: "https://www.youtube.com/watch?v=pnkd8mVyTNQ",
  category: "Low-Level Design",
  tagline: "One singleton System, a User hierarchy, and a lock on the seat — then hotels are the same diagram.",
  summary: "Arun Goel walks a MakeMyTrip-style booking LLD from use cases to classes to Java-ish code. Customers fetch flights, fix seats, and cancel; a singleton System owns the list of flights; each Flight holds its own Aircraft instance so seat 1A at 3pm is not seat 1A at 4pm. Concurrent booking is a boolean plus synchronized, a lock on the seat, or a single thread — and a failed payment page when you lose the race.",

  theory: [
    {
      heading: "Requirements: a generic booking layout",
      body: "MakeMyTrip (or Booking.com) is end-to-end travel: flights, buses, hotels, trains. They design <b>flight booking</b> and treat the rest as the same layout with different nouns. Customer: see flights for a date, source, and destination; reserve; see which seats are taken; cancel. Seat kinds: regular, extra legroom, emergency exit (plus paid front rows). Admin: add a flight to the schedule, cancel a flight, trigger refunds. Payment is assumed inside reserve. They do not deep-dive admin in code.",
      bullets: [
        "Hotel rooms and bus seats follow fetch → select → fix → cancel.",
        "Trains are the same except one rake stops at many stations.",
        "Offline hotel inventory is a product problem: the desk must update status, or you double-book and call a human."
      ]
    },
    {
      heading: "Use cases, then User / Customer / Admin",
      body: "Arun's loop: requirements → use-case diagram (actors + activities) → class diagram → code. Actors: Customer, Admin, and the <b>System</b> (the API surface: fetch, fix seat, cancel, persist). Customer and Admin both have id, name, email, and a System handle, plus login/logout. That is a <code>User</code> <b>class they extend</b>, not an interface: same fields and same login behavior, different extra methods. An interface would be for the same function implemented two ways; here the data is identical.",
      bullets: [
        "Customer.fixSeat(flight, seat) → boolean; cancel(flight) → boolean.",
        "A booking may hold several seats; all-or-nothing vs partial fill is a product call.",
        "Range booking (30–35): either every seat is free or return which subset won."
      ]
    },
    {
      heading: "Singleton System and the flight graph",
      body: "Many customers and admins must share one inventory. That is <b>Singleton</b>: private construction, <code>getInstance()</code>, one list of flights. <code>fetchFlights(source, dest, date)</code> filters that list (a HashMap is an SD3 optimization). <code>fixSeat(aircraft, seat)</code> returns boolean for the UI. <code>Flight</code> has date, start/end time, source, dest, and an <code>Aircraft</code>. <code>Aircraft</code> has id and a map of seats; <code>bookSeat(seat, customer)</code>. <code>Seat</code> has id, <code>SeatType</code> enum, optional customer (null = free), optional price. System 1—N Flight; Flight 1—1 Aircraft instance; Aircraft 1—N Seat.",
      bullets: [
        "Same physical 747 at 3pm and 4pm must be two Aircraft instances, or cancel-for-customer cannot tell which 1A.",
        "Layout can come from a prototype aircraft; occupancy lives on the per-flight copy.",
        "A static System is the same singleton idea without the pattern name."
      ]
    },
    {
      heading: "Call sequence: fix a seat",
      body: "Customer picks a flight and a seat, then <code>flight.aircraft.fixSeat(seat, this)</code>. Aircraft reads <code>seat.getCustomer()</code>; if non-null, return false (UI: sorry, try again). Else <code>setCustomer</code> and return true (congratulations). Cancel walks the aircraft map, nulls matching customers. Fetch is a linear filter in the sketch. Constructors and getters are assumed. LLD is not machine coding: they do not run MakeMyTrip; they discuss until the interviewer is convinced.",
      bullets: [
        "Boolean return is the concurrency hook the frontend already understands.",
        "Price moves: poll airlines, fail the booking if the fare changed (very optimistic).",
        "A separate Booking class or decorator on Seat is a valid later refactor they skipped for time."
      ]
    },
    {
      heading: "Concurrency: 10 rooms, 100 payments",
      body: "Check-then-set on <code>getCustomer() == null</code> is a race: two threads both see null and both write. Three fixes they name: <b>synchronize the method</b> (lock the code), <b>lock the seat object</b> (lock the data), or <b>force one thread</b> (ordering). SD1/SD2 may stop at classes; SSE is expected to get here. Cross-region: one primary database, first writer wins, others get false; if you truly have two primaries, accept both and let a human unwind the last 5%. A security-camera-plus-guard analogy: automate 95%, people handle the rest.",
      bullets: [
        "MakeMyTrip in the wild: you fill the card for minutes; someone else pays; you see failure.",
        "Third-party OTAs hitting the same hotel row is the same lock.",
        "Do not design two-phase commit in this LLD unless they push CAP."
      ]
    },
    {
      heading: "Interview pacing and extensions",
      body: "Learn Singleton and Facade, then practice until you recognize them. ~10 minutes use cases, ~30 minutes class diagram (that is where debate happens), ~15–20 minutes signatures. Extensibility to trains/hotels is noun swap, not a new architecture. ER diagrams and which database are HLD. Working constructors are not the point; a DP round tests coding. Pattern-from-practice, not from a cheat sheet.",
      bullets: [
        "Freshers: OOP, private vs public, which method lives where.",
        "SSE: concurrency, scan-vs-index on fetchFlights, latency vs throughput.",
        "Good enough for one hour is not production MakeMyTrip."
      ]
    }
  ],

  keyTerms: [
    { term: "Use-case diagram", def: "Actors (Customer, Admin, System) and the activities each can start." },
    { term: "User hierarchy", def: "Shared id/name/email/login on a User class; Customer and Admin extend it." },
    { term: "Singleton System", def: "One instance exposing fetchFlights, fixSeat, cancel, addFlight." },
    { term: "Flight vs Aircraft", def: "Flight is a dated trip; Aircraft is the seat map for that trip's instance." },
    { term: "SeatType", def: "Enum: regular, extra legroom, emergency exit (and similar paid variants)." },
    { term: "fixSeat boolean", def: "true → success page; false → seat taken or stale fare, try again." },
    { term: "Lock the seat", def: "Synchronize the method, lock the Seat object, or run bookings on one thread." },
    { term: "Optimistic fare", def: "Book at the shown price; if the airline moved, fail and send the user back." }
  ],

  tradeoffs: [
    { pro: "User as a class: login/logout and fields written once.", con: "An interface would have been wrong here; people still suggest it." },
    { pro: "Singleton System: every actor sees the same flights.", con: "A process-wide singleton is awkward to test and to shard later." },
    { pro: "Per-flight Aircraft copy: 3pm 1A ≠ 4pm 1A.", con: "More objects than a single prototype plus occupancy table." },
    { pro: "Boolean + lock: matches the real \"payment failed, seat gone\" UX.", con: "Holds a seat during a three-minute card form unless you add TTL (not coded)." },
    { pro: "Human unwind for dual primaries: 95% automated.", con: "A bank-grade room would pay for a single commit point instead." }
  ],

  interviewTips: [
    "Write actors and use cases before any field list; code from the class diagram.",
    "Call Singleton when Customer and Admin must share one System.",
    "Draw Flight → Aircraft → Seat and say why each flight needs its own aircraft object.",
    "For 100 people and 10 rooms, name three locks: method, seat, or single thread.",
    "Return boolean and let the frontend show success vs retry — that is the concurrency API.",
    "Skip admin refunds and ER diagrams; name hotels/buses as the same fetch-fix-cancel loop."
  ],

  scene: {
    nodes: [
      { id: "cust", label: "Customer", type: "user", pos: [-10.5, 0, 3] },
      { id: "admin", label: "Admin", type: "user", pos: [-10.5, 0, -3] },
      { id: "user", label: "User", type: "service", pos: [-7, 0, 0] },
      { id: "sys", label: "System", type: "gateway", pos: [-3.5, 0, 0] },
      { id: "flight", label: "Flight", type: "service", pos: [0, 0, 0] },
      { id: "ac", label: "Aircraft", type: "storage", pos: [3.5, 0, 0] },
      { id: "seat", label: "Seat", type: "worker", pos: [7, 0, 0] },
      { id: "seat2", label: "Seat 1A copy", type: "worker", pos: [7, 0, -3], showAt: 4 },
      { id: "ac2", label: "Aircraft 4pm", type: "storage", pos: [3.5, 0, -3], showAt: 4 },
      { id: "pay", label: "Payment UI", type: "phone", pos: [-10.5, 0, 6], showAt: 6 },
      { id: "lock", label: "Seat lock", type: "lb", pos: [7, 0, 3], showAt: 6 },
      { id: "note0", label: "Fetch / fix / cancel", type: "note", pos: [-7, 0, 6] },
      { id: "note1", label: "Extend User, not IF", type: "note", pos: [-7, 0, -6], showAt: 1 },
      { id: "note2", label: "One System instance", type: "note", pos: [-3.5, 0, 6], showAt: 2 },
      { id: "note3", label: "3pm 1A ≠ 4pm 1A", type: "note", pos: [3.5, 0, 6], showAt: 4 },
      { id: "note4", label: "null? then set", type: "note", pos: [10.5, 0, 3], showAt: 5 }
    ],
    edges: [
      { from: "cust", to: "user", label: "extends" },
      { from: "admin", to: "user", label: "extends" },
      { from: "user", to: "sys", label: "getInstance" },
      { from: "sys", to: "flight", label: "1..N" },
      { from: "flight", to: "ac", label: "has" },
      { from: "ac", to: "seat", label: "map" },
      { from: "flight", to: "ac2", showAt: 4, dashed: true },
      { from: "ac2", to: "seat2", showAt: 4 },
      { from: "cust", to: "sys", label: "fixSeat", showAt: 5 },
      { from: "lock", to: "seat", showAt: 6 },
      { from: "pay", to: "cust", showAt: 6 }
    ],
    steps: [
      {
        title: "Flight booking as the template",
        text: "Customers fetch by date, source, and destination, reserve a seat, inspect the map, and cancel. Admin adds or cancels flights. Hotels and buses reuse the same verbs. Payment sits inside reserve.",
        highlight: ["cust", "admin", "sys", "note0"]
      },
      {
        title: "User is a class, not an interface",
        text: "Customer and Admin share id, name, email, and login. Extract User and extend it. An interface would fit two implementations of the same method; here the data and login path are the same.",
        highlight: ["cust", "admin", "user", "note1"],
        flows: [
          { from: "cust", to: "user", color: "#c084fc", label: "extends" },
          { from: "admin", to: "user", color: "#c084fc", label: "extends" }
        ]
      },
      {
        title: "System is a singleton",
        text: "Every actor must see the same flights. getInstance() builds one System with a list of Flight. fetchFlights filters that list. This is the pattern they wanted people to notice.",
        highlight: ["sys", "user", "flight", "note2"],
        flows: [
          { from: "user", to: "sys", color: "#4ade80", label: "getInstance" },
          { from: "sys", to: "flight", color: "#60a5fa", label: "fetch" }
        ]
      },
      {
        title: "Flight, Aircraft, Seat",
        text: "Flight holds schedule fields and one Aircraft. Aircraft holds a seat map. Seat holds type, id, and a customer pointer (null if free). System has many flights; each aircraft has many seats.",
        highlight: ["flight", "ac", "seat"],
        flows: [
          { from: "flight", to: "ac", color: "#60a5fa", label: "has" },
          { from: "ac", to: "seat", color: "#60a5fa", label: "seats" }
        ]
      },
      {
        title: "Two times, two aircraft objects",
        text: "The same 747 at 3pm and 4pm cannot share one Aircraft, or seat 1A has one customer field. Each flight gets its own instance with the same layout. Cancel-for-customer then knows which trip you mean.",
        highlight: ["flight", "ac", "ac2", "seat", "seat2", "note3"],
        flows: [
          { from: "flight", to: "ac2", color: "#c084fc", label: "4pm copy" }
        ]
      },
      {
        title: "fixSeat: null then set",
        text: "Customer → System/Flight → Aircraft.bookSeat. If getCustomer() is already set, return false. Else setCustomer(this) and return true. The UI maps that boolean to congratulations vs sorry.",
        highlight: ["cust", "sys", "ac", "seat", "note4"],
        flows: [
          { from: "cust", to: "sys", color: "#4ade80", label: "fixSeat" },
          { from: "sys", to: "ac", color: "#4ade80", label: "book" },
          { from: "ac", to: "seat", color: "#4ade80", label: "set" }
        ]
      },
      {
        title: "The 10-room race",
        text: "Two threads can both see null. Lock the method, lock the Seat, or run one booking thread. In production you may still lose during payment; MakeMyTrip just fails you and asks you to pick again.",
        highlight: ["pay", "lock", "seat", "cust"],
        fail: ["pay"],
        flows: [
          { from: "pay", to: "cust", color: "#f87171", label: "lost race" },
          { from: "lock", to: "seat", color: "#fb923c", label: "sync" }
        ]
      },
      {
        title: "Same diagram for hotels",
        text: "Swap Flight for Hotel and Seat for Room. Trains add extra stops, not extra patterns. Dual data centers: one primary, or accept a double book and call the guest. That is the 95% machine, 5% human close.",
        highlight: ["sys", "flight", "seat", "cust"],
        flows: [
          { from: "cust", to: "sys", color: "#60a5fa", label: "fetch hotels" }
        ]
      }
    ]
  }
});
