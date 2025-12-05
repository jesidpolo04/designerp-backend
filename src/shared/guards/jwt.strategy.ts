import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      // 1. Obtención dinámica de la Clave Pública (JWKS)
      secretOrKeyProvider: passportJwtSecret({
        cache: true, // Guardar en caché para no pedirla siempre
        rateLimit: true, // Evitar saturar la API de Microsoft
        jwksRequestsPerMinute: 5,

        // URL Estándar de las claves de Microsoft
        jwksUri: `https://login.microsoftonline.com/common/discovery/keys`,
      }),

      // 2. Configuración de validación
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Leer del header Authorization
      ignoreExpiration: false, // Rechazar si expiró

      // 3. Validar la Audiencia (¿Es para mi backend?)
      audience: process.env.AZURE_CLIENT_ID, // El ID de tu App Backend en Azure

      // 4. Validar el Emisor (¿Viene de mi Tenant?)
      issuer: `https://sts.windows.net/${process.env.AZURE_TENANT_ID}/`,

      algorithms: ['RS256'], // El algoritmo de firma de Azure
    });
  }

  // Si la firma es válida, Nest ejecuta esto y lo que retornes se inyecta en `request.user`
  validate(payload: EntraIdJwtPayload) {
    this.logger.log('Token válido. Datos del usuario:', payload);
    return {
      userId: payload.oid,
      email: payload.preferred_username,
      roles: payload.roles || [], // Útil si usas App Roles en Azure
    };
  }
}

export interface EntraIdJwtPayload {
  aud: string; // Audiencia
  iss: string; // Emisor
  iat: number; // Emitido en (timestamp)
  nbf: number; // No antes de (timestamp)
  exp: number; // Expiración (timestamp)
  aio: string;
  azp: string; // ID de la aplicación cliente
  family_name: string; // Apellido
  given_name: string; // Nombre
  ipaddr: string; // Dirección IP
  name: string; // Nombre completo
  oid: string; // ID único del usuario
  preferred_username: string; // Nombre de usuario (normalmente email)
  rh: string;
  roles?: string[]; // Roles asignados al usuario
  sub: string; // Sujeto (ID del token)
  tid: string; // ID del Tenant
  uti: string;
  ver: string; // Versión del token
}
