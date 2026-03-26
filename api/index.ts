import { app } from "../src/server"
import { cacheVSCodeVersion } from "../src/lib/utils"
import { setupCopilotToken } from "../src/lib/token"
import { state } from "../src/lib/state"

let initialized = false

async function initialize() {
  if (initialized) return
  await cacheVSCodeVersion()
  await setupCopilotToken(process.env.GH_TOKEN)
  initialized = true
}

export default async function (request: Request): Promise<Response> {
  await initialize()
  return app.fetch(request)
}
