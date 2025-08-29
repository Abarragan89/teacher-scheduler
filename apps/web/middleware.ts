import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/actions/session";

export default async function middleware(req: NextRequest) {
    const session = await getSession();
    if (!session || !session.user) {
        return NextResponse.redirect(new URL('/auth/signin', req.nextUrl))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile']
}

// This is what chatGPT told me to do 
// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

// export default async function middleware(req: NextRequest) {
//   const cookie = req.cookies.get("session")?.value;

//   if (!cookie) {
//     return NextResponse.redirect(new URL("/auth/signin", req.url));
//   }

//   try {
//     const { payload } = await jwtVerify(cookie, secretKey, {
//       algorithms: ["HS256"],
//     });

//     // Optionally, attach user info to headers for downstream usage
//     const res = NextResponse.next();
//     res.headers.set("x-user-id", payload.user?.id ?? "");
//     return res;
//   } catch (e) {
//     console.error("Invalid session", e);
//     return NextResponse.redirect(new URL("/auth/signin", req.url));
//   }
// }

// export const config = {
//   matcher: ["/profile"],
// };