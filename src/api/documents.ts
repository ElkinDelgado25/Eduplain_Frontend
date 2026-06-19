import type { PdfToMarkdownResponse } from '../types/documents'

const PDF_TO_MARKDOWN_PATH = '/api/documents/pdf-to-markdown/'

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

export async function convertPdfToMarkdown(
  file: File,
): Promise<PdfToMarkdownResponse> {
  try {
    const apiBaseUrl = getApiBaseUrl()
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${apiBaseUrl}${PDF_TO_MARKDOWN_PATH}`, {
      method: 'POST',
      body: formData,
    })

    const data = await readJson(response)

    if (!response.ok) {
      throw new ApiRequestError(
        getHttpErrorMessage(response.status, data),
        response.status,
      )
    }

    if (!isPdfToMarkdownResponse(data)) {
      throw new ApiRequestError(
        'El backend respondió con un formato inesperado.',
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error
    }

    throw new ApiRequestError(
      'Conexión fallida: no se pudo contactar al backend Django. Verifica que esté corriendo en VITE_API_BASE_URL.',
    )
  }
}

function getApiBaseUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!apiBaseUrl) {
    throw new ApiRequestError(
      'Falta configurar VITE_API_BASE_URL en el entorno de Vite.',
    )
  }

  return apiBaseUrl.replace(/\/+$/, '')
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function isPdfToMarkdownResponse(
  data: unknown,
): data is PdfToMarkdownResponse {
  if (!data || typeof data !== 'object') {
    return false
  }

  const candidate = data as Partial<PdfToMarkdownResponse>

  return (
    typeof candidate.filename === 'string' &&
    typeof candidate.characters === 'number' &&
    typeof candidate.markdown === 'string'
  )
}

function getHttpErrorMessage(status: number, data: unknown): string {
  const backendMessage = getBackendMessage(data)

  if (status === 400) {
    return withBackendMessage(
      'El backend no pudo procesar el PDF. Revisa que sea un archivo válido.',
      backendMessage,
    )
  }

  if (status === 413) {
    return withBackendMessage(
      'El PDF supera el límite permitido por el backend. Usa un archivo menor a 10 MB.',
      backendMessage,
    )
  }

  if (status === 500) {
    return withBackendMessage(
      'Ocurrió un error interno en el backend al convertir el PDF.',
      backendMessage,
    )
  }

  return withBackendMessage(
    `No se pudo convertir el PDF. El backend respondió con HTTP ${status}.`,
    backendMessage,
  )
}

function getBackendMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const payload = data as ErrorPayload
  const message = payload.detail ?? payload.error ?? payload.message

  return typeof message === 'string' && message.trim() ? message : null
}

function withBackendMessage(message: string, backendMessage: string | null): string {
  return backendMessage ? `${message} Detalle: ${backendMessage}` : message
}
