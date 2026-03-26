#!/usr/bin/env bun

import consola from "consola"
import { serve } from "srvx"

import { app, initializeApp } from "./runtime"

const PORT = parseInt(process.env.PORT || "3000", 10)

async function main() {
  try {
    consola.info("Starting Copilot API Server...")
    await initializeApp()

    consola.info(`Starting server on port ${PORT}`)
    await serve({
      fetch: app.fetch,
      port: PORT,
    })
  } catch (error) {
    consola.error("Failed to start server:", error)
    process.exit(1)
  }
}

main()
