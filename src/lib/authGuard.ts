import { Session } from "next-auth";
import connectDB from "@/lib/mongodb";
import Hostel from "@/models/Hostel";
import { IHostel, UserRole } from "@/types";

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Validates that the active session has one of the allowed roles.
 * Throws 401 if unauthenticated, or 403 if role is unauthorized.
 */
export function requireRole(
  session: Session | null | undefined,
  allowedRoles: UserRole[]
): { id: string; role: UserRole; name?: string | null; email?: string | null } {
  if (!session || !session.user || !session.user.id) {
    throw new AuthError("Unauthorized: Authentication required", 401);
  }

  if (!allowedRoles.includes(session.user.role)) {
    throw new AuthError(
      `Forbidden: Requires one of [${allowedRoles.join(", ")}] role`,
      403
    );
  }

  return session.user;
}

/**
 * Validates that the authenticated user either owns the hostel (as adminId)
 * or is a superadmin with platform-wide privileges.
 *
 * Connects to MongoDB, retrieves the hostel, checks ownership, and returns the hostel document.
 * Throws 401 if not authenticated, 404 if hostel not found, and 403 if unauthorized.
 */
export async function requireHostelOwnership(
  session: Session | null | undefined,
  hostelId: string
): Promise<IHostel> {
  const user = requireRole(session, ["admin", "superadmin"]);

  await connectDB();

  const hostel = await Hostel.findById(hostelId);

  if (!hostel) {
    throw new AuthError("Hostel not found", 404);
  }

  const isOwner = hostel.adminId.toString() === user.id.toString();
  const isSuperAdmin = user.role === "superadmin";

  if (!isOwner && !isSuperAdmin) {
    throw new AuthError(
      "Forbidden: You do not have permission to manage this hostel",
      403
    );
  }

  return hostel;
}
