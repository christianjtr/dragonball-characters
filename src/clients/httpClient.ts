interface HTTPClientConfig {
  baseURL: string;
  headers?: HeadersInit;
}

interface HTTPClient {
  get: <T>(uri: string, config?: RequestInit) => Promise<T>;
}

export class HTTPError extends Error {
  readonly status: number;

  constructor(status: number, message?: string) {
    super(message || `Request failed with status ${status}`);
    this.name = "HTTPError";
    this.status = status;
  }
}

export function isHTTPError(error: unknown): error is HTTPError {
  return error instanceof HTTPError;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function createHTTPClient(config: HTTPClientConfig): HTTPClient {
  const baseURL = config.baseURL;
  const defaultHeaders = config.headers || {};

  const get = async <T>(uri: string, config?: RequestInit): Promise<T> => {
    const headers = { ...defaultHeaders, ...config?.headers };

    try {
      const request = await fetch(`${baseURL}${uri}`, {
        ...config,
        method: "GET",
        headers,
      });

      if (!request.ok) {
        let detail = "";
        try {
          const body = (await request.json()) as { message?: string };
          detail = body?.message ?? "";
        } catch {
          detail = "";
        }
        throw new HTTPError(request.status, detail);
      }

      const response = await request.json();

      return response;
    } catch (error) {
      if (!isAbortError(error)) {
        console.error("[HTTPCLIENT][ERROR][GET]", error);
      }
      throw error;
    }
  };

  return {
    get,
  };
}

export { createHTTPClient };
