import type { Context, Next } from "hono"

/**
 * Middleware to extract GitHub token from Authorization header
 * Expected format: Authorization: Bearer <github_token>
 */
export function extractGitHubToken(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header("Authorization")

  if (!authHeader) {
    return c.json({ error: "Missing Authorization header" }, 401)
  }

  const [scheme, token] = authHeader.split(" ")

  if (scheme !== "Bearer" || !token) {
    return c.json(
      { error: "Invalid Authorization header format. Expected: Bearer <token>" },
      401,
    )
  }

  // Store the token in context for use in handlers
  c.set("githubToken", token)

  return next()
}
