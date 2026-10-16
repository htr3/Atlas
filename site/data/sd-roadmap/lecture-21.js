window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 21,
  title: "Secrets, Encryption, and Common Web Attacks",
  video: "",
  category: "Reliability and Security",
  tagline: "Keep keys out of git, encrypt in motion and at rest, and treat XSS, CSRF, and injection as design bugs.",
  summary: "A Spring service that works is still a liability if the database password lives in application.yml, passwords are stored as reversible ciphertext, or every query is built with string concat. Secrets belong in a vault with rotation. TLS covers the wire; disk encryption and column encryption cover rest. Hash credentials, never encrypt them for lookup. Most web attacks are the same three mistakes: trusting input, trusting the browser, and trusting the URL the server itself fetches.",

  theory: [
    {
      heading: "A secret is not a config value",
      body: "Hostnames, pool sizes, and feature flags can sit in Git. Database passwords, signing keys, and API tokens cannot. Once a key is in a commit it is in every laptop clone, every CI log, and every backup. Put the name of the secret in config (<code>DB_PASSWORD</code>) and the value in a vault: AWS Secrets Manager, HashiCorp Vault, or a Kubernetes Secret mounted as an env var that never prints. Spring Boot's <code>spring.config.import=aws-secretsmanager:</code> or a <code>PropertySource</code> that calls the vault at boot is the production pattern. Logging <code>Environment.getProperty(\"spring.datasource.password\")</code> on startup is how keys leak into CloudWatch.",
      bullets: [
        "Rotate on a schedule and on suspicion. Callers should fetch, not cache forever.",
        "Separate encrypting keys from data keys. A leaked row should not decrypt the table.",
        "CI needs short-lived tokens, not a long-lived admin key in a pipeline variable named PROD."
      ]
    },
    {
      heading: "Encryption in transit is not encryption at rest",
      body: "<b>TLS</b> stops a coffee-shop attacker from reading the HTTP body. It does nothing once the bytes land on disk. A stolen snapshot, an over-permissive S3 object, or a replica in another account is plaintext unless you encrypt at rest. Disk-level encryption (AWS EBS, RDS storage encryption) protects the volume. Application-level encryption of a column (a national ID, a refresh token) protects the value even from a DBA who can SELECT. In Spring, TLS is a load-balancer or Tomcat connector problem; column encryption is a <code>Converter</code> or a KMS envelope around the field, not a hope that HTTPS was enough.",
      bullets: [
        "HTTPS to the load balancer and HTTP inside the VPC is a choice you must name, not an accident.",
        "Envelope encryption: a data key encrypts the blob; KMS encrypts the data key.",
        "Clock skew and expired certs are availability bugs. Monitor days-to-expiry."
      ]
    },
    {
      heading: "Hash passwords. Encrypt tokens. Never swap them.",
      body: "A password must be <b>hashed</b> with a slow KDF so a stolen table does not become a login list. Spring Security's <code>BCryptPasswordEncoder</code> (or Argon2) is the default for a reason: bcrypt is deliberately expensive and salted. Do not use SHA-256 \"because it is a hash.\" SHA-256 is fast; GPUs love it. A refresh token or a national ID is different: you may need the original bytes later, so you <b>encrypt</b> with a key you hold in KMS. Encrypting a password so you can \"email it back\" is a product bug. If you cannot decrypt a password, you cannot accidentally print it.",
      bullets: [
        "<code>passwordEncoder.matches(raw, stored)</code> — never reconstruct the password.",
        "JWT signing keys are secrets. Putting the HMAC secret in the repo signs forgeries.",
        "A pepper (a server-side secret mixed into the hash) helps if the table leaks without the app."
      ]
    },
    {
      heading: "Injection, XSS, and CSRF are input-trust bugs",
      body: "<b>SQL injection</b> is string-building a query. <code>\"SELECT * FROM users WHERE id = \" + id</code> lets <code>1 OR 1=1</code> through. JPA, <code>JdbcTemplate</code> with <code>?</code> placeholders, and <code>@Query</code> with named params close it. String-concatenating JPQL is the same hole. <b>XSS</b> is storing or reflecting HTML that the browser executes. Encode on output; a <code>@RequestBody String comment</code> written into Thymeleaf without escaping is a stored script. Content-Security-Policy is a second fence, not the first. <b>CSRF</b> is a logged-in cookie sent by a hostile form on another origin. Cookie sessions need a CSRF token (Spring Security's default for cookie auth). A Bearer JWT in an <code>Authorization</code> header is not sent automatically by a foreign form, which is why SPA token auth and cookie auth have different CSRF stories.",
      bullets: [
        "Parameterized queries. No exceptions for \"admin-only\" reports.",
        "Encode HTML on render. Sanitize rich text with an allow-list, not a deny-list of tags.",
        "SameSite=Lax cookies reduce CSRF; they do not replace a token on state-changing POSTs."
      ]
    },
    {
      heading: "SSRF and the server as a confused deputy",
      body: "The app fetches a URL the user supplied: a webhook, an image preview, an Open Graph crawler. That is <b>SSRF</b>. The server has VPC access the browser does not. <code>http://169.254.169.254/</code> is the cloud metadata endpoint; a naive <code>RestTemplate.getForObject(userUrl, byte[].class)</code> can steal IAM credentials. Allow-list schemes and hosts. Block link-local, private, and metadata ranges. Do not follow redirects to a second URL you did not check. Treat the HTTP client as an attacker-controlled socket.",
      bullets: [
        "Resolve DNS and check the IP after resolve. DNS rebinding is a real bypass.",
        "Webhooks should be signed and should not target your own admin network.",
        "File uploads that take a URL are SSRF with extra steps."
      ]
    },
    {
      heading: "Spring Security is a default, not a design",
      body: "<code>spring-boot-starter-security</code> turns on auth and CSRF for cookie sessions. That is useful and incomplete. You still choose a filter chain: which paths are public, which need a role, whether you use sessions or JWTs, and how you load users. Method security (<code>@PreAuthorize(\"hasAuthority('order:write')\")</code>) belongs next to the use case, not only at the controller, so a second entry point cannot skip the check. CORS is not CSRF and not auth: a <code>*</code> origin with credentials is how a browser attack reads your JSON. Fail closed. Log auth failures as metrics, not as a stack trace that includes the password.",
      bullets: [
        "Public health endpoints and actuator should not share the app's secret surface.",
        "Disable default users. A generated password in the boot log is a finding.",
        "Rate-limit login. Bcrypt is slow; that is also a CPU DoS if you do not cap attempts."
      ]
    }
  ],

  keyTerms: [
    { term: "Secret", def: "A value that grants access (password, signing key, token). It lives in a vault, not in Git." },
    { term: "TLS", def: "Encryption in transit. Stops a network observer; does not encrypt the database file." },
    { term: "Envelope encryption", def: "A data key encrypts the payload; KMS encrypts that key so rotation is a metadata change." },
    { term: "KDF / bcrypt", def: "A slow salted hash for passwords so a stolen table is expensive to crack." },
    { term: "SQL injection", def: "Untrusted input that becomes SQL. Closed by parameters, not by filtering quotes." },
    { term: "XSS", def: "Untrusted HTML or JS that runs in another user's browser." },
    { term: "CSRF", def: "A foreign site triggers a state-changing request using the victim's cookies." },
    { term: "SSRF", def: "The server fetches an attacker-chosen URL with the server's network privileges." }
  ],

  tradeoffs: [
    { pro: "Vault-backed secrets rotate without a code change.", con: "Boot now depends on the vault. A vault outage is an app outage unless you cache with TTL and a circuit." },
    { pro: "TLS everywhere including east-west traffic stops internal sniffing.", con: "Cert churn and mTLS identity become an operations problem." },
    { pro: "Bcrypt makes stolen password tables painful to attack.", con: "Each login costs CPU. Unbounded login attempts become a self-DoS." },
    { pro: "Cookie sessions plus CSRF tokens are well supported in Spring Security.", con: "SPAs and mobile clients often prefer Bearer tokens, which change the CSRF and storage story." },
    { pro: "Column encryption protects a stolen dump.", con: "You lose the ability to index or query that column in the database." }
  ],

  interviewTips: [
    "Separate secrets, hashing, and encryption. Interviewers fail people who encrypt passwords or put keys in Git.",
    "Name TLS for the wire and a second control for disk. Do not say HTTPS and stop.",
    "For SQL injection, say parameterized queries. For XSS, encode on output. For CSRF, say cookie vs Authorization header.",
    "Mention SSRF against cloud metadata if the design fetches user-supplied URLs.",
    "In Spring, point at BCryptPasswordEncoder, CSRF defaults, and @PreAuthorize on the use case, not only on the controller."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Browser", type: "user", pos: [-11, 0, -2] },
      { id: "atk", label: "Attacker", type: "user", pos: [-11, 0, 3], color: "#f87171" },
      { id: "gw", label: "TLS gateway", type: "gateway", pos: [-6, 0, 0] },
      { id: "app", label: "Spring app", type: "service", pos: [-1, 0, 0] },
      { id: "kms", label: "KMS / Vault", type: "storage", pos: [-1, 0, 4.5], showAt: 1 },
      { id: "db", label: "Users DB", type: "db", pos: [5, 0, 0], showAt: 2 },
      { id: "meta", label: "Cloud metadata", type: "server", pos: [5, 0, 5], showAt: 6 },
      { id: "vpc", label: "Private network", type: "zone", pos: [2, 0, 2.4], size: [12, 10], showAt: 1 },
      { id: "n0", label: "HTTPS on the wire", type: "note", pos: [-6, 0, -6] },
      { id: "n1", label: "Secret from vault, not git", type: "note", pos: [-1, 0, -6], showAt: 1 },
      { id: "n2", label: "Parameterized query", type: "note", pos: [5, 0, -6], showAt: 3 },
      { id: "n3", label: "Encode HTML on render", type: "note", pos: [9, 0, -2], showAt: 4 },
      { id: "n4", label: "CSRF token on cookie POST", type: "note", pos: [9, 0, 2], showAt: 5 },
      { id: "n5", label: "Block 169.254.169.254", type: "note", pos: [9, 0, 5], showAt: 6 }
    ],
    edges: [
      { from: "user", to: "gw", label: "HTTPS" },
      { from: "gw", to: "app" },
      { from: "app", to: "kms", label: "fetch secret", showAt: 1 },
      { from: "app", to: "db", showAt: 2 },
      { from: "atk", to: "gw", label: "forged POST", showAt: 3, dashed: true },
      { from: "app", to: "meta", label: "SSRF?", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "TLS to the edge",
        text: "The browser talks HTTPS to the gateway. A network observer cannot read the body. That is encryption in transit only. The app still has to decide what happens to secrets and to stored bytes.",
        highlight: ["user", "gw", "n0"],
        flows: [{ from: "user", to: "gw", color: "#4ade80", label: "TLS" }]
      },
      {
        title: "Secrets come from a vault",
        text: "At boot the Spring app asks KMS or Vault for the database password. The name of the secret is in config. The value is not in Git, not in a screenshot of application.yml, and not in a CI log.",
        highlight: ["app", "kms", "vpc", "n1"],
        flows: [{ from: "kms", to: "app", color: "#c084fc", label: "secret" }]
      },
      {
        title: "Hash at rest, talk over TLS",
        text: "The users table stores bcrypt hashes, not reversible passwords. Disk encryption covers a stolen volume. Column encryption is reserved for values you must later recover, such as a refresh token.",
        highlight: ["app", "db", "gw"],
        flows: [{ from: "app", to: "db", color: "#60a5fa", label: "bcrypt hash" }]
      },
      {
        title: "SQL injection dies at the parameter",
        text: "The attacker sends id=1 OR 1=1. JdbcTemplate with a placeholder sends the string as data. Concatenating JPQL would have returned the whole table. Parameterize every query, including the admin report.",
        highlight: ["atk", "app", "db", "n2"],
        flows: [
          { from: "atk", to: "gw", color: "#f87171", label: "1 OR 1=1" },
          { from: "app", to: "db", color: "#4ade80", label: "?" }
        ]
      },
      {
        title: "XSS is an output bug",
        text: "A comment containing a script tag is stored as text. On render, Thymeleaf or a JSON client encodes it so the next user's browser does not execute it. A Content-Security-Policy is a second fence.",
        highlight: ["user", "app", "n3"],
        flows: [{ from: "app", to: "user", color: "#60a5fa", label: "escaped HTML" }]
      },
      {
        title: "CSRF needs a token for cookies",
        text: "A hostile page tries to POST using the victim's session cookie. Spring Security's CSRF token is missing, so the gateway rejects it. A Bearer token in Authorization is not auto-sent by that form, which is a different design.",
        highlight: ["atk", "gw", "n4"],
        fail: ["atk"],
        flows: [{ from: "atk", to: "gw", color: "#f87171", label: "no CSRF" }]
      },
      {
        title: "SSRF is the server as deputy",
        text: "A preview URL of http://169.254.169.254/ would steal cloud credentials. The HTTP client allow-lists hosts and blocks link-local and metadata ranges. RestTemplate is not a browser.",
        highlight: ["app", "meta", "n5"],
        fail: ["meta"],
        flows: [{ from: "app", to: "meta", color: "#f87171", label: "blocked" }]
      },
      {
        title: "Rotate after a leak",
        text: "A key that might have been in a log is dead. Issue a new data key in KMS, re-wrap, revoke the old one, and restart pods so they fetch the new secret. Rotation is a design, not a ticket you write after the breach.",
        highlight: ["kms", "app", "db", "n1"],
        flows: [
          { from: "kms", to: "app", color: "#c084fc", label: "new key" },
          { from: "app", to: "db", color: "#4ade80", label: "rewrapped" }
        ]
      }
    ]
  }
});
