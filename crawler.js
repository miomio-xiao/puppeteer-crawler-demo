const puppeteer = require('puppeteer');

async function getResultArr(uid = 310649) {
  const baseURL = `http://bangumi.tv/anime/list/${uid}/collect`;
  const browser = await puppeteer.launch({
    executablePath: `C:/Users/admin/AppData/Local/Google/Chrome SxS/Application/chrome`
  });
  const page = await browser.newPage();
  await page.goto(baseURL);

  const ITEM_TOTAL_SELECTOR = '.navSubTabs > li:nth-child(2)';
  let total = await page.evaluate(el => {
    const text = document.querySelector(el).innerText;
    return text.match(/看过 \((\d+)\)/)[1];
  }, ITEM_TOTAL_SELECTOR);
  let numPages = Math.ceil(total / 24);

  let resultArr = [];
  const ITEM_SELECTOR = '#browserItemList > li';
  for (let h = 1; h <= numPages; h++) {
    await page.goto(`${baseURL}?page=${h}`);
    let info = await page.evaluate(el => {
      return [...document.querySelectorAll(el)].map($item => {
        const ITEM_NAME_SELECTOR = '.inner > h3 > a';
        const ITEM_INFO_SELECTOR = '.inner > .info';
        const ITEM_COLLECT_SELECTOR = '.inner > .collectInfo';
        const $name = $item.querySelector(ITEM_NAME_SELECTOR);
        const subjectId = $name.href.match(/\/subject\/(\d+)/)[1];
        const name = $name.innerText;
        const info = $item.querySelector(ITEM_INFO_SELECTOR).innerText;
        const collect = $item.querySelector(ITEM_COLLECT_SELECTOR).innerText;
        return {
          subjectId,
          name,
          info,
          collect
        };
      });
    }, ITEM_SELECTOR);
    resultArr.push(...info);
  }
  browser.close();
  return resultArr;
}

module.exports = {
  getResultArr
};
