window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 22,
  title: "Designing a location database: QuadTrees and Hilbert Curves",
  video: "https://www.youtube.com/watch?v=OcUKFIjhKu0",
  category: "Data & Storage",
  tagline: "Fold the map into a line so nearby points become a range query.",
  summary: "Pin codes lie: two neighbouring codes can be a long detour apart. A location store must measure distance, zoom to arbitrary granularity, and find everyone within a radius. Quadtrees split the plane into four recursively; Hilbert curves then squeeze that plane into a 1-D line so segment-tree range queries can power maps, Swiggy, and cabs.",

  theory: [
    {
      heading: "Pin codes are the wrong index",
      body: "Google Maps, Swiggy, and taxi apps all need a location database. An early trick is to stamp every place with a postal code (PIN in India, ZIP in the US) and assign it to a post office. That is a coarse bucket, not a metric. The lecture's delivery: restaurant in <b>400051</b>, customer in <b>400050</b>. The numbers look adjacent. A train line sits between them, and the only crossing is two kilometres away, so dinner arrives late. Requirement one: you must be able to <b>measure distance</b> between any two points, which needs a uniform numbering of space, not political post-office regions.",
      bullets: [
        "Postal codes group delivery routes, not Euclidean neighbours.",
        "Adjacent codes can be far; distant codes can be a short walk.",
        "Maps, food delivery, and rideshare all need real proximity, not \"same PIN.\""
      ]
    },
    {
      heading: "Three requirements",
      body: "Distance needs a consistent coordinate system. The second need is <b>scalable granularity</b>: you must be able to cut a region into smaller and smaller pieces, down to a city or a one-kilometre square, without changing the representation. The third is <b>proximity</b>: \"who is within 10 km of me?\" Polygons and intersections can wait; these two (distance + proximity), plus zoom, are enough to start.",
      bullets: [
        "Uniform assignment of numbers so distance is well-defined.",
        "Arbitrary subdivision (more precision on demand).",
        "Range-around-a-point queries, not a full table scan."
      ]
    },
    {
      heading: "Lat/long is fine until you ask \"who is nearby?\"",
      body: "Latitude and longitude on a 2-D map already give you Euclidean distance, and extra decimal places zoom you toward nanometres, so distance and granularity are solved. Proximity is not. Checking every stored point against the query point is O(n) over the planet. Also, a float is not an exact real: 32- or 64-bit values name a <i>range</i> on the number line (10/3 cannot be stored exactly). Reading the bits of a number is binary search: 0 goes left, 1 goes right, and more bits shrink the error interval. Split 64 bits into 32 for X and 32 for Y and each pair of bits picks a rectangle. With only two bits per axis you get four huge slabs that can hold continents. Six bits might be enough to name \"India.\" Sharing a long MSB prefix usually means two points are close. Caveat: a point just left of a quadrant cut and a point just right can be metres apart in space but disagree in the very first bits (codes 10 vs 01).",
      bullets: [
        "Lat/long + Euclidean: distance and zoom, not an index for neighbours.",
        "Bits are a binary search on each axis; more bits, smaller cells.",
        "Prefix closeness is a heuristic; cuts create false \"far\" pairs."
      ]
    },
    {
      heading: "Quadtrees: a BST with four children",
      body: "A quadtree is a binary search tree for two dimensions. The root is the whole world. Each internal node has four children: upper-left, upper-right, lower-left, lower-right, each one quarter of its parent. Twenty points might land 5 / 3 / 1 / 11 in those four quadrants; you recurse only where you care. Split when a cell's user count crosses a threshold (say 10), or stop at application grain (all of Mumbai, or a 1 km square leaf). The tree is naturally skewed: Mumbai goes deep, a town in Iceland stays a fat shallow leaf. Range queries on a 2-D tree are awkward. On a 1-D line, interval trees and segment trees already give O(log n) ranges. If we could <b>flatten the plane into a line</b> while keeping neighbours nearby on that line, we could reuse those 1-D structures.",
      bullets: [
        "Four-way recursive partition of the map.",
        "Split on occupancy or on a minimum cell size.",
        "Population skew makes one branch deep; 2-D range search stays hard."
      ]
    },
    {
      heading: "Space-filling curves, Hilbert in particular",
      body: "Fractals (the 3Blue1Brown kind) live in fractional dimensions: extra room to wiggle, but not a full extra axis. A space-filling curve is that idea as a database index: thread a 1-D line through every cell of the 2-D grid, visiting each quadrant once. Three doodles for four cells: a <b>Z</b> (diagonal jump), a <b>U</b> (the Hilbert curve, the one we keep), and an awkward alpha / N-ish stroke that wanders too far and throws proximity away. Longer strokes lose more locality. Hilbert stays compact. Recursively, break the line into four segments and drop 0,1,2,3 into the four quadrants, then repeat inside each. Continuity is the trick: rotate the little U's so the curve never jumps. At level 1 one U faces left. At level 2 the two right quadrants keep left-facing U's, the upper-left U sits in the \"English\" orientation, the lower-left U is inverted, and the level-1 stroke stitches their endpoints. Level 3 copies the same recipe; connectors of different colours mark which level glued which U. Depth is unbounded, so in the limit every point on the plane sits on the curve.",
      bullets: [
        "Z-curve is useful; Hilbert preserves locality better; the long alpha path is a joke.",
        "Each level refines every quadrant into four and rotates so the path stays a single stroke.",
        "A point's Hilbert index is its place on that 1-D line; nearby indexes are usually nearby cells."
      ]
    },
    {
      heading: "Proximity as plus-or-minus on the line",
      body: "Stand on index 29. Pick a threshold of 6. The interval 23-34 is a contiguous range query: every delivery agent whose Hilbert number falls there is a candidate neighbour. Deeper curves make this truer. It is still approximate. Indexes 18 and 29 differ by 11 but can sit on adjacent cells; 40 also differs by 11 and can be far. Widen the threshold to catch 18 and you also swallow 40. In production you want \"nearby-ish,\" not a proof, so a well-chosen window plus a deeper curve is enough for food, cabs, and \"people around me\" dating. The win is architectural: 2-D proximity became a 1-D range, and 1-D ranges are a solved data-structure problem.",
      bullets: [
        "Query: Hilbert(p) +/- k, then filter exact distance if you must.",
        "Threshold is a knob: too tight misses border neighbours, too wide adds far false friends.",
        "Apps that need \"close enough\" (Swiggy, taxis, local discovery) can live with the error."
      ]
    }
  ],

  keyTerms: [
    { term: "PIN / ZIP code", def: "Postal bucket. Nearby codes are not a distance guarantee (400051 vs 400050)." },
    { term: "Proximity query", def: "Return the points within a radius of a query point, without scanning the world." },
    { term: "Lat/long", def: "Uniform 2-D coordinates. Distance is easy; neighbour search is not." },
    { term: "Quadtree", def: "Recursive four-child partition of the plane, split by occupancy or cell size." },
    { term: "R-tree", def: "Related spatial index using bounding rectangles; same 2-D range-query pain." },
    { term: "Segment / interval tree", def: "1-D structures that answer range queries in about log n." },
    { term: "Space-filling curve", def: "A line that visits every cell of a grid, mapping 2-D locality onto 1-D order." },
    { term: "Z-curve", def: "Morton order: interleave X and Y bits; simple, some diagonal jumps." },
    { term: "Hilbert curve", def: "Recursive U-shaped path with rotations so the stroke stays continuous and local." }
  ],

  tradeoffs: [
    { pro: "Quadtrees are simple and zoom naturally; dense cities get more nodes.", con: "Skew (Mumbai vs Iceland) unbalances the tree; 2-D ranges are still clumsy." },
    { pro: "Hilbert turns proximity into a 1-D interval you can put in a segment tree.", con: "Border pairs can have far-apart indexes; the +/- threshold is a heuristic." },
    { pro: "Deeper curves improve locality and can represent any point.", con: "Longer keys, more rotation bookkeeping, and never a perfect 2-D metric." },
    { pro: "Z-curves are easier to compute (bit interleaving).", con: "The diagonal jump hurts locality more than Hilbert's U." }
  ],

  interviewTips: [
    "Start from the 400051 / 400050 train-line story so they see why geohashes beat pin codes.",
    "List the three requirements: distance, zoom, proximity. Lat/long only nails the first two.",
    "Draw a quadtree as a four-child BST and mention occupancy-based split plus population skew.",
    "Say the punchline: 2-D range queries are hard; 1-D are log n; Hilbert is the fold.",
    "Walk Hilbert level 1 U, then rotated child U's, then \"point 29 +/- 6 => 23-34.\"",
    "Admit the 18 vs 40 edge case so you do not oversell exactness; production wants close-enough."
  ],

  scene: {
    nodes: [
      { id: "rest", label: "Rest. 400051", type: "server", pos: [-10, 0, -6] },
      { id: "cust", label: "You 400050", type: "user", pos: [-4, 0, -6] },
      { id: "tracks", label: "Train line", type: "zone", pos: [-7, 0, -6], size: [2.2, 4] },
      { id: "n_pin", label: "Codes look close, detour 2 km", type: "note", pos: [-7, 3.2, -8] },

      { id: "n_req", label: "Need distance, zoom, nearby", type: "note", pos: [4, 3.2, -7], showAt: 1 },

      { id: "map", label: "World map", type: "zone", pos: [0, 0, 1], size: [18, 12], showAt: 2 },
      { id: "a1", label: "Rider A", type: "point", pos: [-6, 0.4, -2], showAt: 2, color: "#60a5fa" },
      { id: "a2", label: "Rider B", type: "point", pos: [5, 0.4, 3], showAt: 2, color: "#60a5fa" },
      { id: "a3", label: "Rider C", type: "point", pos: [-2, 0.4, 4], showAt: 2, color: "#60a5fa" },
      { id: "a4", label: "Rider D", type: "point", pos: [7, 0.4, -3], showAt: 2, color: "#60a5fa" },
      { id: "n_scan", label: "Euclidean vs all points = O(n)", type: "note", pos: [8, 3.2, -5], showAt: 2 },

      { id: "qNW", label: "NW", type: "zone", pos: [-4.5, 0, -2], size: [7, 5], showAt: 3 },
      { id: "qNE", label: "NE", type: "zone", pos: [4.5, 0, -2], size: [7, 5], showAt: 3 },
      { id: "qSW", label: "SW", type: "zone", pos: [-4.5, 0, 4], size: [7, 5], showAt: 3 },
      { id: "qSE", label: "SE", type: "zone", pos: [4.5, 0, 4], size: [7, 5], showAt: 3 },
      { id: "n_bits", label: "2 bits/axis = 4 huge cells", type: "note", pos: [-9, 3.2, 1], showAt: 3 },

      { id: "root", label: "World root", type: "service", pos: [0, 4.5, 1], showAt: 4 },
      { id: "n_skew", label: "Mumbai deep, Iceland shallow", type: "note", pos: [9, 3.2, 7], showAt: 4 },
      { id: "mum", label: "Mumbai x11", type: "db", pos: [4.5, 0, 4], showAt: 4 },
      { id: "ice", label: "Iceland x1", type: "db", pos: [-4.5, 0, 4], showAt: 4 },

      { id: "n_1d", label: "1-D ranges are log n", type: "note", pos: [-9, 3.2, 7], showAt: 5 },
      { id: "line", label: "1-D index line", type: "queue", pos: [0, 0, 7.5], showAt: 5 },

      { id: "h0", label: "0", type: "point", pos: [-4.5, 0.5, 4], showAt: 6, color: "#4ade80" },
      { id: "h1", label: "1", type: "point", pos: [-4.5, 0.5, -2], showAt: 6, color: "#4ade80" },
      { id: "h2", label: "2", type: "point", pos: [4.5, 0.5, -2], showAt: 6, color: "#4ade80" },
      { id: "h3", label: "3", type: "point", pos: [4.5, 0.5, 4], showAt: 6, color: "#4ade80" },
      { id: "n_hilbert", label: "Hilbert U (not Z, not alpha)", type: "note", pos: [0, 3.2, -7], showAt: 6 },

      { id: "p29", label: "29 you", type: "user", pos: [1.5, 0, 2.2], showAt: 7 },
      { id: "p23", label: "23", type: "point", pos: [-2, 0.4, 5.5], showAt: 7, color: "#fb923c" },
      { id: "p34", label: "34", type: "point", pos: [8, 0.4, 5.5], showAt: 7, color: "#fb923c" },
      { id: "n_rng", label: "29 +/- 6 => 23 to 34", type: "note", pos: [8, 3.2, 3], showAt: 7 },

      { id: "agent", label: "Nearby agent", type: "phone", pos: [8, 0, 1.2], showAt: 8 },
      { id: "p18", label: "18 close", type: "point", pos: [-1, 0.4, -0.2], showAt: 8, color: "#4ade80" },
      { id: "p40", label: "40 far", type: "point", pos: [-9, 0.4, -3], showAt: 8, color: "#f87171" },
      { id: "n_edge", label: "18 and 40 both differ by 11", type: "note", pos: [-9, 3.2, -2], showAt: 8 }
    ],
    edges: [
      { from: "rest", to: "cust", label: "2 km detour", dashed: true },
      { from: "cust", to: "a1", label: "dist?", showAt: 2, dashed: true },
      { from: "cust", to: "a2", showAt: 2, dashed: true },
      { from: "cust", to: "a3", showAt: 2, dashed: true },
      { from: "cust", to: "a4", showAt: 2, dashed: true },
      { from: "root", to: "qNW", showAt: 4 },
      { from: "root", to: "qNE", showAt: 4 },
      { from: "root", to: "qSW", showAt: 4 },
      { from: "root", to: "qSE", showAt: 4 },
      { from: "h0", to: "h1", label: "U", showAt: 6 },
      { from: "h1", to: "h2", showAt: 6 },
      { from: "h2", to: "h3", showAt: 6 },
      { from: "h0", to: "line", showAt: 6, dashed: true },
      { from: "h3", to: "line", showAt: 6, dashed: true },
      { from: "p23", to: "p29", showAt: 7, dashed: true },
      { from: "p29", to: "p34", showAt: 7, dashed: true },
      { from: "p29", to: "agent", showAt: 8 },
      { from: "p29", to: "p18", showAt: 8, dashed: true },
      { from: "p29", to: "p40", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "Adjacent PINs, a train in between",
        text: "Restaurant 400051, you 400050. The codes look like neighbours. A train line forces a two-kilometre crossing, so the food is late. Postal buckets are not a distance function.",
        highlight: ["rest", "cust", "tracks", "n_pin"],
        hide: ["map", "a1", "a2", "a3", "a4", "qNW", "qNE", "qSW", "qSE", "root", "mum", "ice", "line", "h0", "h1", "h2", "h3", "p29", "p23", "p34", "agent", "p18", "p40"],
        flows: [
          { from: "rest", to: "cust", color: "#f87171", label: "detour" }
        ]
      },
      {
        title: "What the database must do",
        text: "Measure distance between any two points (uniform coordinates). Zoom into arbitrary smaller cells. Answer \"who is within 10 km?\" Those three, not polygons, are the brief.",
        highlight: ["n_req", "cust"],
        hide: ["map", "a1", "a2", "a3", "a4", "qNW", "qNE", "qSW", "qSE", "root", "mum", "ice", "line", "h0", "h1", "h2", "h3", "p29", "p23", "p34", "agent", "p18", "p40"],
        flows: [
          { from: "cust", to: "rest", color: "#60a5fa", label: "how far?" }
        ]
      },
      {
        title: "Lat/long, then a planet-wide scan",
        text: "Latitude and longitude give Euclidean distance and extra decimals for zoom. Proximity still means comparing you to every rider on the map. That is too expensive for a live app.",
        highlight: ["cust", "a1", "a2", "a3", "a4", "n_scan", "map"],
        hide: ["qNW", "qNE", "qSW", "qSE", "root", "mum", "ice", "line", "h0", "h1", "h2", "h3", "p29", "p23", "p34", "agent", "p18", "p40", "tracks"],
        flows: [
          { from: "cust", to: "a1", color: "#60a5fa", label: "km" },
          { from: "cust", to: "a2", color: "#60a5fa" },
          { from: "cust", to: "a3", color: "#60a5fa" },
          { from: "cust", to: "a4", color: "#60a5fa" }
        ]
      },
      {
        title: "Bits cut the world into quadrants",
        text: "A number's bits binary-search the axis. Two bits of X and two of Y make four enormous cells (continents). More bits zoom in; a shared prefix usually means \"same neighbourhood,\" except right on a cut.",
        highlight: ["qNW", "qNE", "qSW", "qSE", "n_bits"],
        hide: ["a1", "a2", "a3", "a4", "root", "mum", "ice", "line", "h0", "h1", "h2", "h3", "p29", "p23", "p34", "agent", "p18", "p40", "tracks", "rest"],
        flows: []
      },
      {
        title: "Quadtree: four children, split when busy",
        text: "The world root fans into NW/NE/SW/SE. Recurse where user count crosses a threshold. Mumbai's 11 points keep splitting; Iceland's one point stays a leaf. 2-D range search is still the painful part.",
        highlight: ["root", "qNW", "qNE", "qSW", "qSE", "mum", "ice", "n_skew"],
        hide: ["a1", "a2", "a3", "a4", "line", "h0", "h1", "h2", "h3", "p29", "p23", "p34", "agent", "p18", "p40", "tracks", "rest"],
        flows: [
          { from: "root", to: "mum", color: "#fb923c", label: "split" },
          { from: "root", to: "ice", color: "#60a5fa", label: "leaf" }
        ]
      },
      {
        title: "Fold the plane into a 1-D line",
        text: "Interval and segment trees already do log-n ranges on a line. If a curve visits every cell of the map, nearby geography becomes a nearby interval on that index. Fractals are the geometric hint.",
        highlight: ["line", "n_1d", "map"],
        hide: ["a1", "a2", "a3", "a4", "h0", "h1", "h2", "h3", "p29", "p23", "p34", "agent", "p18", "p40", "tracks", "rest", "mum", "ice", "root"],
        flows: [
          { from: "qSW", to: "line", color: "#c084fc", label: "fold" },
          { from: "qNE", to: "line", color: "#c084fc" }
        ]
      },
      {
        title: "Hilbert's U, not Z, not alpha",
        text: "Four cells, one visit each. A Z jumps the diagonal. An alpha-shaped stroke wanders and loses locality. Hilbert's U stays compact. Recursively rotate child U's so the stroke never breaks; depth can go forever.",
        highlight: ["h0", "h1", "h2", "h3", "n_hilbert", "line"],
        hide: ["a1", "a2", "a3", "a4", "p29", "p23", "p34", "agent", "p18", "p40", "tracks", "rest", "mum", "ice"],
        flows: [
          { from: "h0", to: "h1", color: "#4ade80", label: "U" },
          { from: "h1", to: "h2", color: "#4ade80" },
          { from: "h2", to: "h3", color: "#4ade80" }
        ]
      },
      {
        title: "Customer 29, window 23-34",
        text: "You sit at Hilbert index 29. Threshold 6 gives the contiguous range 23 to 34. Anyone whose index lands in that interval is a proximity candidate. Deeper levels make the window tighter and more honest.",
        highlight: ["p29", "p23", "p34", "n_rng", "line"],
        hide: ["a1", "a2", "a3", "a4", "tracks", "rest", "mum", "ice", "agent", "p18", "p40"],
        flows: [
          { from: "p23", to: "p29", color: "#fb923c", label: "23" },
          { from: "p29", to: "p34", color: "#fb923c", label: "34" }
        ]
      },
      {
        title: "Nearby agent, and the 18 vs 40 trap",
        text: "A driver in the window is dispatchable. Indexes 18 and 29 can be physically close yet differ by 11; 40 can differ by 11 and be far. Tune the threshold for \"close enough\" food and cabs, not for a geometric proof.",
        highlight: ["p29", "agent", "p18", "p40", "n_edge"],
        hide: ["a1", "a2", "a3", "a4", "tracks", "rest", "mum", "ice"],
        flows: [
          { from: "p29", to: "agent", color: "#4ade80", label: "dispatch" },
          { from: "p29", to: "p18", color: "#4ade80", label: "missed?" },
          { from: "p29", to: "p40", color: "#f87171", label: "false far" }
        ]
      }
    ]
  }
});
