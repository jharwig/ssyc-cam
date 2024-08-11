import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

async function loadImage(baseUrl: string) {
  return new Promise<{ url: string; duration: number }>((resolve, reject) => {
    const start = Date.now();
    const url = baseUrl + start;
    const image = new Image();
    image.onload = () => {
      const duration = Date.now() - start;
      resolve({ url, duration });
    };
    image.onerror = reject;
    image.src = url;
  });
}

function Cam({
  baseUrl,
  interval,
  className,
  label,
  onClick,
}: {
  className?: string;
  label: string;
  baseUrl: string;
  interval: number;
  onClick: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    let cancel = false;

    async function delay(wait: number) {
      timer = window.setTimeout(
        async () => {
          if (cancel) return;
          const { url } = await loadImage(baseUrl);
          if (cancel) return;
          setSrc(url);
          // void delay(interval - duration);
          void delay(interval);
        },
        Math.max(0, wait),
      );
    }

    delay(interval);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [baseUrl, interval]);

  return (
    <img
      className={twMerge("object-contain h-full w-full", className)}
      style={{ viewTransitionName: label }}
      src={src || baseUrl}
      width={640}
      height={360}
      onClick={onClick}
    />
  );
}

export default Cam;
