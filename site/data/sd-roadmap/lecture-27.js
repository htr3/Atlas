window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 27,
  title: "File Uploads, Presigned URLs, and Object Lifecycle",
  video: "",
  category: "Operations",
  tagline: "Do not stream gigabytes through Tomcat. Sign a URL, upload to object storage, then scan and expire.",
  summary: "User files (avatars, invoices, videos) belong in object storage, not on a pod disk and not as a MultipartFile copied through the API heap. The Spring app authenticates the user, decides a key and content type, and returns a short-lived presigned PUT or POST URL. The browser uploads directly to S3 or GCS. A notification triggers virus scan, transcoding, and a CDN invalidation. Lifecycle rules move cold objects to cheaper storage and delete what the product promised to delete.",

  theory: [
    {
      heading: "The API is a terrible file pipe",
      body: "<code>MultipartFile</code> in a Spring controller looks easy and then fails in three ways. A 2 GB video fills the Tomcat heap or a temp disk on one pod. Load balancers time out. You pay to move bytes through the JVM that the object store would have taken from the client. Horizontal scaling of uploads becomes sticky and expensive. The API's job is authorization and metadata: who may write which key, max size, allowed MIME types. The bytes should not enter the service. Exception: tiny avatars in a trusted admin tool. Default: direct-to-bucket.",
      bullets: [
        "Pod disks are ephemeral. A saved file on /tmp dies with the replica.",
        "Chunked or multipart upload for large objects; one PUT for small ones.",
        "Never trust the client Content-Type as a security boundary. Check magic bytes after landing."
      ]
    },
    {
      heading: "Presigned URLs are capability tokens for one object",
      body: "A <b>presigned URL</b> is an HMAC'd GET or PUT for a specific key, method, and expiry (minutes, not days). Spring uses the AWS SDK <code>S3Presigner</code> (or GCS equivalent) with the bucket's IAM role. The client receives the URL, not your long-lived access key. Constraints: content-type and content-length should be part of the signature when the SDK allows it, or a malicious client uploads a 50 GB ISO as \"avatar.png.\" PUT is simple. POST with a policy document is stricter for browsers. Download URLs are separate and even shorter if the object is private. A CDN in front of public objects should not be a 7-day presign of a private medical PDF.",
      bullets: [
        "Expire in minutes. A leaked URL should die.",
        "Key layout: tenant/user/uuid, not user-supplied filenames as paths.",
        "CORS on the bucket must allow the web origin; that is not the Spring CORS config."
      ]
    },
    {
      heading: "After the object lands: events, scan, publish",
      body: "S3 can emit ObjectCreated. A worker (Spring @KafkaListener or a Lambda) reads the key, virus-scans, inspects the real MIME type, and writes a row: status=clean, public URL or CloudFront path. Until that row exists, the product must not show the file. Thumbnails and transcodes are more workers, not the upload request. Idempotency on the key: the event will retry. If the scan fails, delete or quarantine the object; do not leave an executable in a public prefix. Signed GET for private files; CDN for public, cacheable, already-scanned blobs.",
      bullets: [
        "Metadata in Postgres; bytes in the bucket. The database is not a blob store.",
        "Quarantine prefix vs public prefix. IAM should make public writes impossible except via the pipeline.",
        "The client polls a status endpoint or gets a websocket/event. Do not busy-wait the PUT."
      ]
    },
    {
      heading: "Lifecycle: hot, cold, gone",
      body: "Object stores bill for volume, requests, and retrieval. A <b>lifecycle rule</b> is a policy: after 30 days move to infrequent access, after 90 to archive, after the retention period delete. Product requirements (GDPR delete, legal hold) must be encoded here, not in a hope that someone runs a cron. Versioning protects against overwrite accidents and makes delete a tombstone until you expire versions. Multipart abandoned uploads also cost money; expire incomplete uploads after a day. Spring does not replace these rules. It may tag objects (<code>retention=7y</code>) that the lifecycle filters on.",
      bullets: [
        "Archive is cheap and slow. A user-facing image does not belong in Glacier.",
        "Deletes must hit both the metadata row and the object (and CDN cache).",
        "Legal hold is a flag that must block the lifecycle delete."
      ]
    },
    {
      heading: "Threats unique to uploads",
      body: "Path traversal in keys (<code>../../</code>), overwriting another tenant's object, SVG/HTML uploaded as images (XSS when served from your cookie domain), zip bombs, and using the bucket as free hosting. Serve user content from a separate domain (no session cookies). Disable bucket listing. Block public ACLs; use CloudFront OAC or a signed cookie. Rate-limit presign issuance so a logged-in user cannot mint a million URLs. SSRF is the cousin: do not fetch a user URL into the bucket with the app's IAM role without the allow-list from the security lecture.",
      bullets: [
        "Content-Disposition and a safe content-type on GET.",
        "Per-tenant prefix plus IAM conditions beat a single flat bucket of names.",
        "Virus scan is not optional for anything that other users will download."
      ]
    }
  ],

  keyTerms: [
    { term: "Object storage", def: "A blob store (S3, GCS) addressed by bucket and key, not a POSIX disk." },
    { term: "Presigned URL", def: "A time-limited signed GET or PUT for one key so the client never holds your cloud secret." },
    { term: "Multipart upload", def: "Split a large object into parts, upload in parallel, complete as one key." },
    { term: "ObjectCreated", def: "The bucket event that starts scan and processing after a successful PUT." },
    { term: "Lifecycle rule", def: "Time-based transition to colder storage or deletion, driven by prefix and tags." },
    { term: "Quarantine", def: "A private prefix for unscanned or failed objects that the CDN cannot serve." },
    { term: "Separate cookie domain", def: "Serve user files from a host that does not receive the app session cookie." }
  ],

  tradeoffs: [
    { pro: "Presigned PUT keeps gigabytes off Tomcat and the load balancer.", con: "You now own CORS, expiry, and a status protocol the client must poll." },
    { pro: "Event-driven scan keeps the upload path fast.", con: "Users see 'processing' and you must handle duplicate ObjectCreated events." },
    { pro: "Lifecycle rules cut storage cost without app traffic.", con: "A wrong prefix transition can archive a hot avatar or delete too soon." },
    { pro: "Public CDN for clean images is cheap and fast.", con: "A public prefix plus a missed scan is a malware host on your domain." }
  ],

  interviewTips: [
    "Say the browser uploads to S3 with a presigned URL. The API never sees the bytes.",
    "Name expiry, content-type, and a tenant-prefixed key. Mention CORS on the bucket.",
    "ObjectCreated → scan worker → metadata row. Do not serve until clean.",
    "Lifecycle is a bucket policy, not a Spring @Scheduled that lists the world.",
    "Call out XSS via uploaded HTML and serving user content on a cookieless domain."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Phone", type: "phone", pos: [-11, 0, 0] },
      { id: "api", label: "Spring API", type: "service", pos: [-6, 0, 0] },
      { id: "db", label: "Metadata DB", type: "db", pos: [-6, 0, 4.5], showAt: 1 },
      { id: "s3", label: "Object bucket", type: "storage", pos: [1, 0, 0], showAt: 2 },
      { id: "q", label: "ObjectCreated", type: "queue", pos: [1, 0, 4.5], showAt: 4 },
      { id: "scan", label: "Scan worker", type: "worker", pos: [6.5, 0, 4.5], showAt: 4 },
      { id: "cdn", label: "CDN", type: "cdn", pos: [6.5, 0, 0], showAt: 6 },
      { id: "cold", label: "Archive", type: "storage", pos: [11, 0, 0], showAt: 7 },
      { id: "n0", label: "Bytes never hit Tomcat", type: "note", pos: [-6, 0, -6.5] },
      { id: "n1", label: "URL dies in minutes", type: "note", pos: [1, 0, -6.5], showAt: 2 },
      { id: "n2", label: "Serve only after clean", type: "note", pos: [6.5, 0, -6.5], showAt: 5 }
    ],
    edges: [
      { from: "phone", to: "api", label: "auth" },
      { from: "api", to: "db", showAt: 1 },
      { from: "phone", to: "s3", label: "PUT", showAt: 3 },
      { from: "s3", to: "q", showAt: 4 },
      { from: "q", to: "scan", showAt: 4 },
      { from: "scan", to: "db", showAt: 5, dashed: true },
      { from: "cdn", to: "s3", showAt: 6 },
      { from: "s3", to: "cold", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Ask to upload, not to stream",
        text: "The phone requests a slot: filename, declared type, size. The Spring API authenticates and refuses 20 GB avatars. No multipart body hits Tomcat.",
        highlight: ["phone", "api", "n0"],
        flows: [{ from: "phone", to: "api", color: "#4ade80", label: "authorize" }]
      },
      {
        title: "Metadata row first",
        text: "Insert a row: key = tenant/user/uuid, status=pending, max size. The database holds truth about the file. The bucket will hold bytes. A pod disk holds neither.",
        highlight: ["api", "db"],
        flows: [{ from: "api", to: "db", color: "#c084fc", label: "pending" }]
      },
      {
        title: "Mint a presigned PUT",
        text: "S3Presigner returns a URL bound to that key, PUT, content-type, and a five-minute expiry. The app's cloud secret never leaves the server. CORS is configured on the bucket.",
        highlight: ["api", "s3", "n1", "phone"],
        flows: [{ from: "api", to: "phone", color: "#60a5fa", label: "signed URL" }]
      },
      {
        title: "Client writes the bucket",
        text: "The phone PUTs bytes straight to object storage. The load balancer and JVM do not see the gigabytes. An abandoned multipart is expired by a bucket rule later.",
        highlight: ["phone", "s3"],
        flows: [{ from: "phone", to: "s3", color: "#4ade80", label: "bytes" }]
      },
      {
        title: "ObjectCreated fans out",
        text: "The bucket emits an event. A worker picks it up. Retries will happen; the handler is idempotent on the key. This is the same fan-out idea, applied to files.",
        highlight: ["s3", "q", "scan"],
        flows: [
          { from: "s3", to: "q", color: "#fb923c", label: "created" },
          { from: "q", to: "scan", color: "#fb923c", label: "scan" }
        ]
      },
      {
        title: "Quarantine until clean",
        text: "The worker checks magic bytes and malware. On failure the object stays in a private prefix. On success the metadata row becomes clean. The product still does not serve a pending file.",
        highlight: ["scan", "db", "s3", "n2"],
        flows: [{ from: "scan", to: "db", color: "#4ade80", label: "clean" }]
      },
      {
        title: "CDN for public clean objects",
        text: "Thumbnails and public images go through a CDN on a cookieless domain. Private invoices stay behind short signed GETs. XSS via uploaded HTML does not inherit the app session.",
        highlight: ["cdn", "s3", "phone"],
        flows: [{ from: "phone", to: "cdn", color: "#60a5fa", label: "GET" }]
      },
      {
        title: "Lifecycle moves and deletes",
        text: "After 90 days, cold invoices transition to archive. GDPR delete removes the metadata row, the object, and the CDN cache. A Spring cron that lists the bucket is not a lifecycle policy.",
        highlight: ["s3", "cold", "db"],
        flows: [{ from: "s3", to: "cold", color: "#c084fc", label: "transition" }]
      }
    ]
  }
});
