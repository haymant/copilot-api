import type { Context } from "hono"

export interface GitHubEnv {
  Bindings: {}
  Variables: {
    githubToken?: string
  }
}

export type HonoContextWithGitHub = Context<GitHubEnv>
