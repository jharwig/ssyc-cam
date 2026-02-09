import { useState } from "react";
import Cam from "./Cam";
import { twMerge } from "tailwind-merge";
import { flushSync } from "react-dom";
import { buildCameraUrl, CAMERA_ORDER, type CameraId } from "./cameras";
function App() {
  const [interval] = useState(1000);
  const [selected, setSelected] = useState<CameraId | null>(null);
  const [res, setRes] = useState<"high" | "low">("low");

  const update = async (label: CameraId) => {
    if ("startViewTransition" in document) {
      // @ts-expect-error
      const t = document.startViewTransition(async () => {
        flushSync(() => {
          setSelected((selected) => (selected === label ? null : label));
        });
      });
      await t.finished;
      setRes(label === selected ? "low" : "high");
    } else {
      setSelected((selected) => (selected === label ? null : label));
      setRes(label === selected ? "low" : "high");
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-1 w-full h-full  max-w-screen max-h-screen">
        {CAMERA_ORDER.map((label) => (
          <Cam
            key={label}
            label={label}
            baseUrl={buildCameraUrl(label, res)}
            interval={!selected || selected === label ? interval : 5000}
            className={twMerge(
              selected === label &&
                "col-span-full row-span-full col-start-0 row-start-0 z-10",
              selected && selected !== label && "hidden",
            )}
            onClick={() => update(label)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
