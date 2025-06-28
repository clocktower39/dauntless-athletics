import { useEffect, useRef } from "react";

const useHashOnView = (hash) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const formattedHash = `#${hash.replace(/^#/, "")}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && window.location.hash !== formattedHash) {
          console.log(`element with id of ${formattedHash} is in view`);

          const newUrl =
            formattedHash === "#home" ? window.location.pathname : formattedHash;

          history.replaceState(null, "", newUrl);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.5,
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hash]);

  return ref;
};

export default useHashOnView;