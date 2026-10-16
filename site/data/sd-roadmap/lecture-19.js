window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 19,
  title: "Sessions, JWT, OAuth 2.0, and OpenID Connect",
  video: "",
  category: "Reliability and Security",
  tagline: "Sessions live on the server. JWTs are portable claims. OAuth delegates access; OIDC logs you in.",
  summary: "A login cookie that maps to a server-side session is still the simplest way to revoke a user. JWTs move claims to the client so APIs can be stateless, at the cost of revocation and size. OAuth 2.0 is a delegation protocol — an app gets an access token to call an API as a user, not a login protocol by itself. OpenID Connect adds the ID token and userinfo so you can actually authenticate. Spring Security's oauth2Login and oauth2ResourceServer map onto these roles; mixing them up is how interview answers and production apps both leak.",

  theory: [
    {
      heading: "Server sessions: the cookie is a pointer",
      body: "The browser holds an opaque session id (HttpOnly, Secure, SameSite). The server stores user id, roles, and CSRF extras keyed by that id — Tomcat heap, Spring Session Redis, or a DB. Logout deletes the key; the cookie becomes useless. You can kick a stolen session. Cost: every request needs a lookup (cache it), and sticky or shared stores appear as in lecture 11. Classic Spring Security form login is this model. It is still the right default for a first-party monolith with a browser.",
      bullets: [
        "HttpOnly stops JavaScript from reading the cookie; it does not stop CSRF.",
        "Rotate the session id at login to block fixation.",
        "Revocation is a delete. That is the superpower JWTs give up."
      ]
    },
    {
      heading: "JWT: the cookie is the data",
      body: "A JSON Web Token is three base64url parts: header, payload, signature (or encryption if JWE). The resource server checks <code>sig</code> with a JWT secret or the issuer's JWKS and trusts <code>sub</code>, <code>exp</code>, <code>scope</code> without a session GET. That is why microservices like them. Downsides: you cannot kill a token before <code>exp</code> without a denylist (which is a session store by another name), payloads bloat every request, and <code>alg=none</code> or a confused key is a famous class of bugs. Access tokens should be minutes long. Put stable identity in the token; put changeable authorization in a lookup if you revoke often. Spring: <code>spring.security.oauth2.resourceserver.jwt.jwk-set-uri</code>.",
      bullets: [
        "Sign with RS256 and rotate keys via JWKS; do not copy HS256 secrets to every service.",
        "Never stuff PII you would not put in a log; JWTs leak in browser storage and proxies.",
        "A refresh token is a long-lived credential. Treat it like a session id: server-side, rotatable, revocable."
      ]
    },
    {
      heading: "OAuth 2.0 delegates access",
      body: "OAuth roles: <b>resource owner</b> (the user), <b>client</b> (your app), <b>authorization server</b> (issues tokens), <b>resource server</b> (the API). The user is not \"logging into the client with OAuth\"; they are allowing the client to call the API. The <b>authorization code + PKCE</b> flow is the default for browsers and mobile: client redirects to the authz server, user consents, client gets a one-time code, then exchanges it (with PKCE verifier) for tokens. Implicit flow is obsolete. Client credentials is machine-to-machine, no user. Password grant is deprecated. Scopes are strings the access token carries (<code>orders.read</code>). In Spring, the client uses <code>oauth2Login</code> or <code>OAuth2AuthorizedClient</code>; the API uses <code>oauth2ResourceServer</code>. They are different apps in the protocol even if they share a repo.",
      bullets: [
        "PKCE stops an attacker who steals the redirect code from exchanging it.",
        "Redirect URIs must be exact; open redirects mint tokens for the wrong origin.",
        "An access token is not proof of authentication for your app's own pages — that is OIDC."
      ]
    },
    {
      heading: "OIDC is identity on top of OAuth",
      body: "<b>OpenID Connect</b> adds an <code>openid</code> scope and an <b>ID token</b> (a JWT about the user: iss, sub, aud, exp, nonce). The client uses the ID token to start a local session. UserInfo endpoint fills profile claims. That is \"Sign in with Google.\" OAuth without OIDC can give you an access token to Google Drive and still not tell you who signed in in a standard way. Always validate <code>aud</code> (this client), <code>iss</code>, <code>nonce</code>, and <code>exp</code> on the ID token. Then drop the ID token; keep a server session or a short access token. Using a Google ID token as an API credential to <i>your</i> resource server is usually wrong — your API should mint or introspect its own.",
      bullets: [
        "ID token → client. Access token → resource server. Do not swap them.",
        "nonce binds the ID token to the browser request that started the flow.",
        "Account linking (same email, different iss) is a product decision and a security footgun."
      ]
    },
    {
      heading: "A Spring picture that does not confuse the roles",
      body: "Browser talks to <code>shop-web</code>. <code>shop-web</code> is an OAuth client: <code>oauth2Login()</code> against Keycloak/Auth0/Google (the authorization server). After OIDC it creates a Spring session. <code>shop-web</code> calls <code>order-api</code> with a short access token (token relay). <code>order-api</code> is a resource server: JWT decoder, <code>@PreAuthorize(\"hasAuthority('SCOPE_orders.read')\")</code>. Logout: kill the session and, if you issued refresh tokens, revoke them at the authz server. For first-party mobile, use authorization code + PKCE with a custom URL scheme or claimed HTTPS, store refresh tokens in the OS keychain, not in SharedPreferences in the clear.",
      bullets: [
        "BFF (backend-for-frontend) keeps tokens off the SPA; the browser only sees a session cookie.",
        "SPAs that store access tokens in localStorage lose to XSS; prefer BFF.",
        "Service-to-service: client credentials or mTLS, not a user JWT forwarded forever."
      ]
    }
  ],

  keyTerms: [
    { term: "Session", def: "Server-side record keyed by an opaque cookie. Logout is a delete." },
    { term: "JWT", def: "Signed (or encrypted) JSON claims the bearer presents; verified with a key, not a session GET." },
    { term: "Access token", def: "Credential a client sends to a resource server. Should be short-lived." },
    { term: "Refresh token", def: "Long-lived credential used at the authorization server to mint new access tokens; must be revocable." },
    { term: "Authorization code + PKCE", def: "Browser/mobile OAuth flow that exchanges a one-time code with a proof key." },
    { term: "Resource server", def: "API that accepts access tokens and enforces scopes." },
    { term: "ID token", def: "OIDC JWT issued to the client asserting who authenticated." },
    { term: "JWKS", def: "JSON Web Key Set published by the issuer so resource servers can verify RS256 signatures and rotate keys." },
    { term: "BFF", def: "Backend-for-frontend that holds tokens server-side and gives the browser a cookie." }
  ],

  tradeoffs: [
    { pro: "Server sessions revoke instantly and stay small on the wire.", con: "You need a shared session store the moment you have more than one JVM." },
    { pro: "JWTs let APIs verify locally and scale without a session hop.", con: "Revocation before expiry needs a denylist, and tokens bloat and leak." },
    { pro: "OAuth 2.0 lets a user grant a client scoped API access without sharing a password.", con: "Flows, redirect URIs, and token storage are easy to get dangerously wrong." },
    { pro: "OIDC standardizes login (ID token, userinfo) on top of OAuth.", con: "People still treat access tokens as login proof or ID tokens as API keys." },
    { pro: "BFF keeps tokens out of JavaScript.", con: "You operate a session-bearing web tier again — which is often worth it." }
  ],

  interviewTips: [
    "Ask whether the problem is login (OIDC/session) or delegated API access (OAuth), then pick the flow.",
    "Say authorization code + PKCE for browsers and mobile; mention implicit as obsolete.",
    "When they say JWT, immediately cover expiry, JWKS, and how you revoke (short TTL + refresh, or denylist).",
    "Draw four boxes: browser, client, authorization server, resource server — then place Spring Security on two of them.",
    "Prefer a BFF session cookie for first-party SPAs over localStorage access tokens."
  ],

  scene: {
    nodes: [
      { id: "br", label: "Browser", type: "phone", pos: [-11, 0, 0] },
      { id: "web", label: "shop-web (client)", type: "gateway", pos: [-4, 0, 0] },
      { id: "sess", label: "Session Redis", type: "cache", pos: [-4, 0, 5], showAt: 1 },
      { id: "as", label: "Authz server", type: "service", pos: [3, 0, -4], showAt: 3 },
      { id: "api", label: "order-api", type: "server", pos: [4, 0, 3], showAt: 2 },
      { id: "jwks", label: "JWKS", type: "point", pos: [7, 0, -4], showAt: 2 },
      { id: "nSess", label: "cookie is a pointer", type: "note", pos: [-11, 0, 5], showAt: 1 },
      { id: "nJwt", label: "JWT: claims + sig, short exp", type: "note", pos: [4, 0, 6.5], showAt: 2 },
      { id: "nPkce", label: "code + PKCE, not implicit", type: "note", pos: [3, 0, -7], showAt: 4 },
      { id: "nOidc", label: "ID token to client only", type: "note", pos: [8, 0, 0], showAt: 5 },
      { id: "idP", label: "IdP userinfo", type: "db", pos: [8, 0, -4], showAt: 5 }
    ],
    edges: [
      { from: "br", to: "web", label: "HTTPS" },
      { from: "web", to: "sess", showAt: 1 },
      { from: "web", to: "api", showAt: 2 },
      { from: "api", to: "jwks", showAt: 2, dashed: true },
      { from: "br", to: "as", showAt: 3 },
      { from: "web", to: "as", showAt: 3 },
      { from: "as", to: "idP", showAt: 5 }
    ],
    steps: [
      {
        title: "First-party form login",
        text: "The browser talks only to shop-web. That is enough for a monolith. The next steps add a session store, an API, and an identity provider without mixing their jobs.",
        highlight: ["br", "web"],
        flows: [{ from: "br", to: "web", color: "#4ade80", label: "login" }]
      },
      {
        title: "Opaque session cookie",
        text: "shop-web sets an HttpOnly cookie. Redis holds the user and roles. Logout deletes the key — stolen cookies die with the record. This is still the revocation gold standard.",
        highlight: ["web", "sess", "nSess", "br"],
        flows: [
          { from: "br", to: "web", color: "#4ade80", label: "cookie" },
          { from: "web", to: "sess", color: "#facc15", label: "GET sid" }
        ]
      },
      {
        title: "API verifies a JWT",
        text: "order-api is a resource server. It checks the access token signature against JWKS and trusts sub/scope until exp. No session GET on the hot path. Revoke-before-exp needs extra work.",
        highlight: ["api", "jwks", "nJwt", "web"],
        flows: [
          { from: "web", to: "api", color: "#4ade80", label: "Bearer" },
          { from: "api", to: "jwks", color: "#c084fc", label: "verify" }
        ]
      },
      {
        title: "OAuth: user delegates",
        text: "The user is sent to the authorization server to consent. shop-web is the client. order-api is the resource. The authz server is neither of your business services.",
        highlight: ["br", "as", "web", "api"],
        flows: [
          { from: "br", to: "as", color: "#60a5fa", label: "consent" },
          { from: "as", to: "web", color: "#60a5fa", label: "code" }
        ]
      },
      {
        title: "Authorization code + PKCE",
        text: "The client exchanges the code with a PKCE verifier for tokens. Implicit is obsolete. Redirect URIs are exact. This is the only browser/mobile flow you should draw.",
        highlight: ["web", "as", "nPkce"],
        flows: [{ from: "web", to: "as", color: "#4ade80", label: "code+verifier" }]
      },
      {
        title: "OIDC issues an ID token",
        text: "openid scope yields an ID token for shop-web (iss, aud, nonce). That is login. Userinfo fills the profile. The ID token is not sent to order-api.",
        highlight: ["as", "idP", "nOidc", "web"],
        flows: [
          { from: "as", to: "web", color: "#c084fc", label: "id_token" },
          { from: "as", to: "idP", color: "#60a5fa", label: "userinfo" }
        ]
      },
      {
        title: "BFF keeps tokens off the SPA",
        text: "The browser keeps the session cookie. shop-web stores refresh tokens and relays short access tokens to order-api. XSS in the page cannot exfiltrate the refresh token.",
        highlight: ["br", "web", "sess", "api"],
        flows: [
          { from: "br", to: "web", color: "#4ade80", label: "cookie" },
          { from: "web", to: "api", color: "#4ade80", label: "access" }
        ]
      },
      {
        title: "Logout and refresh",
        text: "Delete the session, rotate/revoke refresh tokens at the authz server, keep access tokens short. Sessions revoke; JWTs expire; OAuth delegates; OIDC authenticates. Name each job.",
        highlight: ["sess", "as", "web", "nJwt"],
        flows: [
          { from: "web", to: "sess", color: "#f87171", label: "DEL" },
          { from: "web", to: "as", color: "#f87171", label: "revoke" }
        ]
      }
    ]
  }
});
