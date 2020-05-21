var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(express.static('public'));
const PORT = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.listen(PORT, function () {
  console.log('Example app listening on port: ' + PORT);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/checkAppStatus', (req, res) => {
  const puppeteer = require('puppeteer');

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://egov.uscis.gov/casestatus/landing.do');
    await page.type('#receipt_number', 'LIN2012250494');
    await page.$eval('#landingForm', (form) => form.submit());
    // await page.click('//*[@id="landingForm"]/div/div[1]/div/div[1]/fieldset/div[2]/div[2]/input')
    // await page.screenshot({path: 'example.png'});
    await page.waitForSelector('.appointment-sec ');
    await page.screenshot({ path: 'example2.png' });
    const searchText = await page.$('.appointment-sec .text-center h1');
    const text = await page.evaluate(
      (searchText) => searchText.textContent,
      searchText
    );
    await browser.close();
    console.log(text);
    res.send(text)
  })();
});
module.exports = app;
