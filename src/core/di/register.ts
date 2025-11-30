import { container } from "tsyringe";
import { JwtService } from "@/core/services/jwt.service";
import { registerAuthDependencies } from "@/features/auth/auth.registry";

export function registerDependencies() {
  // Core Services
  container.register(JwtService, { useClass: JwtService });

  // Feature Modules
  registerAuthDependencies();
}
