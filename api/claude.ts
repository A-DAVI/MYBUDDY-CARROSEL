// Vercel Edge Function — proxy para a API da Anthropic.
// Roda server-side: sem CORS, sem expor a chave no browser.
//
// Chave de API em ordem de prioridade:
//   1. Variável de ambiente ANTHROPIC_API_KEY (configurada no dashboard da Vercel)
//   2. Header x-api-key-override enviado pelo frontend (para dev local sem env var)

export const runtime = 'edge'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405)
  }

  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    req.headers.get('x-api-key-override') ||
    ''

  if (!apiKey) {
    return json({
      error: 'API key não configurada. Defina ANTHROPIC_API_KEY nas variáveis de ambiente da Vercel, ou insira sua chave na sidebar do editor.',
    }, 401)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'body inválido' }, 400)
  }

  const upstream = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()

  return new Response(JSON.stringify(data), {
    status: upstream.status,
    headers: { 'content-type': 'application/json', ...corsHeaders() },
  })
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-api-key-override',
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders() },
  })
}
