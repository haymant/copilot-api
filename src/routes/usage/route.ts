import { Hono } from "hono"

import type { HonoContextWithGitHub, GitHubEnv } from "~/types/hono"
import { getCopilotUsage } from "~/services/github/get-copilot-usage"

export const usageRoute = new Hono<GitHubEnv>()

usageRoute.get("/", async (c: HonoContextWithGitHub) => {
  try {
    const githubToken = c.get("githubToken")
    const usage = await getCopilotUsage(githubToken)
    return c.json(usage)
  } catch (error) {
    console.error("Error fetching Copilot usage:", error)
    return c.json({ error: "Failed to fetch Copilot usage" }, 500)
  }
})
