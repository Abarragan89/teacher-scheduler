import { deleteSession } from "@/lib/actions/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await deleteSession()

    revalidatePath('/');
    console.log('request url ', req.url)
    console.log('request next url ', req.nextUrl)
    return NextResponse.redirect(new URL("/", req.nextUrl));
}