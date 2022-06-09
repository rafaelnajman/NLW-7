import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Token not provided" });
  }

  //bearer token
  //[0] = bearer
  //[1] = token
  const [, token] = req.headers.authorization.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_KEY) as IPayload;

    req.user_id = sub;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "expired token" });
  }
}
