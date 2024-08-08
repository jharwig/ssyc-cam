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

    async function delay(wait: number) {
      timer = window.setTimeout(
        async () => {
          const { url, duration } = await loadImage(baseUrl);
          setSrc(url);
          void delay(interval - duration);
        },
        Math.max(0, wait),
      );
    }

    delay(0);
    return () => clearTimeout(timer);
  }, [baseUrl, interval]);

  return (
    <img
      className={twMerge("object-contain h-full w-full", className)}
      style={{ viewTransitionName: label }}
      src={src || baseUrl}
      onClick={onClick}
    />
  );
}

export default Cam;
