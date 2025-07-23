// app/api/pdf/route.ts
import { NextRequest } from "next/server";
import os from "os";

let puppeteer: any;
let executablePath: string;
let args: string[];

if (os.platform() === "darwin" || os.platform() === "linux" || os.platform() === "win32") {
  // Local development (macOS, Linux, Windows)
  puppeteer = await import("puppeteer");
  executablePath = undefined; // Puppeteer will use its own Chromium
  args = ["--no-sandbox", "--disable-setuid-sandbox"];
} else {
  // Vercel / production
  const chromium = await import("@sparticuz/chromium");
  puppeteer = await import("puppeteer-core");
  executablePath = await chromium.executablePath();
  args = chromium.args;
}

export async function POST(req: NextRequest) {
  const { analysis } = await req.json();
  const analysisEncoded = encodeURIComponent(analysis);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args,
    defaultViewport: { width: 1200, height: 800 },
  });

  const page = await browser.newPage();
  await page.goto(`${process.env.NEXT_PUBLIC_BASE_URL}/pdf/preview?analysis=${analysisEncoded}`, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=sonicscribe-analysis.pdf",
    },
  });
}
