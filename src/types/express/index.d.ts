import { AuthUser } from '../../app/modules/auth/auth.types'; 

import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: UserRole;
    }

    interface Request {
      user?: AuthUser;
      file?: Express.Multer.File;
    }
  }
}
