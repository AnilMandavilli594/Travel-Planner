import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error(
    "Missing SUPABASE_URL. Set it in apps/api/.env (see apps/api/.env.example)."
  );
}

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

const client = jwksClient({
  jwksUri: `${supabaseUrl}/auth/v1/keys`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, undefined);
      return;
    }
    const signingKey = key?.getPublicKey();
    if (!signingKey) {
      callback(new Error("Unable to resolve JWT signing key"), undefined);
      return;
    }
    callback(null, signingKey);
  });
}

export const verifyToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ["RS256", "ES256"],
      },
      (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      }
    );
  });
