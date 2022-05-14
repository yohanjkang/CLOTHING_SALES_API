import express from "express";
import puppeteer from "puppeteer";

const url = "https://www.uniqlo.com/us/en/feature/sale/men";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await uniqloScraper(url);
    res.send(products);
  } catch (e) {
    res.send(e);
    res.sendStatus(500);
  }
});

async function uniqloScraper(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForTimeout(1000);

  // await page.screenshot({ path: "uniqlo.png", fullPage: true });

  // Product names
  const productInfo = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".uq-ec-product-tile-resize-wrapper")
    ).map((item) => {
      const item_img = item.querySelector(".uq-ec-image__img").src;
      const item_name = item.querySelector(
        ".uq-ec-product-tile__end-product-name"
      ).textContent;
      const item_price = item.querySelector(".uq-ec-price-text").textContent;

      return {
        item_img: item_img,
        item_name: item_name,
        item_price: item_price,
      };
    })
  );

  return productInfo;
}

export default router;
