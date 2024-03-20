import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JWTSecret } from '../../config';
import { ExpressRequestInterface } from '../../types/expressRequest.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = this.jwtService.verify(token, { secret: JWTSecret });
      req.user = decode;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
