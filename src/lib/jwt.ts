import { sign, verify, SignOptions } from "jsonwebtoken";

export function signJwt(payload: string | object | Buffer, expiresIn: string = "1h") {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  const options: SignOptions = {
    expiresIn: expiresIn as unknown as SignOptions["expiresIn"],
  };

  return sign(payload, JWT_SECRET, options);
}

export function verifyJwt(token: string) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
