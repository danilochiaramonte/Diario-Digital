// Marcador identifica senhas já hasheadas, permitindo migração transparente de senhas legacy.
const HASH_PREFIX = 'sha256:';

export async function hashPassword(plain) {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', enc.encode(plain));
  const hex = Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return HASH_PREFIX + hex;
}

export function isHashed(value) {
  return typeof value === 'string' && value.startsWith(HASH_PREFIX);
}

// Aceita hash ou texto plano (legacy). Chamador deve migrar se !isHashed(stored).
export async function verifyPassword(plain, stored) {
  if (!stored) return false;
  if (isHashed(stored)) {
    return (await hashPassword(plain)) === stored;
  }
  return plain === stored;
}
