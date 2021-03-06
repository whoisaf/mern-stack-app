import { Request } from "express";

import env from "./env";

/**
 *  Get client base
 *  @desc useful to figure out redirect root when in development mode
 */
export const getClientBase = (): string => {
  return env.get("NODE_ENV") === "development"
    ? `http://localhost:${env.get("CLIENT_PORT")}`
    : "";
};

/**
 *  Get base url
 *  @desc useful to determine host based on environment
 */
export const getBaseUrl = (req: Request): string => {
  const protocol = `http${env.get("IS_SSL") ? "s" : ""}`;
  const host =
    env.get("NODE_ENV") === "production"
      ? req.headers.host
      : `localhost:${env.get("CLIENT_PORT")}`;

  return `${protocol}://${host}`;
};
