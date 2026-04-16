const BASE_HOST = import.meta.env.VITE_API_BASE_URL
const API_BASE = BASE_HOST.includes('/api/')
  ? BASE_HOST
  : `${BASE_HOST.replace(/\/+$/, '')}/api`

type ApiResponse<T> = {
  data: T
  message: string
  status: string
  success: boolean
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  baseUrl?: string
  body?: unknown
}

type ApiErrorDetails = {
  message: string
  httpStatus: number
  status?: string
  payload?: ApiResponse<unknown> | null
}

export class ApiError extends Error {
  httpStatus: number
  status?: string
  payload?: ApiResponse<unknown> | null

  constructor(details: ApiErrorDetails) {
    super(details.message)
    this.name = 'ApiError'
    this.httpStatus = details.httpStatus
    this.status = details.status
    this.payload = details.payload
  }
}

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== 'undefined' && value instanceof FormData

const isBodyInitObject = (value: unknown): value is BodyInit => {
  if (typeof value === 'string') {
    return true
  }

  if (isFormData(value)) {
    return true
  }

  if (value instanceof URLSearchParams) {
    return true
  }

  if (value instanceof Blob) {
    return true
  }

  if (value instanceof ArrayBuffer) {
    return true
  }

  return false
}

const normalizeBody = (body: unknown) => {
  if (body === undefined || body === null) {
    return { body: undefined, isJson: false }
  }

  if (isBodyInitObject(body)) {
    return { body, isJson: false }
  }

  if (typeof body === 'object') {
    return { body: JSON.stringify(body), isJson: true }
  }

  return { body: String(body), isJson: false }
}

const resolveUrl = (endpoint: string, baseUrl: string) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`

  return `${normalizedBase}${normalizedEndpoint}`
}

const parseJson = async <T>(response: Response) => {
  try {
    return (await response.json()) as ApiResponse<T>
  } catch {
    return null
  }
}

export async function api<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    baseUrl = API_BASE,
    body,
    headers,
    credentials = 'include',
    ...rest
  } = options

  const resolvedUrl = resolveUrl(endpoint, baseUrl)
  const normalized = normalizeBody(body)
  const mergedHeaders = new Headers(headers ?? {})

  if (!mergedHeaders.has('Accept')) {
    mergedHeaders.set('Accept', 'application/json')
  }

  if (normalized.isJson && !mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(resolvedUrl, {
    ...rest,
    body: normalized.body as BodyInit | null | undefined,
    headers: mergedHeaders,
    credentials,
  })

  const payload = await parseJson<T>(response)

  if (!response.ok) {
    throw new ApiError({
      message: payload?.message ?? response.statusText,
      httpStatus: response.status,
      status: payload?.status,
      payload,
    })
  }

  if (!payload) {
    throw new ApiError({
      message: 'Invalid API response',
      httpStatus: response.status,
      status: response.statusText,
    })
  }

  if (!payload.success) {
    throw new ApiError({
      message: payload.message,
      httpStatus: response.status,
      status: payload.status,
      payload,
    })
  }

  return payload.data
}

export type { ApiRequestOptions, ApiResponse }
