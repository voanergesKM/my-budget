import { useEffect, useRef } from "react";

export function useFocusFirstField<T extends HTMLElement = HTMLInputElement>(form: any) {
  const firstFieldRef = useRef<T | null>(null);

  useEffect(() => {
    if (!form?.store) return;

    const unsubscribe = form.store.subscribe(() => {
      const { isSubmitting } = form.state;

      if (!isSubmitting && form.state.isDirty === false) {
        firstFieldRef.current?.focus();
      }
    });

    return unsubscribe;
  }, [form]);

  return firstFieldRef;
}
