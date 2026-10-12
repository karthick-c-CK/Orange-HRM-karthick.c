import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiResult } from '../types/api.types';

type QueryParams = Record<string, string | number | boolean>;

/**
 * Thin wrapper around Playwright's APIRequestContext.
 * Uses the browser context's request context so the authenticated session cookie is shared.
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string, params?: QueryParams): Promise<ApiResult<T>> {
    const response = await this.request.get(this.buildUrl(path), {
      params,
      headers: { Accept: 'application/json' },
    });
    return this.toResult<T>(response);
  }

  private buildUrl(path: string): string {
    return new URL(path, this.baseUrl).toString();
  }

  private async toResult<T>(response: APIResponse): Promise<ApiResult<T>> {
    const text = await response.text();
    let body: T | undefined;

    try {
      body = text ? (JSON.parse(text) as T) : undefined;
    } catch {
      // Non-JSON responses (for example, a login redirect page) leave body undefined.
      body = undefined;
    }

    return {
      status: response.status(),
      ok: response.ok(),
      body,
    };
  }
}