// MY TEST SCRAPING CODE BELOW

const cheerio = require('cheerio') // import cheerio module using commonJS
const cors = require('cors') // import cors to allow fetching the api from a different browser

// initializing the cors middleware
const cors_inst = cors({
  methods: ['POST'],
})

// helper method to wait for a middleware to execute before continuing
// and to throw an error when an error happens in a middleware
function runMiddleware (req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

var months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12'
}

export default async (req, res) => { // export the function
  await runMiddleware(req, res, cors_inst)
  if (req.method === 'POST') { // if the request is a post
    const investor = req.body.investor // not using currently

    try { // try to scrape the list of superinvestors and the URLs for their portfolios
      var response = await fetch("https://www.dataroma.com/m/home.php")
      var htmlString = await response.text()
      var $ = cheerio.load(htmlString)

      /* Don't need this for what we are trying to scrape now so I commented it out

      Might be useful later

      // grab the giant string consisting of the entire list of superinvestors
      const investorList = $('span#port_body').text()
      // split the string by the year, which we can discard as all dates are 2021;
      // not the best solution but much simpler than a perfect one
      var tempList = investorList.split(" 2021 ")
      var investors = []
      var updated = []
      // for each entry in the list split into the name and update date
      for (let i = 0; i < tempList.length - 1; i++) {
        // deal with a few oddities: \n's and (New Addition)
        let str = ""
        if (i === 0)
          str = tempList[i].substring(1)
        else if (i === 5)
          str = tempList[i].substring(14)
        else
          str = tempList[i]

        let helperList = str.split(" Updated ")
        investors[i] = helperList[0]
        let date = helperList[1]
        let tokens = date ? date.split(" ") : false
        updated[i] = tokens ? `2021-${months[tokens[1]]}-${tokens[0]}` : false
      }
      */

      // grab investor portfolio URLs
      var links = []
      const rawLinks = $('a', 'span#port_body')
      $(rawLinks).each(function(i, entry) {
        let sop = $(entry).attr('href');
        links[i] = 'https://www.dataroma.com' + sop;  // put local url in array
      });

      //var sharesPerSector = {}
      var valuePerSector = {}
      // grab information from a subset of superinvestor portfolios
      for (let i = 0; i < 3; i++) {
        response = await fetch(links[i])
        htmlString = await response.text()
        $ = cheerio.load(htmlString)
        const tableQuery = $('td.stock', 'table#grid')

        //var tickers = []
        //var shares = []
        var tickerLinks = []
        var value = []
        $(tableQuery).each(function(j, entry) {
          let child = $(entry).children('a') // grab the <a> within the <td>
          tickerLinks[j] = 'https://www.dataroma.com' + child.attr('href'); // grab the link from the <a>
          let valueString = $(entry).next().next().next().next().next().text() // traverse down five elements and grab the total value of the shares
          value[j] = parseInt(valueString.substring(1).replace(/,/g, ''))

          /* Not needed at the moment
          //tickers[i] = child.text() // grab the ticker from the <a>
          //let index = tickers[i].indexOf('-')
          //tickers[i] = tickers[i].substring(0, index - 1)
          //let shareString = $(entry).next().next().text() // traverse down two elements and grab the # of shares
          //shares[i] = parseInt(shareString.replace(/,/g, ''))
          */
        });

        for (let k = 0; k < tickerLinks.length; k++) {
          // grab the sector from an individual stock
          response = await fetch(tickerLinks[k])
          htmlString = await response.text()
          $ = cheerio.load(htmlString)
          let sector = $('td.sect', 'table#t1').next().children('b').text()
          if (sector in valuePerSector) {
            valuePerSector[sector] += value[k]
          } else {
            valuePerSector[sector] = value[k]
          }

          /* Not needed at the moment
          if (sector in sharesPerSector) {
            sharesPerSector[sector] += shares[i]
          } else {
            sharesPerSector[sector] = shares[i]
          }
          */
        }

        var sum = 0
        for (let sector in valuePerSector) {
          sum += valuePerSector[sector]
        }
        for (let sector in valuePerSector) {
          valuePerSector[sector] /= sum * 100
        }
      }

      res.statusCode = 200
      return res.json({
        valuePerSector: valuePerSector,
        error: "None",
        status: 200,
      })
    } catch (e) { // handle the potential error that may occur if the data can't be found
      res.statusCode = 404
      return res.json({
        investors: "None",
        error: "An exception was thrown",
        status: 404,
      })
    }
  }
}
