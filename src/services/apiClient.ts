/**
 * Cliente HTTP centralizado para el backend Lavalleja Filma Forms.
 *
 * Lee VITE_API_BASE_URL (default: http://localhost:5000).
 * Maneja JSON, errores y timeouts.
 */

const configuredApiUrl = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/$/, "");
const API_BASE_URL =
  configuredApiUrl || (import.meta.env.DEV ? "http://localhost:5000" : "");

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string>;
}

export interface ApiSuccess<T> {
  success: true;
  data?: T;
  [key: string]: unknown;
}

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** If true, send body as FormData (multipart). */
  multipart?: boolean;
}

export class ApiClientError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    signal,
    timeoutMs = 15_000,
    multipart,
  } = options;

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (multipart && body instanceof FormData) {
      payload = body;
      // Let the browser set the Content-Type with boundary
    } else {
      payload = JSON.stringify(body);
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  let response: Response;
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort(signal?.reason);
  signal?.addEventListener("abort", abortFromCaller, { once: true });
  const timeoutId = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: payload,
      signal: controller.signal,
      credentials: "omit",
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      if (timedOut) {
        throw new ApiClientError(
          "El servidor demoró demasiado en responder. Intentá nuevamente.",
          0,
        );
      }
      throw err;
    }
    throw new ApiClientError(
      "No se pudo conectar con el servidor. Verificá tu conexión.",
      0,
    );
  } finally {
    globalThis.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortFromCaller);
  }

  // Try to parse JSON regardless of status code
  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Not JSON, leave as null
    }
  }

  if (!response.ok) {
    const errBody = (data ?? {}) as ApiError;
    const message =
      errBody?.message ||
      errBody?.error ||
      `Error ${response.status} al comunicarse con el servidor.`;
    const fieldErrors = errBody?.errors;
    throw new ApiClientError(message, response.status, fieldErrors);
  }

  return data as T;
}
