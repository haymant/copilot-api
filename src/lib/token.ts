import consola from "consola"

import { getCopilotToken } from "~/services/github/get-copilot-token"

import { state } from "./state"

const scheduleTokenRefresh = (refreshInSeconds: number, githubToken: string) => {
  const refreshIntervalMs = (refreshInSeconds - 60) * 1000
  if (refreshIntervalMs <= 0) {
    consola.warn("Invalid refresh interval, skipping automatic Copilot token refresh")
    return
  }

  setInterval(async () => {
    consola.debug("Refreshing Copilot token")
    try {
      const { token } = await getCopilotToken(githubToken)
      state.copilotToken = token
      consola.debug("Copilot token refreshed")
      if (state.showToken) {
        consola.info("Refreshed Copilot token:", token)
      }
    } catch (error) {
      consola.error("Failed to refresh Copilot token:", error)
      // Leave token as-is; subsequent calls can retry with per-request ensure
    }
  }, refreshIntervalMs)
}

export const setupCopilotToken = async (githubToken?: string) => {
  if (!githubToken && !state.githubToken) {
    consola.debug("No GitHub token available at startup; skipping Copilot token setup")
    return
  }

  const tokenSource = githubToken ?? state.githubToken
  if (!tokenSource) return

  state.githubToken = tokenSource
  const { token, refresh_in } = await getCopilotToken(tokenSource)
  state.copilotToken = token

  consola.debug("GitHub Copilot Token fetched successfully!")
  if (state.showToken) {
    consola.info("Copilot token:", token)
  }

  scheduleTokenRefresh(refresh_in, tokenSource)
}

export const ensureCopilotToken = async (githubToken?: string) => {
  if (state.copilotToken) return

  if (!githubToken && !state.githubToken) {
    throw new Error("GitHub token missing for Copilot token acquisition")
  }

  await setupCopilotToken(githubToken)
}

/**
 * Note: GitHub token is no longer set at startup.
 * It is now provided per-request via the Authorization header in the format: Bearer <token>
 */
