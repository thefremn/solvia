export default {
  providers: [
    {
      // Hardcoded rather than read from process.env.CLERK_JWT_ISSUER_DOMAIN:
      // this file is evaluated by the Convex CLI at deploy time, in whatever
      // environment is running `convex deploy` - not at runtime on Convex's
      // servers like a regular query/mutation/action. Convex's dashboard env
      // vars aren't available there, so unless this exact variable is also
      // set in every environment that deploys (e.g. Vercel's build env), it
      // silently deploys with an undefined domain. If this domain ever
      // changes, update it here.
      domain: "https://clerk.solvia-web.fremn.com",
      applicationID: "convex",
    },
    {
      // Clerk's Development instance, used by Vercel Preview deployments.
      // Preview and Production currently share this one Convex backend (no
      // isolated per-PR backend - see CONTRIBUTING.md), so this backend has
      // to trust both Clerk instances' tokens, not just production's.
      domain: "https://allowing-bulldog-0.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
};