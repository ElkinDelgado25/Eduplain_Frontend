import {
  ApiRequestError,
  apiFetch,
  getHttpErrorMessage,
  readJson,
} from './client'

export type HealthResponse = {
  status: string
  service: string
  environment: string
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await apiFetch('/api/health/')
  const data = await readJson(response)

  if (!response.ok) {
    throw new ApiRequestError(
      getHttpErrorMessage(
        response.status,
        data,
        `El health check respondió con HTTP ${response.status}.`,
      ),
      response.status,
    )
  }

  if (!isHealthResponse(data)) {
    throw new ApiRequestError('El backend respondió con un health check inesperado.')
  }

  return data
}

function isHealthResponse(data: unknown): data is HealthResponse {
  if (!data || typeof data !== 'object') {
    return false
  }

  const candidate = data as Partial<HealthResponse>

  return (
    typeof candidate.status === 'string' &&
    typeof candidate.service === 'string' &&
    typeof candidate.environment === 'string'
  )
}
