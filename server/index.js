const express = require('express')
const proxy = require('http-proxy-middleware')
const dockerMetadata = require('./dockerMetadata')
const bodyParser = require('body-parser')

const app = express()
const root = __dirname

app.set('port', (process.env.APP_PORT || 3001))
app.set('marathon_url', (process.env.MARATHON_URL || 'http://marathon.whale.int.avast.com/'))

app.use(express.static(root))
app.use(bodyParser.json({
  type: '*/*',
}))

app.use('/api/marathon/**', proxy({
  target: app.get('marathon_url'),
  pathRewrite: { '^/api/marathon': '' },
  logLevel: 'warn',
  changeOrigin: true,
}))

let imageMetadataCache = {}
function getDockerMetadata(imageName) {
  const cachedMetadata = imageMetadataCache[imageName]
  if (typeof cachedMetadata === 'undefined') {
    return dockerMetadata.getMetadata(imageName).catch(e => {
      console.log(`Error while retrieving metadata for image "${imageName}": ${e.message}`)
      return null
    }).then(m => {
      imageMetadataCache[imageName] = m
      return m
    })
  }
  return Promise.resolve(cachedMetadata)
}

app.get('/api/docker-registry/metadata/:imageName(*)', (req, res) => {
  getDockerMetadata(req.params.imageName)
    .then(metadata => res.send(metadata))
    .catch(e => { res.status(500).send(e.message) })
})

app.get('/api/docker-registry/metadata-cache', (req, res) => {
  res.send(imageMetadataCache)
})

app.delete('/api/docker-registry/metadata-cache', (req, res) => {
  imageMetadataCache = {}
  res.send(null)
})

app.post('/api/docker-registry/metadata', (req, res) => {
  if (Array.isArray(req.body)) {
    const imageNames = req.body.filter(v => typeof v === 'string')
    if (imageNames.length === 0) {
      res.send({})
    } else {
      Promise.all(imageNames.map(imageName => getDockerMetadata(imageName)
        .then(m => ({ [imageName]: m }))
      ))
      .then(results => res.send(Object.assign(...results)))
    }
  } else {
    console.log(req.body)
    res.status(400).send({ message: 'Expecting body with a JSON array containing image names' })
  }
})

app.listen(app.get('port'), () => {
  console.log(`Server is running at localhost:${app.get('port')}`)
})
