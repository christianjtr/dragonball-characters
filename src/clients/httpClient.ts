interface HTTPClientConfig {
  baseURL: string;
  headers?: HeadersInit;
}

interface HTTPClient {
  get: <T>(uri: string, config?: RequestInit) => Promise<T>;
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
        throw new Error(`[HTTPCLIENT][ERROR][status]: ${request.status}`);
      }

      const response = await request.json();

      return response;
    } catch (error) {
      console.error("[HTTPCLIENT][ERROR][GET]", error);
      throw error;
    }
  }

  return {
    get
  }
}

export { createHTTPClient };