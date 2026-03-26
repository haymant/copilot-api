import { Hono } from "hono"

import { forwardError } from "~/lib/error"
import type { HonoContextWithGitHub, GitHubEnv } from "~/types/hono"

import { handleCompletion } from "./handler"

export const completionRoutes = new Hono<GitHubEnv>()

completionRoutes.post("/", async (c: HonoContextWithGitHub) => {
  try {
    return await handleCompletion(c)
  } catch (error) {
    return await forwardError(c, error)
  }
})
