const CAMERAS = {
  north: "http://ssycwebcam.dyndns.org:1229/cgi-bin/view/image",
  east: "http://ssycwebcam.dyndns.org:1228/cgi-bin/view/image",
  south: "http://ssycwebcam.dyndns.org:1230/cgi-bin/view/image",
};

export default {
  async fetch(request) {
    const reqUrl = new URL(request.url);
    const cameraId = reqUrl.pathname.replace(/\//g, "").toLowerCase();
    const resolution = reqUrl.searchParams.get("res") === "high" ? "high" : "low";

    const upstreamBase = CAMERAS[cameraId];
    if (!upstreamBase) {
      return new Response("Camera not found", { status: 404 });
    }

    const upstreamUrl = new URL(upstreamBase);
    upstreamUrl.searchParams.set(`pro_${resolution === "high" ? 0 : 1}`, "");

    const response = await fetch(upstreamUrl.toString(), {
      cf: {
        cacheEverything: true,
        cacheTtl: 5,
      },
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=5",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
