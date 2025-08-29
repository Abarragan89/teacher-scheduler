"use server";
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type Session = {
    user: {
        id: string,
        name: string
    },
    accessToken: string,
    // refreshToken: string
}

const secretKey = process.env.SESSION_SECRET_KEY!
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(payload: Session) {

    const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // JWT package won't work in teh middleware or edge functions
    // We need to encrypt out session using JOSE

    const session = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(encodedKey);

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiredAt,
        sameSite: 'lax',
        // PATH: The cookie is valid for the entire site.  
        path: '/'
    })
};

export async function getSession() {

    // check for cookie value
    const cookie = (await cookies()).get('session')?.value
    if (!cookie) return null;

    try {
        // Veryfiy the token and return it
        const { payload } = await jwtVerify(cookie, encodedKey, {
            algorithms: ['HS256']
        });
        return payload as Session;

    } catch (error) {
        console.error('Failed to verify the session')
        redirect('/auth/signin')
    }
};


export async function deleteSession() {
    (await cookies()).delete('session')
}