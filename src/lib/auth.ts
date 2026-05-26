import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(user: string) {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export function checkCredentials(user: string, pass: string) {
  const u1 = process.env.ADMIN_USER;
  const p1 = process.env.ADMIN_PASS;
  const u2 = process.env.ADMIN_USER2;
  const p2 = process.env.ADMIN_PASS2;
  return (user === u1 && pass === p1) || (user === u2 && pass === p2);
}
