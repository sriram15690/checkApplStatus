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

app.get('/', (req, res) => {
  bot.sendMessage(352236943, 'hellooo');
  res.send('Hello World!');
});

app.get('/checkAppStatus', (req, res) => {
  const puppeteer = require('puppeteer');

  (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://egov.uscis.gov/casestatus/landing.do');
      await page.type('#receipt_number', 'LIN2012250494');
      await page.$eval('#landingForm', (form) => form.submit());
      // await page.click('//*[@id="landingForm"]/div/div[1]/div/div[1]/fieldset/div[2]/div[2]/input')
      // await page.screenshot({path: 'example.png'});
      await page.waitForSelector('.appointment-sec ');
      // await page.screenshot({ path: 'example2.png' });
      const searchText = await page.$('.appointment-sec .text-center h1');
      let textMsg = await page.evaluate(
        (searchText) => searchText.textContent,
        searchText
      );
      await browser.close();
      console.log(textMsg);
      res.send(textMsg);
      notifyAppStatusGrp(textMsg);
    } catch (e) {
      console.log('******* Errror ******');
      console.log(e);
      const errorText = 'Sorry!! Something went wrong.';
      notifyAppStatusGrp(errorText);
      res.send(errorText);
    }
  })();
});

const notifyAppStatusGrp = (text) => {
  bot.sendMessage(-409024715, text);
};

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1289915224:AAHxORwNE83XyWUTIJT7tJwtl25WvojWymc';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/   (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  console.log(msg.chat.id);
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg.chat.id);
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

module.exports = app;
