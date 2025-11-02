import dotenv from 'dotenv';
import { google } from "googleapis";
import readline from "readline";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from frontend directory
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/google"
);

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
];

// Debug: Check if env vars are loaded
console.log("🔧 Environment check:");
console.log(`Client ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Loaded' : '❌ Missing'}`);
console.log(`Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Loaded' : '❌ Missing'}`);
console.log(`Redirect URI: ${process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'}\n`);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("🔗 Authorize this app by visiting this URL:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste the code from the browser here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n✅ Your refresh token:\n", tokens.refresh_token);
    console.log("\n📝 Add this to your .env.local file:");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (err) {
    console.error("❌ Error retrieving access token", err);
  }
  rl.close();
});
