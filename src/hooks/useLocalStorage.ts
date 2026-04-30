import { useCallback, useState } from 'react';

const safeParse = <T,>(rawValue: string, fallback: T): T => {
  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    const storedValue = window.localStorage.getItem(key);

    if (storedValue === null) {
      return initialValue;
    }

    return safeParse(storedValue, initialValue);
  });

  const updateValue = useCallback(
    (nextValue: T | ((current: T) => T)) => {
      setValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === 'function'
            ? (nextValue as (current: T) => T)(currentValue)
            : nextValue;

        window.localStorage.setItem(key, JSON.stringify(resolvedValue));
        return resolvedValue;
      });
    },
    [key],
  );

  return [value, updateValue] as const;
};
