import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { extractGitHubToken } from "./middleware/auth"
import { completionRoutes } from "./routes/chat-completions/route"
import { embeddingRoutes } from "./routes/embeddings/route"
import { messageRoutes } from "./routes/messages/route"
import { modelRoutes } from "./routes/models/route"
import { tokenRoute } from "./routes/token/route"
import { usageRoute } from "./routes/usage/route"

export const server = new Hono()

server.use(logger())
server.use(cors())

server.get("/", (c) => c.text("Server running"))

// Apply auth middleware to all routes that need GitHub token
server.use("/chat/completions", extractGitHubToken)
server.use("/models", extractGitHubToken)
server.use("/embeddings", extractGitHubToken)
server.use("/usage", extractGitHubToken)

server.route("/chat/completions", completionRoutes)
server.route("/models", modelRoutes)
server.route("/embeddings", embeddingRoutes)
server.route("/usage", usageRoute)
server.route("/token", tokenRoute)

// Compatibility with tools that expect v1/ prefix
server.use("/v1/chat/completions", extractGitHubToken)
server.use("/v1/models", extractGitHubToken)
server.use("/v1/embeddings", extractGitHubToken)

server.route("/v1/chat/completions", completionRoutes)
server.route("/v1/models", modelRoutes)
server.route("/v1/embeddings", embeddingRoutes)

// Anthropic compatible endpoints (also needs auth)
server.use("/v1/messages", extractGitHubToken)
server.route("/v1/messages", messageRoutes)
