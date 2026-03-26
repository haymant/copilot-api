import { Hono } from "hono"

import { forwardError } from "~/lib/error"
import {
  createEmbeddings,
  type EmbeddingRequest,
} from "~/services/copilot/create-embeddings"

export const embeddingRoutes = new Hono()

embeddingRoutes.post("/", async (c) => {
  try {
    const githubToken = c.get("githubToken")
    const paylod = await c.req.json<EmbeddingRequest>()
    const response = await createEmbeddings(paylod, githubToken)

    return c.json(response)
  } catch (error) {
    return await forwardError(c, error)
  }
})
