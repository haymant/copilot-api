import { Hono } from "hono"

import type { GitHubEnv } from "~/types/hono"
import { state } from "~/lib/state"

export const tokenRoute = new Hono<GitHubEnv>()

tokenRoute.get("/", (c) => {
  try {
    return c.json({
      token: state.copilotToken,
    })
  } catch (error) {
    console.error("Error fetching token:", error)
    return c.json({ error: "Failed to fetch token", token: null }, 500)
  }
})
