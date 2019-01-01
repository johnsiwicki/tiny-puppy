const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const devices = require('puppeteer/DeviceDescriptors');
const iPhonex = devices['iPhone X'];
const iPhoneSE = devices['iPhone SE'];
const Pixel2 = devices['Pixel 2'];


//setup our app

//make our images viewable
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

//Something so we can post data
app.use(bodyParser.urlencoded({
    extended: true
}));


//setup our homepage
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

//our logic starts here 
app.post("/", async (request, response) => {
  try {
    (async () => {
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();
      
       
      //log page errors
      
      var pageB = new Array();
         page.on("pageerror", function(err) {  
            var theTempValue = err.toString();
            //console.log("Page error: " + theTempValue); 
           pageB.push(theTempValue);
        });
      
      
 
      

          // An array of viewport sizes for different devices.
          const viewports = [1366, 1280, 1024, 640, 414, 411, 375, 320];
          const viewheights = [1024, 1024, 1024, 1136, 732, 732, 667, 568];

          await page.goto(request.body.url);

          for(let i=0; i < viewports.length; i++) {
            let vw = viewports[i];
            let vh = viewheights[i];

            // Set only matters if fullpage: false 
            await page.setViewport({
              width: vw,
              height: vh
            });

            await page.screenshot({
                path: 'public/screen-'+vw+'.png',
                fullPage: false
            });
          };
        
        //iphone x
        await page.emulate(iPhonex);
        await page.screenshot({ path: 'public/site-iphoneX.png'});
      
       await page.emulate(iPhoneSE);
       await page.screenshot({ path: 'public/site-iPhoneSE.png'});
      
      
      await page.emulate(Pixel2);
      await page.screenshot({ path: 'public/site-Pixel2.png'});
      
      // page title 
      const title = await page.title();
      const pDesc = await page.$eval("head > meta[name='description']", element => element.content);
      const h1 = await page.$eval("h1", el => el.innerText);
      console.log(title);
      console.log(pDesc);
      console.log(h1);
      
      
      
      
      var errorB = pageB.length;
    
     console.log(errorB);
      
      await browser.close();
     
      //take our template and send back to the user
      response.render(`${__dirname}/views/done`, { 
        url:request.body.url,
        title:title,
        pDesc:pDesc,
        error:errorB,
        h1:h1
      });
      
 
      
    })();
    
    } catch (error) {
    console.log(error);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});