import { randomBytes, scrypt as callbackScrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { readFile, writeFile, mkdir, rename, chmod } from "node:fs/promises";
import { dirname, resolve } from "node:path";
const scrypt = promisify(callbackScrypt);
export const storePath = resolve(process.env.PORTAL_USERS_FILE || "./private-data/users.json");
export async function loadUsers() {
  try {
    const users = JSON.parse(await readFile(storePath, "utf8"));
    return Array.isArray(users) ? users : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
export async function saveUsers(users) {
  await mkdir(dirname(storePath), { recursive: true, mode: 0o700 });
  const temporary = storePath + "." + randomBytes(8).toString("hex") + ".tmp";
  await writeFile(temporary, JSON.stringify(users, null, 2), { mode: 0o600, flag: "wx" });
  await rename(temporary, storePath);
  await chmod(storePath, 0o600);
}
export async function hashPassword(password) {
  if (typeof password !== "string" || password.length < 12 || password.length > 256) throw new Error("Password must be 12–256 characters.");
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:16384:8:1:${salt.toString("hex")}:${Buffer.from(derived).toString("hex")}`;
}
export async function verifyPassword(password, encoded) {
  if (typeof password !== "string" || !encoded?.startsWith("scrypt:")) return false;
  const [, n, r, p, salt, digest] = encoded.split(":");
  if (n !== "16384" || r !== "8" || p !== "1" || !/^[a-f0-9]{32}$/.test(salt ?? "") || !/^[a-f0-9]{128}$/.test(digest ?? "")) return false;
  const expected = Buffer.from(digest, "hex");
  const actual = Buffer.from(await scrypt(password, Buffer.from(salt, "hex"), 64, { N: 16384, r: 8, p: 1 }));
  return timingSafeEqual(expected, actual);
}
export function tokenDigest(value) { return createHash("sha256").update(value).digest("hex"); }
export function validUsername(value) { return typeof value === "string" && /^[a-zA-Z0-9._-]{3,40}$/.test(value); }
