window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 16,
  title: "Designing Instagram: System Design of News Feed",
  video: "https://www.youtube.com/watch?v=QmX2NPkJTKg",
  category: "Case Studies",
  tagline: "Precomputed top-20 feeds, fan-out on write, and a hybrid push/pull for celebrities.",
  summary: "Instagram scoped to photos, likes/comments, follow, and a news feed. After a thin recap of file+CDN images and a clean activity/follow schema, the lecture spends its energy on feed generation: gateway plus load-balancer snapshots, why looping 'get posts for everyone I follow' will not scale, fan-out-on-write into cached top-20 lists, and a hybrid push/pull model so celebrity posts do not melt the fleet.",

  theory: [
    {
      heading: "Ask which Instagram they want",
      body: "You have used the real app. The interviewer has a 45-minute budget. Photos in and out are assumed; everything else should be confirmed. This lecture locks four features: store/fetch images, like and comment on posts, follow another user, and publish a news feed. Pages-as-followable-entities (Facebook) and deep comment trees are explicitly out of scope. If you already know a simple answer (the follow table), say it and save time for the feed, which is the actual exam.",
      bullets: [
        "Like + comment on posts (and like a comment).",
        "Interview simplification: one comment layer, no reply-to-reply."
      ]
    },
    {
      heading: "Images: same files-and-CDN story as Tinder",
      body: "Treat a post's photo as a file on cheap storage with a CDN in front. Metadata (who posted, caption, pointer to the file) lives in a posts service. The lecture points back at the Tinder video rather than re-litigating BLOB vs file. Keep image bytes out of the tables you will later join for feeds.",
      bullets: [
        "Image service + CDN are present but not the star of this design.",
        "Posts service answers 'posts by user X / on day D'."
      ]
    },
    {
      heading: "Likes, comments, and an activity table",
      body: "A like is <code>likeId</code>, actor, timestamp, optional active flag, plus a parent. The parent might be a post or a comment, so store <code>parentId</code> and a <code>type</code> enum — do not encode type into the id string (<code>comment_123</code> is called out as poor design). Counting likes with <code>SELECT COUNT(*)</code> per post is fine for a profile page and fatal for a 20-image feed (a storm of aggregations). Caching a like-counter on the posts row is denormalized convenience that does not belong there. An activity table holds per-parent aggregates (and you can still list who liked from the likes table). Comments have their own id, text, timestamp, and parent post; the interview version has no images inside comments.",
      bullets: [
        "Likes table = facts. Activity table = counts. Posts table = the media row.",
        "Every row still gets a primary key (UUID is fine)."
      ]
    },
    {
      heading: "Follow is one table and two questions",
      body: "<code>(followerId, followeeId, since)</code> answers both 'who follows me?' and 'who do I follow?' with an equality on one column. Index both directions. This is the easy feature — answer it quickly so the interviewer can move to routing and feeds. Profile, sessions, chat, and images still exist in a real Instagram; this lecture hides them so the feed path stays readable.",
      bullets: [
        "Follow service APIs: followers-of(X), following-of(X).",
        "Give prepared answers immediately; it signals you studied and unlocks the hard part."
      ]
    },
    {
      heading: "Gateway, snapshots, and hashing onto feed boxes",
      body: "The phone hits a gateway that is also the reverse proxy: auth tokens, and translation from public protocols (HTTPS, XMPP/WebSockets) into whatever the VPC speaks — extra security because outsiders never learn the internal language. <code>GET /feed?userId=</code> must land on one of many identical user-feed boxes. Asking a load balancer on every packet is expensive, so the LB holds a <b>snapshot</b> of who lives where and pushes that map to gateways about every 10 seconds. Routing itself is consistent hashing on userId so the same user tends to hit the same box. Feed service then depends on posts + follow (and, off to the side, images, activity, chat, profile).",
      bullets: [
        "Gateway = edge policy. Load balancer = cluster map, not a per-request oracle.",
        "hash(userId) picks the feed box that owns that user's precomputed list."
      ]
    },
    {
      heading: "The naive feed will not scale",
      body: "Recipe that is correct and too slow: ask follow service for everyone I follow, then for-loop <code>getPosts(user)</code> on the posts service, merge, take top 20, return through the gateway. Ten follows become ten remote calls. A batch API <code>getPosts(userIds[])</code> plus a limit on how many posts you pull are real optimizations and still recompute the world on every open-the-app. Posts DB starts eating joins. The lecture's verdict: precompute the feed. A read should be 'return the list we already built'.",
      bullets: [
        "Batch + limit help. They do not remove repeated fan-in on posts.",
        "Precompute means an incremental write path, not a nightly batch of every user."
      ]
    },
    {
      heading: "Fan-out on write into a cached top-20",
      body: "When Alice posts, posts service persists the row, then notifies the user-feed service. Feed service asks follow for Alice's followers and <b>prepends the new post onto each follower's list</b> (a small queue/SKU capped at about 20). That is a cheap incremental update instead of a full merge. Store those lists in cache, not a DB: the feed box stays simple, and if memory dies you rebuild with the old brute-force path (following + recent posts) once. Cache policy is MRU/hot users — someone who opens the app rarely should not occupy RAM until they actually show up. After a crash the service is stateless; lists are rebuilt on demand.",
      bullets: [
        "Fan-out-on-write: one post updates N follower queues of length ≤ 20.",
        "Cache miss / eviction / crash → recompute that one user's feed, not everyone's."
      ]
    },
    {
      heading: "Push vs pull, and the celebrity exception",
      body: "Once a follower's queue changes, you can notify their phone. Polling every 10 seconds burns radio and battery; the lecture prefers WebSocket push (long-poll is a fallback). How to route one server event to 50 online followers is deferred to the chat video (and sketched in Tinder via sessions). A celebrity with millions of followers cannot be fanned out as a million synchronous pushes — that is a thundering herd. Two mitigations: <b>batch</b> (e.g. notify 100–1000 followers every 10 seconds, i.e. rate-limit the fan-out) and <b>pull</b> (do not push at all; fans fetch when they open the app, naturally staggered). The hybrid: push for ordinary users so the feed feels live; pull (or heavy batching) for celebrities. Facebook, Twitter, Quora, Instagram all keep a bounded per-user list and this write-time fan-out idea.",
      bullets: [
        "Push = seamless, dangerous at fan-out N = 10^6.",
        "Pull = naturally load-sheds; hybrid switches on follower count."
      ]
    }
  ],

  keyTerms: [
    { term: "Parent type", def: "A like points at parentId plus an enum (post vs comment) instead of overloading the id string." },
    { term: "Activity table", def: "Small aggregate store (like counts per parent) so a news feed does not run COUNT(*) twenty times." },
    { term: "Follow graph", def: "One edge table (follower, followee, timestamp) answering both inbound and outbound neighbor queries." },
    { term: "Cluster snapshot", def: "Load balancer's periodic map of which feed box owns which hashed range; gateways cache it for ~10s." },
    { term: "Fan-out on write", def: "On each new post, push the item into every follower's precomputed top-20 queue instead of assembling the feed at read time." },
    { term: "Feed cache", def: "Hot per-user lists in memory; rebuilt from follow+posts on miss, crash, or cold user." },
    { term: "Push vs pull", def: "Server-initiated notify (WebSocket) versus client fetch. Pull survives celebrity-scale fan-out." },
    { term: "Hybrid fan-out", def: "Push to normal follower counts; pull or batched notify when the author is a celebrity." }
  ],

  tradeoffs: [
    { pro: "Precomputed top-20 makes feed reads a cache get.", con: "Writes now cost O(followers); celebrities need a different path." },
    { pro: "Keeping lists in cache keeps the feed service stateless and rebuildable.", con: "A cold user or a flush pays the expensive merge once; you need a backfill story." },
    { pro: "Gateway snapshots avoid a load-balancer hop on every mobile call.", con: "A 10-second-stale map can send to a box that just died until the next snapshot." },
    { pro: "Push notifications feel realtime for normal accounts.", con: "Polling is simpler but burns battery; pure push melts on mega-fan-out." },
    { pro: "Like counts in an activity table stay normalized.", con: "An extra hop vs denormalizing a counter on the post row (faster, messier)." }
  ],

  interviewTips: [
    "Confirm the four features. Do not volunteer Stories, Reels, or shopping unless they ask.",
    "Answer follow-graph immediately; spend the remaining time on feed generation and celebrities.",
    "Never propose COUNT(*) to decorate a 20-post feed — mention an activity/counter table.",
    "Walk naive (loop posts) → batch API → precompute so the interviewer sees you discarded the slow path on purpose.",
    "Say the list lives in cache with a recompute fallback; that defuses 'what if Redis dies?'.",
    "Name hybrid push/pull when they ask about a celebrity post. Batching is the other acceptable answer."
  ],

  scene: {
    nodes: [
      { id: "alice", label: "Alice", type: "phone", pos: [-10, 0, -5] },
      { id: "bob", label: "Bob", type: "phone", pos: [-10, 0, -1] },
      { id: "cara", label: "Cara", type: "phone", pos: [-10, 0, 3] },
      { id: "celeb", label: "Celebrity", type: "phone", pos: [-10, 0, 6.5] },
      { id: "nFeat", label: "Images, like/comment, follow, feed", type: "note", pos: [-5, 3.4, -7] },
      { id: "gw", label: "API Gateway", type: "gateway", pos: [-5.5, 0, 0], showAt: 4 },
      { id: "lb", label: "Load balancer", type: "lb", pos: [-5.5, 0, -5], showAt: 5 },
      { id: "nHash", label: "hash(userId) \u2192 feed box", type: "note", pos: [-2, 3.4, -6.5], showAt: 5 },
      { id: "feedZone", label: "User-feed cluster", type: "zone", pos: [0.5, 0, 0], size: [4, 12], showAt: 5 },
      { id: "uf1", label: "Feed box A", type: "server", pos: [0.5, 0, -4], showAt: 5 },
      { id: "uf2", label: "Feed box B", type: "server", pos: [0.5, 0, 0], showAt: 5 },
      { id: "uf3", label: "Feed box C", type: "server", pos: [0.5, 0, 4], showAt: 5 },
      { id: "posts", label: "Post svc", type: "service", pos: [5.5, 0, -4], showAt: 1 },
      { id: "postDb", label: "Posts DB", type: "db", pos: [10, 0, -4], showAt: 1 },
      { id: "imgcdn", label: "Images + CDN", type: "cdn", pos: [10, 0, 0], showAt: 1 },
      { id: "activity", label: "Activity svc", type: "service", pos: [5.5, 0, 7], showAt: 2 },
      { id: "follows", label: "Follow svc", type: "service", pos: [5.5, 0, 4], showAt: 3 },
      { id: "followDb", label: "Follows DB", type: "db", pos: [10, 0, 4], showAt: 3 },
      { id: "cache", label: "Feed cache", type: "cache", pos: [5.5, 0, 0], showAt: 8 },
      { id: "nNaive", label: "N follows = N post queries", type: "note", pos: [4, 3.4, -6.5], showAt: 6 },
      { id: "nFan", label: "Fan-out on write, top 20", type: "note", pos: [4, 3.4, 1.8], showAt: 8 },
      { id: "nCeleb", label: "Celeb: batch or pull", type: "note", pos: [4, 3.4, 6.2], showAt: 11 }
    ],
    edges: [
      { from: "alice", to: "posts", label: "upload", showAt: 1 },
      { from: "posts", to: "postDb", label: "row", showAt: 1 },
      { from: "posts", to: "imgcdn", label: "bytes", showAt: 1 },
      { from: "activity", to: "posts", label: "counts", showAt: 2, dashed: true },
      { from: "follows", to: "followDb", label: "edges", showAt: 3 },
      { from: "alice", to: "gw", label: "HTTPS", showAt: 4 },
      { from: "bob", to: "gw", label: "HTTPS", showAt: 4 },
      { from: "cara", to: "gw", label: "HTTPS", showAt: 4 },
      { from: "lb", to: "gw", label: "snapshot ~10s", showAt: 5, dashed: true },
      { from: "gw", to: "uf1", showAt: 5, dashed: true },
      { from: "gw", to: "uf2", label: "feed", showAt: 5 },
      { from: "gw", to: "uf3", showAt: 5, dashed: true },
      { from: "uf2", to: "follows", label: "who I follow", showAt: 6 },
      { from: "uf2", to: "posts", label: "get posts", showAt: 6 },
      { from: "posts", to: "uf2", label: "new post", showAt: 8 },
      { from: "uf2", to: "cache", label: "top-20", showAt: 8 },
      { from: "uf1", to: "cache", showAt: 8, dashed: true },
      { from: "uf3", to: "cache", showAt: 8, dashed: true },
      { from: "celeb", to: "gw", label: "post", showAt: 11 }
    ],
    steps: [
      {
        title: "Four features, then stop",
        text: "Alice, Bob, Cara, and a celebrity all use the same app. Confirm with the interviewer: photos in/out, like and comment, follow, news feed. Leave comment threads and Facebook Pages off the whiteboard.",
        highlight: ["alice", "bob", "cara", "celeb", "nFeat"]
      },
      {
        title: "Photos as files behind a CDN",
        text: "A post service stores the row (userId, timestamp, caption, file pointer). Bytes go to object/file storage in front of a CDN — the Tinder argument, reused. Feed generation must not drag image blobs through SQL.",
        highlight: ["alice", "posts", "postDb", "imgcdn"],
        flows: [
          { from: "alice", to: "posts", color: "#4ade80", label: "photo" },
          { from: "posts", to: "postDb", color: "#4ade80", label: "meta" },
          { from: "posts", to: "imgcdn", color: "#60a5fa", label: "file" }
        ]
      },
      {
        title: "Likes and comments",
        text: "Likes point at a parentId plus a type (post or comment). Do not COUNT(*) twenty times to paint a feed. An activity service holds per-parent aggregates; the likes table remains the list of who clicked.",
        highlight: ["activity", "posts", "alice"],
        flows: [
          { from: "alice", to: "activity", color: "#4ade80", label: "like" }
        ]
      },
      {
        title: "Follow graph in one table",
        text: "followerId, followeeId, timestamp. Equality on followee lists fans; equality on follower lists who I follow. Answer this in one breath so you can spend the hour on the feed.",
        highlight: ["follows", "followDb", "bob", "alice"],
        flows: [
          { from: "bob", to: "follows", color: "#4ade80", label: "follow Alice" },
          { from: "follows", to: "followDb", color: "#4ade80", label: "edge" }
        ]
      },
      {
        title: "Gateway at the edge",
        text: "Phones never address internal boxes. The gateway checks tokens, can translate HTTPS/XMPP into an internal protocol, and is the only process that speaks both public and private languages.",
        highlight: ["gw", "alice", "bob", "cara"],
        flows: [
          { from: "bob", to: "gw", color: "#4ade80", label: "GET feed" }
        ]
      },
      {
        title: "Snapshots and consistent hashing",
        text: "Many feed boxes run the same binary. A load balancer keeps a snapshot of the cluster and pushes it to gateways every ~10 seconds. hash(userId) picks which box owns that user's feed, so we are not asking the LB on every packet.",
        highlight: ["lb", "gw", "uf1", "uf2", "uf3", "nHash", "feedZone"],
        flows: [
          { from: "lb", to: "gw", color: "#c084fc", label: "snapshot" },
          { from: "gw", to: "uf2", color: "#4ade80", label: "hash(Bob)" }
        ]
      },
      {
        title: "Naive read: loop the graph",
        text: "Feed box asks follow service for Bob's followees, then calls posts once per person (or once with a set of ids), merges, returns top 20. Correct, chatty, and it slams the posts DB on every app open.",
        highlight: ["uf2", "follows", "posts", "nNaive"],
        flows: [
          { from: "uf2", to: "follows", color: "#60a5fa", label: "followees" },
          { from: "uf2", to: "posts", color: "#60a5fa", label: "posts x N" }
        ]
      },
      {
        title: "Precompute instead",
        text: "Batch APIs and result limits shrink the naive path but still recompute. The durable fix: keep each user's feed ready. A read is a single fetch of a list we already maintain.",
        highlight: ["uf2", "posts", "follows"],
        flows: [
          { from: "gw", to: "uf2", color: "#4ade80", label: "read" }
        ]
      },
      {
        title: "Fan-out on write",
        text: "Alice publishes. Posts service writes the row, then pings feed. Feed loads Alice's followers and prepends the post onto each of their queues (cap ~20). One write, many tiny list updates — not a full merge.",
        highlight: ["alice", "posts", "follows", "uf1", "uf2", "uf3", "cache", "nFan"],
        flows: [
          { from: "alice", to: "gw", color: "#4ade80", label: "post" },
          { from: "gw", to: "posts", color: "#4ade80", label: "persist" },
          { from: "posts", to: "uf2", color: "#fb923c", label: "notify" },
          { from: "uf2", to: "follows", color: "#60a5fa", label: "followers" },
          { from: "uf2", to: "cache", color: "#4ade80", label: "prepend" }
        ]
      },
      {
        title: "Lists live in cache",
        text: "Prefer memory. If a box dies, it is stateless — rebuild that user's top 20 from follow + posts. Keep hot (recently opened) feeds; a lurker who shows up once a month should not occupy RAM until they actually log in.",
        highlight: ["cache", "uf2", "bob"],
        flows: [
          { from: "bob", to: "gw", color: "#4ade80", label: "open app" },
          { from: "gw", to: "uf2", color: "#4ade80", label: "feed" },
          { from: "uf2", to: "cache", color: "#60a5fa", label: "hit" },
          { from: "cache", to: "uf2", color: "#60a5fa", label: "20 posts" }
        ]
      },
      {
        title: "Notify followers",
        text: "After a queue update, push to online followers (WebSockets; polling every 10s is the expensive fallback). Fan-out to tens of live sockets is a session/routing problem shared with chat. Ordinary accounts can take the push path.",
        highlight: ["uf2", "gw", "bob", "cara"],
        flows: [
          { from: "uf2", to: "gw", color: "#fb923c", label: "notify" },
          { from: "gw", to: "bob", color: "#fb923c", label: "push" },
          { from: "gw", to: "cara", color: "#fb923c", label: "push" }
        ]
      },
      {
        title: "Celebrities: hybrid pull",
        text: "A million-follower post cannot push a million notifies. Batch (rate-limit, e.g. 100–1000 every few seconds) or skip push and let fans pull when they open the app. Hybrid rule: push for normal authors, pull/batch for celebrities. That is the news-feed pattern Facebook, Twitter, and Instagram share.",
        highlight: ["celeb", "gw", "uf3", "cache", "nCeleb", "bob", "cara"],
        flows: [
          { from: "celeb", to: "gw", color: "#4ade80", label: "post" },
          { from: "gw", to: "posts", color: "#4ade80", label: "persist" },
          { from: "bob", to: "gw", color: "#60a5fa", label: "pull" },
          { from: "cara", to: "gw", color: "#60a5fa", label: "pull" }
        ]
      }
    ]
  }
});
