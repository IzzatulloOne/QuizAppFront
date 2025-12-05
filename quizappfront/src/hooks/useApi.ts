import { useState, useCallback } from 'react';

type ApiFunction<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

export function useApi<TArgs extends any[], TResult>(apiFn: ApiFunction<TArgs, TResult>) {
  const [data, setData] = useState<TResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exec = useCallback(async (...args: TArgs): Promise<TResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message ?? "Unknown Error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { exec, data, loading, error };
}
