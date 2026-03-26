# v0.app Compatible Setup

This project has been converted to work with v0.app. The server is now simplified and uses header-based GitHub token authentication instead of CLI arguments or environment variables.

## Key Changes

### 1. Server Entry Point
- The server now starts directly by running: `bun run dist/main.js`
- No more CLI subcommands (auth, start, check-usage, debug)
- No more environment variable `GH_TOKEN` requirement

### 2. GitHub Token Authentication
Instead of passing the GitHub token via CLI or environment variables, **clients must provide it via the request header**:

```bash
Authorization: Bearer <your-github-token>
```

### 3. Example Usage

#### Chat Completions
```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Authorization: Bearer your_github_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-mini",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

#### Get Copilot Usage
```bash
curl http://localhost:3000/v1/usage \
  -H "Authorization: Bearer your_github_token_here"
```

#### OpenAI Compatible Models List
```bash
curl http://localhost:3000/v1/models \
  -H "Authorization: Bearer your_github_token_here"
```

#### Embeddings
```bash
curl -X POST http://localhost:3000/v1/embeddings \
  -H "Authorization: Bearer your_github_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small", 
    "input": "The quick brown fox jumps over the lazy dog"
  }'
```

## Building

```bash
bun install
bun run build
```

## Running

### Development
```bash
bun run dev
```

### Production
```bash
PORT=3000 bun run dist/main.js
```

Or using Docker:
```bash
docker build -t copilot-api .
docker run -p 3000:3000 copilot-api
```

## Environment Variables

The following environment variables are now optional:

- `PORT` (default: 3000) - The port to listen on

Note: `GH_TOKEN` is no longer supported. GitHub token must be provided per-request via the Authorization header.

## API Endpoints

All endpoints require the `Authorization: Bearer <token>` header:

- `POST /v1/chat/completions` - OpenAI compatible chat completions
- `GET /v1/usage` - Get Copilot usage statistics
- `GET /v1/models` - OpenAI v1 compatible model listing
- `POST /v1/embeddings` - Create embeddings
- `POST /v1/messages` - Anthropic compatible messages endpoint
- `GET /v1/token` - Get current Copilot token (Copilot token refresh is handled automatically)

## Testing

Test that the server is working:
```bash
curl http://localhost:3000/
```

This should return: `Server running`

Note: Other endpoints require the Authorization header.
