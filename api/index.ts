import { app } from "../src/server"
import { cacheVSCodeVersion } from "../src/lib/utils"
import { setupCopilotToken } from "../src/lib/token"
import { state } from "../src/lib/state"

let initialized = false

async function initialize() {
  if (initialized) return

  try {
    await cacheVSCodeVersion()
  } catch (error) {
    console.error("Failed to cache VSCode version:", error)
  }

  // `setupCopilotToken` requires GitHub token and may fail in env without one.
  // We prefer per-request token setup in routes; this step is optional.
  try {
    if (process.env.GH_TOKEN) {
      await setupCopilotToken(process.env.GH_TOKEN)
    }
  } catch (error) {
    console.error("Failed to setup initial Copilot token:", error)
  }

  initialized = true
}

export default async function (request: Request): Promise<Response> {
  try {
    await initialize()
    return await app.fetch(request)
  } catch (error) {
    console.error("Vercel function error:", error)
    return new Response(
      JSON.stringify({ error: (error as Error)?.message ?? "unknown" }),
      { status: 500, headers: { "content-type": "application/json" } },
    )
  }
}
