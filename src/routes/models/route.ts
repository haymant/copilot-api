import { Hono } from "hono"

import { forwardError } from "~/lib/error"
import type { GitHubEnv, HonoContextWithGitHub } from "~/types/hono"
import { state } from "~/lib/state"
import { cacheModels } from "~/lib/utils"

export const modelRoutes = new Hono<GitHubEnv>()

modelRoutes.get("/", async (c: HonoContextWithGitHub) => {
  try {
    const githubToken = c.get("githubToken")

    if (!state.models) {
      // This should be handled by startup logic, but as a fallback.
      await cacheModels(githubToken)
    }

    const models = state.models?.data.map((model) => ({
      id: model.id,
      object: "model",
      type: "model",
      created: 0, // No date available from source
      created_at: new Date(0).toISOString(), // No date available from source
      owned_by: model.vendor,
      display_name: model.name,
    }))

    return c.json({
      object: "list",
      data: models,
      has_more: false,
    })
  } catch (error) {
    return await forwardError(c, error)
  }
})
