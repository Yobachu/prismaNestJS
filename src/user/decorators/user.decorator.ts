import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequestInterface } from '../../types/expressRequest.interface';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();
  if (!request.user) {
    return null;
  }

  if (data) {
    request.user[data];
  }
  const user = request.user;
  delete user.password;
  return request.user;

  return 'foooooo';
});
