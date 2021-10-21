import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";


interface IPayLoad{
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      errorCode: "token.invalid",
    });
  }

  //Bearer eu08230182301823819819h2ui12h3i1u2h
  // [0] Bearer
  // [1] 9123198731982739182798391878

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayLoad;

    request.user_id = sub

    return next()

    
  } catch (err) {
    return response.status(401).json({ errorCode: "token.expired" });
  }
}