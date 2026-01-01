import AppError from "../../shared/AppError";

const checkActiveRole = (role: "HOST" | "TOURIST") => {
  return (req: any, res: any, next: any) => {
    if (req.user.activeRole !== role) {
      throw new AppError(
        403,
        `Switch to ${role} account to access`
      );
    }
    next();
  };
};

export default checkActiveRole;
