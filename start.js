import puppeteer from 'puppeteer-core';

import { globSync } from "glob";

function getServerPort() {
  return global.__PORT__;
}

function getBrowserExecutable() {
  if (!process.env.BROWSER_EXECUTABLE_PATH) {
    const [chromePath] = globSync([
      `./chromium/**/chromium`,
      `./chromium/**/chrome-linux/chrome`,
      `./chrome/**/chrome-linux*/chrome`,
      `./chrome/**/Google Chrome for Testing*/**/Google Chrome for Testing`,
    ]);
    if (!chromePath) throw new Error("Chromium not found, try running 'yarn install-browser'");
    console.log("chromePath", chromePath);
    return chromePath;
  }
}

function getURL(page){
    return Promise.resolve(page.url());
  }

async function start() {
  const browser = puppeteer.launch({
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-gpu-sandbox",
            "--disable-blink-features=AutomationControlled",
          ],
          executablePath: getBrowserExecutable(),
          headless: true,
          dumpio: !!process.env.WEBSPIDER_DUMPIO_ENABLED,
          defaultViewport: null,
        });

    const page = await (await browser).newPage()
    const url = await getURL(page);
    console.log("url", url);
    await (await browser).close()
}

await start();
