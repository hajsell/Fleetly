const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ??
  'http://localhost:3000/api'

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  accessToken?: string
}

type ApiErrorBody = {
  message?: string | string[]
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { accessToken, body, headers: customHeaders, ...requestOptions } =
    options
  const headers = new Headers(customHeaders)

  headers.set('Accept', 'application/json')

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...requestOptions,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(
      'Nie udało się połączyć z serwerem. Spróbuj ponownie później.',
      0,
    )
  }

  if (!response.ok) {
    const errorBody = await readJson<ApiErrorBody>(response)
    const message = Array.isArray(errorBody?.message)
      ? errorBody.message.join(' ')
      : errorBody?.message

    throw new ApiError(
      message ?? 'Wystąpił nieoczekiwany błąd.',
      response.status,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}
