export type CameraId = "North" | "East" | "South";

export type CameraResolution = "high" | "low";

// Direct upstream HTTP endpoints. These stay HTTP; the Cloudflare Worker
// will sit in front of them and be called over HTTPS to avoid mixed content.
const DIRECT_ENDPOINTS: Record<CameraId, string> = {
  North: "http://ssycwebcam.dyndns.org:1229/cgi-bin/view/image",
  East: "http://ssycwebcam.dyndns.org:1228/cgi-bin/view/image",
  South: "http://ssycwebcam.dyndns.org:1230/cgi-bin/view/image",
};

// Change this (or set VITE_CAM_PROXY_BASE) to your deployed Worker URL.
// Leaving it blank falls back to the direct HTTP endpoints, which will trigger
// mixed-content blocks when served over HTTPS.
const DEFAULT_PROXY_BASE = "https://ssyc-cam-proxy.jason-harwig.workers.dev";

function getProxyBase() {
  const envBase = (import.meta.env.VITE_CAM_PROXY_BASE as string | undefined)?.trim();
  const base = envBase || DEFAULT_PROXY_BASE;
  return base.replace(/\/$/, "");
}

/**
 * Build a URL for the requested camera and resolution. If a proxy base is
 * configured (default: Cloudflare Worker), the URL will be HTTPS and safe for
 * GitHub Pages. Otherwise it falls back to the raw HTTP camera feed.
 */
export function buildCameraUrl(id: CameraId, res: CameraResolution) {
  const proxyBase = getProxyBase();

  if (proxyBase.startsWith("https://")) {
    const url = new URL(`${proxyBase}/${id.toLowerCase()}`);
    url.searchParams.set("res", res);
    return url.toString();
  }

  // Fallback: direct camera (HTTP). Mixed content will be blocked on HTTPS sites.
  return `${DIRECT_ENDPOINTS[id]}?pro_${res === "high" ? 0 : 1}`;
}

export const CAMERA_ORDER: CameraId[] = ["North", "East", "South"];
