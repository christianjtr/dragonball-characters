interface HTTPClientConfig {
  baseURL: string;
  headers?: HeadersInit;
}

interface HTTPClient {
  get: (uri: string, config?: RequestInit) => Promise<Response>;
}

function createHTTPClient(config: HTTPClientConfig): HTTPClient {
  const baseURL = config.baseURL;
  const defaultHeaders = config.headers || {};

  const get = async (uri: string, config?: RequestInit): Promise<Response> => {
    const headers = { ...defaultHeaders, ...config?.headers };

    try {
      const response = await fetch(`${baseURL}${uri}`, {
        ...config,
        method: 'GET',
        headers,
      });

      return response;
    } catch (error) {
      console.error('[HTTPCLIENT][ERROR][GET]', error);
      throw error;
    }
  }

  return {
    get
  }
}

export { createHTTPClient };