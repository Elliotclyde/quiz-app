import { useEffect } from "preact/hooks";

// To hook up server-sent events
export const useSSE = (onEvent) => {
  useEffect(() => {
    const evtSource = new EventSource(
      import.meta.env.VITE_BACKEND_URL + "/events/",
      {
        withCredentials: true,
      }
    );
    evtSource.addEventListener("message", function (event) {
      console.log(event);
      onEvent(event.data);
    });
  }, []);
};
