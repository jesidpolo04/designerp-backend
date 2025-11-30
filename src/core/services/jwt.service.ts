import jwt, { SignOptions } from "jsonwebtoken";
import { injectable } from "tsyringe";
import { envs } from "@/envs";
import type { StringValue } from "ms";

@injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = envs.JWT_SECRET;
    this.expiresIn = envs.JWT_EXPIRES_IN;
  }

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as StringValue,
    });
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
