import { useRef, useState } from 'react';
import { notifyError } from '@/shared/utils/notify';

export function useAuthSubmit<T>(action: (values: T) => Promise<void>) {
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);

  async function submit(values: T) {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    try {
      await action(values);
    } catch (error) {
      notifyError(error);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return { submit, pending };
}
