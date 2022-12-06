const { ipcMain } = require("electron")

const channel = "search"

const callback = (e, query) => {
  var url = `https://www.reddit.com/search.json?q=${query.query}&source=recent&type=sr%2Cuser`
  if (query.safeSearch == false) {
    url += "&include_over_18=1"
  }
  logging('Search for "' + query.query + '" resolved Url = ' + url)
  request(url, { json: true }, (err, res, body) => {
    if (err) {
      return logging(`Can't Connect to Reddit.com`)
    }
    if (!err && res.statusCode == 200) {
      processSearchJSON(body, query)
    }
  })
}
export { channel, callback }
