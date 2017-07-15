const Promise = require('bluebird')
const dockerRegistry = require('docker-registry-client')

const createClient = Promise.promisify(dockerRegistry.createClient, { context: dockerRegistry })

function getLabels(imageName) {
  const parsed = dockerRegistry.parseRepoAndTag(imageName)
  return createClient({ name: parsed.localName }).then(client => {
    if (client.version === 1) {
      return getV1ImageJson(client, parsed.tag).then(extractV1Labels)
    }
    return getV2ImageManifest(client, parsed.tag).then(extractV2Labels)
  })
}

function getV1ImageJson(client, tag) {
  return Promise.promisify(client.getImgId, { context: client })({ tag }).then(imgId =>
    Promise.promisify(client.getImgJson, { context: client })({ imgId })
  )
}

function getV2ImageManifest(client, ref) {
  return Promise.promisify(client.getManifest, { context: client })({ ref })
}

function extractV1Labels(imageJson) {
  return ((imageJson.container_config || {}).Labels) || {}
}

function extractV2Labels(manifest) {
  const labelsFromCompatInfo = (manifest.history || [])
    .map(h => h.v1Compatibility)
    .filter(compat => compat)
    .map(compat => JSON.parse(compat))
    .map(extractV1Labels)
  return Object.assign(...labelsFromCompatInfo)
}

module.exports = {
  getLabels,
}
