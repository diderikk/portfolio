import { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";
import { fetchAdmin } from "./query";

export const validateBasicAuth = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!req.headers.authorization) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Protected"');
    res.statusCode = 401;
    res.end("Unauthorized");
  } else {
    const [username, password] = await decode(req.headers.authorization);
    if (username !== process.env.ADMIN1) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Protected"');
      res.statusCode = 401;
    }
    const admin = await fetchAdmin(username);

    const hash = await hashPbkdf2(password, admin.salt);

    if (hash !== admin.hash) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Protected"');
      res.statusCode = 401;
    }
  }
};

export const decode = async (authString: string) => {
  if (!authString.includes("Basic "))
    throw Error("Missing Basic in Authorization header");

  return Buffer.from(authString.split(" ")[1], "base64").toString().split(":");
};

export const encode = async (username: string, password: string) => {
  const encodedCredentials = Buffer.from(`${username}:${password}`).toString(
    "base64"
  );
  return `Basic ${encodedCredentials}`;
};

export const hashPbkdf2 = async (
  password: string,
  salt: string
): Promise<string> => {
  return new Promise((res, rej) => {
    try {
      crypto.pbkdf2(password, salt, 310000, 32, "sha512", (err, derivedKey) => {
        if (err) res("error");
        else res(derivedKey.toString());
      });
    } catch (e) {
      res("");
    }
  });
};
