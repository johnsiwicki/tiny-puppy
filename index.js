const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const lighthouse = require('lighthouse');
const {URL} = require('url');
const fs = require('fs');


 

module.exports = function(myVar) {

 console.log(myVar);

//screenshots of common viewports
(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();

  // An array of viewport sizes for different devices.
  const viewports = [1600, 1000, 800, 640, 320, 240];

  await page.goto(myVar);

  for(let i=0; i < viewports.length; i++) {
    let vw = viewports[i];

    // Set only matters of fullpage: false 
    await page.setViewport({
      width: vw,
      height: 1000
    });

    await page.screenshot({
      path: `./screenshots/screen-${vw}.png`,
      fullPage: true
    });
  };
  browser.close();
})();


// Lighthouse Time

 

(async() => {
// Use Puppeteer to launch headless Chrome.
const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
const remoteDebugPort =(new URL(browser.wsEndpoint())).port;

// Watch for Lighthouse to open url, then customize network conditions.
// Note: re-establishes throttle settings every time LH reloads the page. Shooooould be ok :)
browser.on('targetchanged', async target => {
  const page = await target.page();

  if (page && page.url() === myVar) {
    const client = await page.target().createCDPSession();
    // await client.send('Network.enable'); // Already enabled by pptr.
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      // values of 0 remove any active throttling. crbug.com/456324#c9
      latency: 0,
      downloadThroughput: Math.floor(1.6 * 1024 * 1024 / 8), // 1.6Mbps
      uploadThroughput: Math.floor(750 * 1024 / 8) // 750Kbps
    });
  }
});

// Lighthouse opens url and tests it.
// Note: Possible race with Puppeteer observing the tab opening using `targetchanged` above.
const {report} = await lighthouse(myVar, {
  port: remoteDebugPort,
  output: 'html',
  logLevel: 'info',
  disableNetworkThrottling: true,
  //disableCpuThrottling: true,
  //disableDeviceEmulation: true,
});

// Save html report.
fs.writeFileSync('results.html', report);
console.log('Results written.');

await browser.close();
})();



};



309   /  630


 