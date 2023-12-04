import { useEffect } from 'react';
import { useLatestValue } from '@/hooks';

const useDocumentEvent = <EventType extends keyof DocumentEventMap>(
  type: EventType,
  listener: (event: DocumentEventMap[EventType]) => any,
  options?: boolean | AddEventListenerOptions
) => {
  const listenerRef = useLatestValue(listener);

  useEffect(() => {
    const handleEvent = (event: DocumentEventMap[EventType]) => {
      listenerRef.current(event);
    };

    document.addEventListener(type, handleEvent, options);

    return () => document.removeEventListener(type, handleEvent, options);
  }, [type, options]);
};

export default useDocumentEvent;
