import { state } from "./lib/state"
import { setupCopilotToken } from "./lib/token"
import { cacheModels, cacheVSCodeVersion } from "./lib/utils"
import { app } from "./server"

let initialized = false

export async function initializeApp() {
  if (initialized) return

  await cacheVSCodeVersion()

  const githubToken = process.env.GH_TOKEN
  await setupCopilotToken(githubToken)

  if (state.copilotToken) {
    await cacheModels(githubToken)
  }

  initialized = true
}

export { app }