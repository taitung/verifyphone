'use strict';


const http = require('http');
const os = require('os');

const hostname = '0.0.0.0';
const port = 3000;

const parsePhoneNumberFromString = require('libphonenumber-js').parsePhoneNumberFromString;

const server = http.createServer((req, res) => {
  // health
  if (req.url.startsWith('/health') && req.method === 'GET') {
  	res.statusCode = 200;
  	res.end();
  } else if (req.url.startsWith('/numbers') && req.method === 'GET' ) {
    const arr = req.url.split('/');
    const rawNumber = decodeURIComponent(arr[2]);
    let formatedNumber;
    let internationalFmt;
    let isValid;
    let phoneType;

    try {
      formatedNumber = parsePhoneNumberFromString(rawNumber);
      internationalFmt = formatedNumber.formatInternational();
      isValid = formatedNumber.isValid();
      if (isValid) {
        phoneType = formatedNumber.getType();
      } else {
        phoneType = 'n/a';
      }
      res.statusCode = 200;
    } catch (ex) {
      console.error('>> ', ex);
      res.statusCode = 400;
      internationalFmt = 'n/a';
      isValid = false;
      phoneType = 'n/a';
    }
    const rawHtml = '<p>Raw input: ' + rawNumber + '</p>';
    const fmtHtml = '<p>International number format: ' + internationalFmt + '</p>';
    const isValidHtml = '<p>Isvalid: ' + isValid + '</p>';
    const typeHtml = '<p>Type: ' + phoneType + '</p>';
    let content = '<html><body><h2>' + rawHtml + fmtHtml + isValidHtml + typeHtml + '</h2></body></html>';
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end(content);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end('<html><body><h1>Hello world from host name: ' + os.hostname() + '</h1></body></html>');
  }
});

server.listen(port, hostname, () => {
  console.log('running');
});
