import { Value } from '@mxfriend/oscom';
import { useEffect, useState } from 'react';

export function useOSCValue<T>(value?: Value<T>): T | undefined {
  const [current, setCurrent] = useState(value?.$get());

  useEffect(() => {
    value && value.$on('remote-change', setCurrent);
    value && setCurrent(value.$get());
    return () => { value && value.$off('remote-change', setCurrent); };
  }, [value]);

  return current;
}
