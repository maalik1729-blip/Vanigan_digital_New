import server from "../dist/server/server.js";

// Tell Vercel this function can run up to 30s (Pro) or 10s (Hobby)
export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  try {
    // 1. Construct URL
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);

    // 2. Build Headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const val of value) {
            headers.append(key, val);
          }
        } else {
          headers.set(key, value);
        }
      }
    }

    // 3. Read Body (if any)
    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await getRawBody(req);
    }

    // 4. Create Web Request
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
      ...(body ? { duplex: "half" } : {}),
    });

    // 5. Call the TanStack Start server handler
    const webResponse = await server.fetch(webRequest, {}, {});

    // 6. Write Web Response back to Vercel ServerResponse
    res.statusCode = webResponse.status;
    res.statusMessage = webResponse.statusText;

    webResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        const cookies = webResponse.headers.getSetCookie();
        res.setHeader("set-cookie", cookies);
      } else {
        res.setHeader(key, value);
      }
    });

    // Send the response body
    const responseBody = await webResponse.arrayBuffer();
    res.end(Buffer.from(responseBody));

  } catch (error) {
    console.error("Vercel bridge error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", (err) => reject(err));
  });
}
