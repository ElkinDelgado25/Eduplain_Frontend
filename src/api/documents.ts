import type { PdfToMarkdownResponse } from '../types/documents'
import {
  ApiRequestError,
  apiFetch,
  getHttpErrorMessage,
  readJson,
} from './client'

const PDF_TO_MARKDOWN_PATH = '/api/documents/pdf-to-markdown/'

export { ApiRequestError } from './client'

export async function convertPdfToMarkdown(
  file: File,
): Promise<PdfToMarkdownResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiFetch(PDF_TO_MARKDOWN_PATH, {
    method: 'POST',
    body: formData,
  })

  const data = await readJson(response)

  if (!response.ok) {
    throw new ApiRequestError(
      getPdfHttpErrorMessage(response.status, data),
      response.status,
    )
  }

  if (!isPdfToMarkdownResponse(data)) {
    throw new ApiRequestError('El backend respondió con un formato inesperado.')
  }

  return data
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

function getPdfHttpErrorMessage(status: number, data: unknown): string {
  if (status === 400) {
    return getHttpErrorMessage(
      status,
      data,
      'El backend no pudo procesar el PDF. Revisa que sea un archivo válido.',
    )
  }

  if (status === 413) {
    return getHttpErrorMessage(
      status,
      data,
      'El PDF supera el límite permitido por el backend. Usa un archivo menor a 10 MB.',
    )
  }

  if (status === 500) {
    return getHttpErrorMessage(
      status,
      data,
      'Ocurrió un error interno en el backend al convertir el PDF.',
    )
  }

  return getHttpErrorMessage(
    status,
    data,
    `No se pudo convertir el PDF. El backend respondió con HTTP ${status}.`,
  )
}
