import { useState } from "react";
import Cam from "./Cam";
import { twMerge } from "tailwind-merge";
import { flushSync } from "react-dom";

type Label = "North" | "East" | "South";
function App() {
  const [interval] = useState(100);
  const [selected, setSelected] = useState<Label | null>(null);
  const [res, setRes] = useState<"high" | "low">("low");

  const update = async (label: Label) => {
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
        <Cam
          label="North"
          baseUrl={`http://ssycwebcam.dyndns.org:1229/cgi-bin/view/image?pro_${res === "high" ? 0 : 1}&`}
          interval={!selected || selected === "North" ? interval : 5000}
          className={twMerge(
            selected === "North" &&
              "col-span-full row-span-full col-start-0 row-start-0 z-10",
            selected && selected !== "North" && "hidden",
          )}
          onClick={() => update("North")}
        />
        <Cam
          label="East"
          baseUrl={`http://ssycwebcam.dyndns.org:1228/cgi-bin/view/image?pro_${res === "high" ? 0 : 1}&`}
          interval={!selected || selected === "East" ? interval : 5000}
          className={twMerge(
            selected === "East" &&
              "col-span-full row-span-full col-start-0 row-start-0 z-10",
            selected && selected !== "East" && "hidden",
          )}
          onClick={() => update("East")}
        />
        <Cam
          label="South"
          baseUrl={`http://ssycwebcam.dyndns.org:1230/cgi-bin/view/image?pro_${res === "high" ? 0 : 1}&`}
          interval={!selected || selected === "South" ? interval : 5000}
          className={twMerge(
            selected === "South" &&
              "col-span-full row-span-full col-start-0 row-start-0 z-10",
            selected && selected !== "South" && "hidden",
          )}
          onClick={() => update("South")}
        />
      </div>
    </div>
  );
}

export default App;
