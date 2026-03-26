#!/usr/bin/env bun

import consola from "consola"
import { serve } from "srvx"

import { state } from "./lib/state"
import { setupCopilotToken, setupGitHubToken } from "./lib/token"
import { cacheModels, cacheVSCodeVersion } from "./lib/utils"
import { server } from "./server"

const PORT = parseInt(process.env.PORT || "3000", 10)

async function main() {
  try {
    consola.info("Starting Copilot API Server...")

    // Set up initial state
    await cacheVSCodeVersion()
    await setupCopilotToken()

    // Note: GitHub token is now provided per-request via Authorization header
    // No need to set up GitHub token at startup

    consola.info("Caching available models...")
    await cacheModels()

    consola.info(`Starting server on port ${PORT}`)
    await serve(server.fetch, {
      port: PORT,
    })
  } catch (error) {
    consola.error("Failed to start server:", error)
    process.exit(1)
  }
}

main()
