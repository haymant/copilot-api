import { Hono } from "hono"

import { forwardError } from "~/lib/error"
import type { HonoContextWithGitHub } from "~/types/hono"

import { handleCompletion } from "./handler"

export const completionRoutes = new Hono()

completionRoutes.post("/", async (c: HonoContextWithGitHub) => {
  try {
    return await handleCompletion(c)
  } catch (error) {
    return await forwardError(c, error)
  }
})
