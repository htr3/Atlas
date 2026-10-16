window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 20,
  title: "RBAC, ABAC, and Multi-Tenant Isolation",
  video: "",
  category: "Reliability and Security",
  tagline: "Roles are coarse. Attributes are precise. Tenants must not share rows by accident.",
  summary: "Authorization is not authentication. RBAC maps users to roles to permissions and fails when the rule is \"this manager, this region, this hour.\" ABAC evaluates attributes of user, resource, action, and environment and needs a policy engine. Multi-tenancy is isolation: separate databases, separate schemas, or a shared table with a tenant_id you must never forget. IDOR and missing tenant predicates are the bugs. Spring Security @PreAuthorize, method security, and Hibernate filters are the usual place those predicates live — or die.",

  theory: [
    {
      heading: "Authn vs authz, and why roles appear",
      body: "Authentication answers who. Authorization answers whether that who may do this to that. <b>RBAC</b> (role-based access control) inserts a layer of roles so you do not assign 40 permissions per hire: User → Role → Permission. An <code>ADMIN</code> may <code>ORDER_REFUND</code>. Spring Security's <code>hasRole(\"ADMIN\")</code> is RBAC. It matches org charts and breaks on context: the same role should not refund another tenant's order, or a store in a different country. Role explosion (StoreManager_Mumbai_Night) is the smell that you wanted attributes.",
      bullets: [
        "Keep roles few and stable; keep permissions on code paths.",
        "Never authorize on \"is authenticated\" alone for mutating APIs.",
        "Admins of tenant A are not admins of tenant B unless you say so."
      ]
    },
    {
      heading: "ABAC: attributes and policies",
      body: "<b>ABAC</b> decides from attributes: user.department, resource.ownerId, action, time, IP, tenant. A policy might read: permit if user.tenant == resource.tenant AND (user.id == resource.owner OR user.role == MANAGER). That is how you encode \"managers see their region\" without a new role per region. Implementations: custom Spring voters, Open Policy Agent (Rego), AWS IAM conditions, Google Zanzibar-style relation tuples (ReBAC, a cousin). ABAC is more precise and more expensive to cache, audit, and explain. Start RBAC, add attributes on the paths that explode roles. <code>@PreAuthorize(\"@orderAuth.canRefund(authentication, #id)\")</code> is ABAC you wrote as Java.",
      bullets: [
        "Policies need tests; a missed attribute is an IDOR.",
        "Cache policy decisions with care — attributes change (role revoked, tenant moved).",
        "ReBAC (relationships: user is parent of doc) is ABAC with a graph."
      ]
    },
    {
      heading: "The IDOR that RBAC does not catch",
      body: "A user with role CUSTOMER may <code>GET /orders/{id}</code>. If the handler checks the role and not <code>order.customerId == currentUser</code>, they read someone else's order. That is <b>IDOR</b> (insecure direct object reference). RBAC said the role may call the endpoint; it did not say they may touch this row. Every resource id from the client is untrusted. Load the row, then apply ownership/tenant/ABAC. In Spring Data, a query that includes <code>AND tenant_id = :tenant</code> (or a Hibernate <code>@Filter</code>) is safer than loading by id and hoping the next line checks. Same for object-storage keys and message payloads.",
      bullets: [
        "Authorize the object, not only the URL pattern.",
        "UUIDs as ids are not authorization; they are slightly harder to guess.",
        "Horizontal privilege (peer user) is as common as vertical (become admin)."
      ]
    },
    {
      heading: "Multi-tenant isolation models",
      body: "Three classic pools. <b>Database per tenant</b>: strongest isolation, separate backups, noisy-neighbor control, painful migrations × N. <b>Schema per tenant</b>: one engine, separate namespaces, medium isolation. <b>Shared tables with tenant_id</b>: cheapest, one migration, and a missing WHERE is a data leak. Row-level security in Postgres (<code>SET app.tenant</code> + policy) is a belt under the application belt. Connection pools complicate this: a Hikari pool that reuses a connection must reset the tenant GUC or you leak the previous tenant. Spring: <code>CurrentTenantIdentifierResolver</code> + <code>MultiTenantConnectionProvider</code> (separate DBs) or a request filter that sets a ThreadLocal tenant and a Hibernate filter (shared tables).",
      bullets: [
        "Pick isolation from threat model and regulation, not from ORM convenience.",
        "Unique indexes must include tenant_id or tenant A blocks tenant B's email.",
        "Jobs and consumers must set tenant context; they have no HTTP filter."
      ]
    },
    {
      heading: "Tenancy meets the rest of the stack",
      body: "Caches: key by tenant or you serve A the cart of B. Kafka: partition keys and compacted topics leak if you skip tenant in the key. Search indexes: a shared cluster needs a tenant field in every query. Object storage: prefix keys with tenant id and sign URLs that cannot be mixed. SSO: the IdP may be per tenant (enterprise) or a global pool with a tenant claim in the JWT. ABAC policies should treat tenant as a mandatory attribute, not an optional one. Confused deputy: a privileged worker that takes a tenant id from a message without checking the producer is how isolation dies in async code.",
      bullets: [
        "Tenant is part of every unique key: DB, cache, blob, topic.",
        "Admin impersonation needs an audit log, a time limit, and still a tenant scope.",
        "Test with two tenants in CI or you will not see the missing predicate."
      ]
    },
    {
      heading: "Spring checklist",
      body: "Enable method security. Put <code>@PreAuthorize</code> on services, not only on controllers (internal callers skip controllers). For shared-schema tenancy, enable a Hibernate filter on every tenant-owned entity and fail closed if the tenant ThreadLocal is empty. Map JWT <code>roles</code> / <code>permissions</code> / <code>tenant</code> claims in a converter — do not trust a client-supplied tenant header unless it matches the token. Prefer deny by default. Log denials with user, tenant, action, resource id.",
      bullets: [
        "A missing tenant context is a 500, not a query of all rows.",
        "Permission names belong in code constants, not magic strings scattered in SpEL.",
        "Policy-as-code (OPA) if many services must share the same rules."
      ]
    }
  ],

  keyTerms: [
    { term: "RBAC", def: "Users get roles; roles get permissions. Coarse, easy to explain, weak on context." },
    { term: "ABAC", def: "Permit/deny from attributes of user, resource, action, and environment." },
    { term: "ReBAC", def: "Authorization from relationships (owner, parent, team) — Zanzibar-style." },
    { term: "IDOR", def: "Calling an endpoint you are allowed to use on an object you are not allowed to see." },
    { term: "Tenant", def: "An isolation boundary (customer, org) that must not read another tenant's data." },
    { term: "Row-level security", def: "Database policies that restrict rows by session settings such as tenant id." },
    { term: "Current tenant", def: "Request-scoped identifier every query, cache key, and job must carry." },
    { term: "Fail closed", def: "If tenant or principal is missing, deny or error — never run the unfiltered query." }
  ],

  tradeoffs: [
    { pro: "RBAC is simple to assign and audit at hire/fire time.", con: "Context rules explode the role catalog or get skipped and become IDORs." },
    { pro: "ABAC expresses region, owner, and time without a new role each time.", con: "Policies are harder to cache, test, and explain to support." },
    { pro: "DB-per-tenant isolates noisy neighbors and simplifies restores.", con: "Migrations, connection pools, and cost grow with tenant count." },
    { pro: "Shared schema is cheap and easy to query globally.", con: "One missing tenant predicate leaks data; indexes and uniques get subtle." },
    { pro: "Row-level security defends even buggy apps.", con: "Connection-pool session state must be reset or RLS binds the wrong tenant." }
  ],

  interviewTips: [
    "Separate login (previous lecture) from \"may this user refund this order in this tenant.\"",
    "Show an IDOR: same role, wrong id, missing ownership check.",
    "Pick a tenancy model from isolation needs, then say where tenant_id is forced (filter, RLS, separate DB).",
    "Mention async workers and caches as places tenancy is forgotten.",
    "Map RBAC to hasRole and ABAC to a custom PermissionEvaluator or OPA, and fail closed on missing tenant."
  ],

  scene: {
    nodes: [
      { id: "u", label: "User Acme", type: "user", pos: [-11, 0, -3] },
      { id: "u2", label: "User Globex", type: "user", pos: [-11, 0, 3] },
      { id: "gw", label: "API gateway", type: "gateway", pos: [-5, 0, 0] },
      { id: "pep", label: "Policy check", type: "service", pos: [1, 0, 0] },
      { id: "pdp", label: "RBAC/ABAC", type: "service", pos: [1, 0, -5], showAt: 1 },
      { id: "acme", label: "Tenant Acme", type: "zone", pos: [8, 0, -4], size: [8, 6], showAt: 4 },
      { id: "globex", label: "Tenant Globex", type: "zone", pos: [8, 0, 4], size: [8, 6], showAt: 4 },
      { id: "dbA", label: "Acme DB", type: "db", pos: [8, 0, -4], showAt: 4 },
      { id: "dbB", label: "Globex DB", type: "db", pos: [8, 0, 4], showAt: 4 },
      { id: "shared", label: "Shared table", type: "db", pos: [8, 0, 0], showAt: 5 },
      { id: "nIdor", label: "GET /orders/99 missing owner", type: "note", pos: [1, 0, 5], showAt: 2 },
      { id: "nRls", label: "WHERE tenant_id = current", type: "note", pos: [8, 0, -7], showAt: 5 },
      { id: "cache", label: "Cache", type: "cache", pos: [1, 0, 7], showAt: 6 }
    ],
    edges: [
      { from: "u", to: "gw" },
      { from: "u2", to: "gw" },
      { from: "gw", to: "pep" },
      { from: "pep", to: "pdp", showAt: 1 },
      { from: "pep", to: "dbA", showAt: 4 },
      { from: "pep", to: "dbB", showAt: 4 },
      { from: "pep", to: "shared", showAt: 5 },
      { from: "pep", to: "cache", showAt: 6 }
    ],
    steps: [
      {
        title: "Two users, one API",
        text: "Acme and Globex both hit the gateway. Authentication already happened. The remaining question is authorization and isolation — not another login box.",
        highlight: ["u", "u2", "gw", "pep"],
        flows: [
          { from: "u", to: "gw", color: "#4ade80", label: "Bearer" },
          { from: "u2", to: "gw", color: "#60a5fa" }
        ]
      },
      {
        title: "RBAC: role → permission",
        text: "The policy point maps USER/MANAGER/ADMIN to permissions. Cheap and good until the rule needs region, owner, or tenant. hasRole(\"ADMIN\") is not enough.",
        highlight: ["pep", "pdp"],
        flows: [{ from: "pep", to: "pdp", color: "#c084fc", label: "hasRole" }]
      },
      {
        title: "IDOR: right role, wrong row",
        text: "A customer may call GET /orders/{id}. Without order.customerId and tenant checks they read order 99 from someone else. Authorize the object.",
        highlight: ["pep", "nIdor", "u"],
        flows: [{ from: "gw", to: "pep", color: "#f87171", label: "id=99" }]
      },
      {
        title: "ABAC adds attributes",
        text: "Permit if user.tenant == order.tenant and (owner or manager-in-region). @PreAuthorize delegates to a bean that loads the order and compares attributes. Roles stay small.",
        highlight: ["pdp", "pep"],
        flows: [{ from: "pep", to: "pdp", color: "#c084fc", label: "attrs" }]
      },
      {
        title: "Strong isolation: DB per tenant",
        text: "Acme connections never see Globex tables. Restores, noisy neighbors, and compliance get easier. Migrations and pools get harder. CurrentTenantIdentifierResolver picks the datasource.",
        highlight: ["acme", "globex", "dbA", "dbB", "pep"],
        flows: [
          { from: "pep", to: "dbA", color: "#4ade80", label: "acme" },
          { from: "pep", to: "dbB", color: "#60a5fa", label: "globex" }
        ]
      },
      {
        title: "Shared table: tenant_id or leak",
        text: "One table, a tenant column, maybe Postgres RLS. Unique indexes include tenant_id. A missing predicate is a cross-tenant read. Fail closed if tenant context is empty.",
        highlight: ["shared", "nRls", "pep"],
        flows: [{ from: "pep", to: "shared", color: "#facc15", label: "filter" }]
      },
      {
        title: "Caches and jobs forget tenants",
        text: "A Redis key without tenant serves Globex Acme's cart. A Kafka consumer without tenant context writes the wrong DB. Isolation is every key, every worker, not only the HTTP filter.",
        highlight: ["cache", "shared", "pep"],
        fail: ["cache"],
        flows: [{ from: "pep", to: "cache", color: "#f87171", label: "cart:{id}" }]
      },
      {
        title: "Deny by default, test with two tenants",
        text: "RBAC for coarse gates, ABAC for object rules, a tenancy model that matches the threat, and CI that runs Acme and Globex side by side. That is the authorization design.",
        highlight: ["pdp", "dbA", "dbB", "gw"],
        flows: [
          { from: "u", to: "gw", color: "#4ade80" },
          { from: "pep", to: "dbA", color: "#4ade80" },
          { from: "pep", to: "cache", color: "#facc15", label: "acme:cart:{id}" }
        ]
      }
    ]
  }
});
