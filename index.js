// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://egov.uscis.gov/casestatus/landing.do');
//   await page.type('#receipt_number', 'LIN2012250494');
//   await page.$eval('#landingForm', form => form.submit());
//   // await page.click('//*[@id="landingForm"]/div/div[1]/div/div[1]/fieldset/div[2]/div[2]/input')
//   // await page.screenshot({path: 'example.png'});
//   await page.waitForSelector('.appointment-sec ');
//   await page.screenshot({path: 'example2.png'});
//   const searchText = await page.$(".appointment-sec .text-center h1");
//   const text = await page.evaluate(searchText => searchText.textContent, searchText);

//   console.log(text)

//   await browser.close();
// })();


const puppeteerLambda = require('puppeteer-lambda');


(async () => {
  const browser = await puppeteerLambda.getBrowser({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://egov.uscis.gov/casestatus/landing.do');
  await page.type('#receipt_number', '<Receipt Number>'); // Enter receipt number here.
  await page.$eval('#landingForm', form => form.submit());
  // await page.click('//*[@id="landingForm"]/div/div[1]/div/div[1]/fieldset/div[2]/div[2]/input')
  // await page.screenshot({path: 'example.png'});
  await page.waitForSelector('.appointment-sec ');
  await page.screenshot({path: 'example2.png'});
  const searchText = await page.$(".appointment-sec .text-center h1");
  const text = await page.evaluate(searchText => searchText.textContent, searchText);

  console.log(text)

  await browser.close();
})();
