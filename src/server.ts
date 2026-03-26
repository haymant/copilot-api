import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import type { GitHubEnv } from "~/types/hono"

import { extractGitHubToken } from "./middleware/auth"
import { completionRoutes } from "./routes/chat-completions/route"
import { embeddingRoutes } from "./routes/embeddings/route"
import { messageRoutes } from "./routes/messages/route"
import { modelRoutes } from "./routes/models/route"
import { tokenRoute } from "./routes/token/route"
import { usageRoute } from "./routes/usage/route"

export const app = new Hono<GitHubEnv>()

app.use(logger())
app.use(cors())

app.get("/", (c) => c.text("Server running"))

// Apply auth middleware to all routes that need GitHub token
app.use("/v1/chat/completions", extractGitHubToken)
app.use("/v1/models", extractGitHubToken)
app.use("/v1/embeddings", extractGitHubToken)
app.use("/v1/usage", extractGitHubToken)
app.use("/v1/messages", extractGitHubToken)

// All routes use v1 prefix for consistency
app.route("/v1/chat/completions", completionRoutes)
app.route("/v1/models", modelRoutes)
app.route("/v1/embeddings", embeddingRoutes)
app.route("/v1/usage", usageRoute)
app.route("/v1/messages", messageRoutes)
app.route("/v1/token", tokenRoute)
