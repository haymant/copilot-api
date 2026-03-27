import { app, initializeApp } from "../dist/runtime.js"

async function readRequestBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined

  if (req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) return req.body
    if (req.body instanceof Uint8Array) return Buffer.from(req.body)
    if (typeof req.body === "string") return Buffer.from(req.body)

    const contentType = Array.isArray(req.headers["content-type"])
      ? req.headers["content-type"][0]
      : req.headers["content-type"]

    if (contentType?.includes("application/json")) {
      return Buffer.from(JSON.stringify(req.body))
    }

    return Buffer.from(String(req.body))
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

async function toWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] ?? "http"
  const host = req.headers.host ?? "localhost:3000"
  const url = new URL(req.url ?? "/", `${protocol}://${host}`)
  const body = await readRequestBody(req)

  return new Request(url, {
    method: req.method,
    headers: req.headers,
    body,
  })
}

async function sendNodeResponse(webResponse, res) {
  res.statusCode = webResponse.status

  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  if (!webResponse.body) {
    res.end()
    return
  }

  const arrayBuffer = await webResponse.arrayBuffer()
  res.end(Buffer.from(arrayBuffer))
}

export default async function (request, response) {
  try {
    await initializeApp()

    if (response && typeof request?.headers?.get !== "function") {
      const webRequest = await toWebRequest(request)
      const webResponse = await app.fetch(webRequest)
      await sendNodeResponse(webResponse, response)
      return
    }

    return await app.fetch(request)
  } catch (error) {
    console.error("Vercel function error:", error)

    if (response) {
      response.statusCode = 500
      response.setHeader("content-type", "application/json")
      response.end(JSON.stringify({ error: error?.message ?? "unknown" }))
      return
    }

    return new Response(JSON.stringify({ error: error?.message ?? "unknown" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}