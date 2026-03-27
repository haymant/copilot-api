import consola from "consola"
import { copilotHeaders, copilotBaseUrl } from "~/lib/api-config"
import { HTTPError } from "~/lib/error"
import { state } from "~/lib/state"
import { ensureCopilotToken, setupCopilotToken } from "~/lib/token"

const embeddingModelAliases: Record<string, string> = {
  "text-embedding-3-small": "gpt-4o-embedding",
  "text-embedding-3-large": "gpt-4o-embedding",
  "text-embedding-1": "gpt-4o-embedding",
  "gpt-4o-embedding": "gpt-4o-embedding",
}

const normalizeEmbeddingModel = (model: string) => {
  // Preserve API-native embedding model names when available.
  if (model.startsWith("text-embedding")) return model
  if (model === "gpt-4o-embedding") return model

  if (state.models?.data) {
    const availableEmbedModel = state.models.data.find((m) =>
      m.id.toLowerCase().includes("embedding"),
    )
    if (availableEmbedModel) return availableEmbedModel.id
  }

  return embeddingModelAliases[model] ?? "gpt-4o-embedding"
}

export const createEmbeddings = async (
  payload: EmbeddingRequest,
  githubToken?: string,
) => {
  if (!state.copilotToken) {
    await ensureCopilotToken(githubToken)
  }

  if (!state.copilotToken) {
    throw new Error("Copilot token not found")
  }

  const requestPayload = {
    ...payload,
    model: normalizeEmbeddingModel(payload.model),
    input: Array.isArray(payload.input) ? payload.input : [payload.input],
  }

  const performRequest = async () => {
    return fetch(`${copilotBaseUrl(state)}/embeddings`, {
      method: "POST",
      headers: copilotHeaders(state),
      body: JSON.stringify(requestPayload),
    })
  }

  let response = await performRequest()
  if (response.status === 401 && githubToken) {
    consola.warn("Copilot token expired for embeddings; refreshing and retrying")
    await setupCopilotToken(githubToken)
    response = await performRequest()
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "<body unavailable>")
    throw new HTTPError(
      `Failed to create embeddings: ${errorBody}`,
      response,
      errorBody,
    )
  }

  return (await response.json()) as EmbeddingResponse
}

export interface EmbeddingRequest {
  input: string | Array<string>
  model: string
}

export interface Embedding {
  object: string
  embedding: Array<number>
  index: number
}

export interface EmbeddingResponse {
  object: string
  data: Array<Embedding>
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}
