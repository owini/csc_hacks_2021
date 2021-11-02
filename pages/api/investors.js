const cheerio = require('cheerio') // import cheerio module using commonJS
const cors = require('cors') // import cors to allow fetching the api from a different browser

// initializing the cors middleware
const cors_ob = cors({
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
  await runMiddleware(req, res, cors_ob)
  if (req.method === 'POST') { // if the request is a post
    // const username = req.body.TWuser

    try { // try to scrape the list of superinvestors and the URLs for their portfolios
      const response = await fetch("https://www.dataroma.com/m/home.php")
      const htmlString = await response.text()
      const $ = cheerio.load(htmlString)

      // grab investor names
      var searchContext = "span[id='port_body']"
      // grab the giant string consisting of the entire list of superinvestors
      const investorList = $(searchContext)
        .text()
      // split the string by the year, which we can discard as all dates are 2021;
      // not the best solution but much simpler than a perfect one
      tempList = investorList.split(" 2021 ")
      console.log(tempList)
      //investors, updated = []
      /*
      // for each entry in the list split into the name and update date
      for (int i = 0; i < tempList.length; i++) {
        helperList = tempList[i].split(" Updated ")
        investors[i] = helperList[0]
        date = helperList[1].split(" ")
        updated[i] = `2021-${months[date[1]]}-${date[0]}`
      }
      */

      // grab investor portfolio URLs
      //searchContext = "a"
      //var links = $(searchContext).text()

      res.statusCode = 200
      return res.json({
        investors: investorList,
        // dateUpdated: updated,
        //links: links,
      })
    } catch (e) { // handle the potential error that may occur if the data can't be found
      res.statusCode = 404
      return res.json({
        investors: "None",
        investorError: "Investors not found. Tip: Double check the spelling.",
      })
    }
  }
}
