import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// トークン検証
function verifyToken(signedToken: string, secret: string): boolean {
  const parts = signedToken.split('.');
  if (parts.length !== 2) return false;

  const [token, signature] = parts;
  const encoder = new TextEncoder();
  const data = encoder.encode(token + secret);
  const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(data))).substring(0, 32);

  return signature === expectedSignature;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const sessionSecret = process.env.SESSION_SECRET || 'default-secret';
    const isValid = verifyToken(sessionCookie.value, sessionSecret);

    return NextResponse.json({
      authenticated: isValid,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
