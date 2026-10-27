import bcrypt from 'bcryptjs';

/** No passwordless or guessed confirmation value can authorize destructive writes. */
export async function verifyWarehouseDestructiveAction(
  actor: { id: string; warehouseId: string },
  storedUser: { id: string; passwordHash?: string | null },
  membershipRole: string | null | undefined,
  password: unknown,
): Promise<boolean> {
  if (!actor?.id || !actor.warehouseId || actor.id !== storedUser?.id || membershipRole !== 'admin') return false;
  if (typeof password !== 'string' || password.length === 0 || !storedUser.passwordHash) return false;
  return bcrypt.compare(password, storedUser.passwordHash);
}
