import express from "express";
import puppeteer from "puppeteer";

const url = "https://www.express.com/mens-clothing/sale/clearance/cat890006";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await expressScraper(url);
    res.send(products);
  } catch (e) {
    res.send(e);
    res.sendStatus(500);
  }
});

async function expressScraper(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForTimeout(1000);

  // await page.screenshot({ path: "express.png", fullPage: true });

  // Product names
  const productInfo = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".dNZkh")).map((item) => {
      const item_img = item.querySelector("._1vuRDTYH").src;
      const item_name = item.querySelector(".x1Y39").textContent;
      const item_price = item.querySelector("._2_1fIaBi").textContent;

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
