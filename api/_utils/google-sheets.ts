import { createSign, createHash } from "crypto";

interface SheetLogOptions {
  sheetId: string;
  tabName: string;
  values: string[];
}

async function getAccessToken(): Promise<string> {
  const keyJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: keyJson.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsignedToken = `${encode(header)}.${encode(payload)}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const signature = signer.sign(keyJson.private_key, "base64url");

  const jwt = `${unsignedToken}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function logToGoogleSheet(options: SheetLogOptions): Promise<void> {
  const { sheetId, tabName, values } = options;

  const accessToken = await getAccessToken();

  const range = `${tabName}!A:G`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [values],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Sheets append failed: ${res.status} ${err}`);
  }
}
