import { stdin as input, stdout as output } from "node:process";
import { loadUsers, saveUsers, hashPassword, validUsername, storePath } from "./userStore.mjs";

const name=process.argv[2]?.trim();
const username=process.argv[3]?.trim().toLowerCase();
const role=process.argv[4] || "admin";
if(!name || !validUsername(username) || !["admin","editor"].includes(role)){
  console.error("Usage: node server/createUser.mjs 'Full Name' username admin|editor");
  process.exit(1);
}
if(!input.isTTY || typeof input.setRawMode!=="function") {
  console.error("Run this command in an interactive terminal to enter the password privately.");
  process.exit(1);
}
const users=await loadUsers();
if(users.some(user=>user.username.toLowerCase()===username)){console.error("This username already exists.");process.exit(1);}
function secretPrompt(message) {
  return new Promise((resolve,reject)=>{
    let password="";
    output.write(message);
    input.setRawMode(true);
    input.resume();
    const finish=(error)=>{
      input.removeListener("data",onData);
      input.setRawMode(false);
      input.pause();
      output.write("\n");
      if(error)reject(error);else resolve(password);
    };
    const onData=(chunk)=>{
      const data=chunk.toString("utf8");
      if(data==="\r"||data==="\n")return finish();
      if(data==="\u0003")return finish(new Error("Cancelled"));
      if(data==="\u007f"||data==="\b"){password=password.slice(0,-1);return;}
      if(password.length+data.length<=256 && !data.includes("\n"))password+=data;
    };
    input.on("data",onData);
  });
}
const password=await secretPrompt("New account password (hidden; minimum 12 characters): ");
if(password.length<12)throw new Error("Password must be at least 12 characters.");
const confirm=await secretPrompt("Confirm account password: ");
if(confirm!==password)throw new Error("Passwords do not match.");
users.push({name,username,role,passwordHash:await hashPassword(password),enabled:true,createdAt:new Date().toISOString()});
await saveUsers(users);
console.log("Account created in "+storePath+". Protect and back up this file; do not commit it.");
