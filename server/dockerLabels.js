const dockerRegistry = require('docker-registry-client')

function getLabels(imageName) {
  const parsed = dockerRegistry.parseRepoAndTag(imageName)
  return new Promise((resolve, reject) => {
    dockerRegistry.createClient({ name: parsed.localName }, (err, client) => {
      if (err) {
        reject(err)
      } else if (client.version === 1) {
        client.getImgId({ tag: parsed.tag }, (getImgError, imgId) => {
          client.getImgJson({ imgId }, (getImgJsonError, imgJson) => {
            resolve(imgJson)
          })
        })
      } else {
        client.getManifest({ ref: parsed.tag }, (getManifestErr, manifest) => {
          resolve(manifest)
        })
      }
    })
  })
}

module.exports = {
  getLabels,
}
