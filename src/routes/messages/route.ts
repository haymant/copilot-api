import { Hono } from "hono"

import { forwardError } from "~/lib/error"
import type { HonoContextWithGitHub } from "~/types/hono"

import { handleCountTokens } from "./count-tokens-handler"
import { handleCompletion } from "./handler"

export const messageRoutes = new Hono()

messageRoutes.post("/", async (c: HonoContextWithGitHub) => {
  try {
    return await handleCompletion(c)
  } catch (error) {
    return await forwardError(c, error)
  }
})

messageRoutes.post("/count_tokens", async (c: HonoContextWithGitHub) => {
  try {
    return await handleCountTokens(c)
  } catch (error) {
    return await forwardError(c, error)
  }
})
