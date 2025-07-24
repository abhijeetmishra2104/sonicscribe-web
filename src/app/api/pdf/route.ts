import { NextRequest } from "next/server";
import os from "os";

let puppeteer: any;
let launchOptions: any;

if (os.platform() === "darwin" || os.platform() === "linux" || os.platform() === "win32") {
  puppeteer = await import("puppeteer");
  launchOptions = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1200, height: 800 },
  };
} else {
  const chromium = (await import("@sparticuz/chromium")).default;
  puppeteer = await import("puppeteer-core");
  launchOptions = {
    headless: true,
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    defaultViewport: { width: 1200, height: 800 },
  };
}


export async function POST(req: NextRequest) {
  const { analysis } = await req.json();
  const analysisEncoded = encodeURIComponent(analysis);

  const browser = await puppeteer.launch(launchOptions);

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
