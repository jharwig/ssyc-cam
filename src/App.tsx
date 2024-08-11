import { useState } from "react";
import Cam from "./Cam";
import { twMerge } from "tailwind-merge";
import { flushSync } from "react-dom";

type Label = "North" | "East" | "South";
function App() {
  const [interval] = useState(250);
  const [selected, setSelected] = useState<Label | null>(null);

  const update = (label: Label) => {
    if ("startViewTransition" in document) {
      // @ts-expect-error
      document.startViewTransition(async () => {
        flushSync(() => {
          setSelected((selected) => (selected === label ? null : label));
        });
      });
    } else {
      setSelected((selected) => (selected === label ? null : label));
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-1 w-full h-full  max-w-screen max-h-screen">
        {(!selected || selected === "North") && (
          <Cam
            label="North"
            baseUrl="http://ssycwebcam.dyndns.org:1229/cgi-bin/view/image?pro_0&"
            interval={interval}
            className={twMerge(
              selected === "North" &&
                "col-span-full row-span-full col-start-0 row-start-0",
            )}
            onClick={() => update("North")}
          />
        )}
        {(!selected || selected === "East") && (
          <Cam
            label="East"
            baseUrl="http://ssycwebcam.dyndns.org:1228/cgi-bin/view/image?pro_0&"
            interval={interval}
            className={twMerge(
              selected === "East" &&
                "col-span-full row-span-full col-start-0 row-start-0",
            )}
            onClick={() => update("East")}
          />
        )}
        {(!selected || selected === "South") && (
          <Cam
            label="South"
            baseUrl="http://ssycwebcam.dyndns.org:1230/cgi-bin/view/image?pro_0&"
            interval={interval}
            className={twMerge(
              selected === "South" &&
                "col-span-full row-span-full col-start-0 row-start-0",
            )}
            onClick={() => update("South")}
          />
        )}
      </div>
    </div>
  );
}

export default App;
