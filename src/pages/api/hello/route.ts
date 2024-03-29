// To stream responses you must use Route Handlers in the App Router, even if the rest of your app uses the Pages Router.

export const dynamic = "force-dynamic"; // static by default, unless reading the request
import runSocket from "@/lib/socket";

export function GET(request: Request) {
  runSocket();
  return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
