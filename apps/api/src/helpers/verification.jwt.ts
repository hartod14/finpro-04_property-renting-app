import jwt from 'jsonwebtoken';

export function verificationJwt(email: string): string {
   const token = jwt.sign({ email }, process.env.SECRET as string, { expiresIn: '1h' });
   return token;
}

export function decodeVerificationJwt(token: string) {
  const decoded = jwt.verify(token, process.env.SECRET as string);
  return decoded;
}

