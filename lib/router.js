const axios = require('axios')

module.exports = function (express) {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.render('index')
  })

  router.get('/home', async (req, res) => {
    if (!req.session.access_token) return res.redirect('/')

    const config = {
      headers: {
        Authorization: 'Bearer ' + req.session.access_token
      }
    }

    try {
      const response = await axios.get('https://discord.com/api/users/@me', config)
      return res.render('home', response.data)
    } catch (e) {
      console.log(e.response)
    }

    res.render('home', {
      username: req.session.username
    })
  })

  router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${process.env.redirectURL}callback`)
  })

  router.get('/callback', async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided')

    const params = new URLSearchParams()
    params.append('client_id', process.env.CLIENT_ID)
    params.append('client_secret', process.env.CLIENT_SECRET)
    params.append('grant_type', 'authorization_code')
    params.append('code', req.query.code)
    params.append('redirect_uri', process.env.redirectURL + 'callback')
    params.append('scope', 'identify')

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    try {
      const response = await axios.post('https://discord.com/api/oauth2/token', params, config)
      req.session.access_token = response.data.access_token
      res.redirect('/home')
    } catch (e) {
      console.log(e)
    }
  })

  return router
}
