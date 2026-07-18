type ErrorPayload = {
  detail?: unknown
  error?: unknown
  message?: unknown
}

export class ApiRequestError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

export function getApiBaseUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!apiBaseUrl) {
    return ''
  }

  return apiBaseUrl.replace(/\/+$/, '')
}

function getBasicAuthHeader(): string | null {
  const username = import.meta.env.VITE_API_BASIC_USERNAME?.trim()
  const password = import.meta.env.VITE_API_BASIC_PASSWORD ?? ''

  if (!username || !password) {
    return null
  }

  return `Basic ${btoa(`${username}:${password}`)}`
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${getApiBaseUrl()}${normalizedPath}`
  const headers = new Headers(init.headers)
  const authHeader = getBasicAuthHeader()

  if (authHeader && !headers.has('Authorization')) {
    headers.set('Authorization', authHeader)
  }

  try {
    return await fetch(url, { ...init, headers })
  } catch {
    throw new ApiRequestError(
      'Conexión fallida: no se pudo contactar al backend Django. Verifica que esté corriendo.',
    )
  }
}

export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export function getBackendMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const payload = data as ErrorPayload
  const message = getStringMessage(payload.detail ?? payload.error ?? payload.message)

  if (message) {
    return message
  }

  for (const [field, value] of Object.entries(data)) {
    const fieldMessage = getStringMessage(value)

    if (!fieldMessage) {
      continue
    }

    return field === 'non_field_errors'
      ? fieldMessage
      : `${field}: ${fieldMessage}`
  }

  return null
}

function getStringMessage(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = getStringMessage(item)

      if (message) {
        return message
      }
    }
  }

  return null
}

export function withBackendMessage(
  message: string,
  backendMessage: string | null,
): string {
  return backendMessage ? `${message} Detalle: ${backendMessage}` : message
}

export function getHttpErrorMessage(
  status: number,
  data: unknown,
  fallback: string,
): string {
  const backendMessage = getBackendMessage(data)

  if (status === 401 || status === 403) {
    return withBackendMessage(
      'El backend rechazó la autenticación. Configura VITE_API_BASIC_USERNAME y VITE_API_BASIC_PASSWORD.',
      backendMessage,
    )
  }

  return withBackendMessage(fallback, backendMessage)
}
