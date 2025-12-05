import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Este método maneja el resultado de la estrategia
  handleRequest(err, user, info) {
    // Si hay error o no hay usuario, imprimimos QUÉ PASÓ
    if (err || !user) {
      console.log('🛑 ERROR DE AUTENTICACIÓN DETECTADO:');
      console.log('Error (err):', err);
      console.log('Info (info):', info); // <--- AQUÍ ESTÁ LA CLAVE
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
