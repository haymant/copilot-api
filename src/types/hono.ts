import type { Context } from "hono"

export interface HonoContextWithGitHub extends Context {
  get(key: "githubToken"): string
}
