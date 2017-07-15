const express = require('express')
const proxy = require('http-proxy-middleware')
const dockerLabels = require('./dockerLabels')

const app = express()
const root = __dirname

app.set('port', (process.env.APP_PORT || 3001))
app.set('marathon_url', (process.env.MARATHON_URL || 'http://marathon.whale.int.avast.com/'))

app.use(express.static(root))

app.use('/api/marathon/**', proxy({
  target: app.get('marathon_url'),
  pathRewrite: { '^/api/marathon': '' },
  logLevel: 'warn',
  changeOrigin: true,
}))

app.get('/api/docker-registry/labels/:imageName(*)', (req, res) => {
  dockerLabels.getLabels(req.params.imageName)
    .then(json => {
      if (json) {
        res.json(json)
      } else {
        res.status(404).send({ message: `Image ${req.params.imageName} not found` })
      }
    })
    .catch(e => { res.status(500).send(e.message) })
})

app.listen(app.get('port'), () => {
  console.log(`Server is running at localhost:${app.get('port')}`)
})
