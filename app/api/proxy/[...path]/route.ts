import { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  // Construct the target API url
  const targetUrl = `${backendUrl}/api/v1/${path.join("/")}`;
  
  // Create headers from the original request
  const requestHeaders = new Headers(request.headers);
  // Remove headers that might cause issues with proxying
  requestHeaders.delete("host");
  requestHeaders.delete("origin");
  requestHeaders.delete("referer");
  
  let fetchUrl = targetUrl;
  // Node 18 IPv6 localhost fallback
  if (fetchUrl.includes("localhost")) {
    fetchUrl = fetchUrl.replace("localhost", "127.0.0.1");
  }

  try {
    const response = await fetch(fetchUrl, {
      method: request.method,
      headers: requestHeaders,
      cache: "no-store",
    });

    // Create response with same body
    const proxiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy over important headers
    const headersToProxy = ["content-type", "content-length", "content-disposition", "content-range", "accept-ranges"];
    headersToProxy.forEach(header => {
      const value = response.headers.get(header);
      if (value) proxiedResponse.headers.set(header, value);
    });

    return proxiedResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Internal Server Proxy Error", { status: 500 });
  }
}
