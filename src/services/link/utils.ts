import shortid from 'shortid';
import { getLinkbyHash } from '../db/dal';
export async function generateHash () {
  const hash = shortid.generate();

  const existing = await getLinkbyHash(hash);
  if (existing) return generateHash();

  return hash;
}
