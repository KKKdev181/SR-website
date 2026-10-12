import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadUsers, saveUsers, hashPassword, validUsername, storePath } from "./userStore.mjs";

const name=process.argv[2]?.trim();
const username=process.argv[3]?.trim().toLowerCase();
const role=process.argv[4] || "admin";
if(!name || !validUsername(username) || !["admin","editor"].includes(role)){
  console.error("Usage: node server/createUser.mjs 'Full Name' username admin|editor");
  process.exit(1);
}
const users=await loadUsers();
if(users.some(user=>user.username.toLowerCase()===username)){console.error("This username already exists.");process.exit(1);}
const rl=createInterface({input,output});
let password;
try {password=await rl.question("Enter new account password (12+ chars; terminal input visible): ");} finally {rl.close();}
if(!password || password.length<12){console.error("Password must be at least 12 characters.");process.exit(1);}
const passwordHash=await hashPassword(password);
users.push({name,username,role,passwordHash,enabled:true,createdAt:new Date().toISOString()});
await saveUsers(users);
console.log("Account created in "+storePath+". Protect and back up this file; do not commit it.");
