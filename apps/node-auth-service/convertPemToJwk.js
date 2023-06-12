const fs = require('fs')
const rsaPemToJwk = require('rsa-pem-to-jwk')

const privatePemKey = fs.readFileSync('./certs/access_private.pem')

// Converting private pem key to jwk and only get public part of the jwk
const publicJwk = rsaPemToJwk(privatePemKey, { use: 'sig' }, 'public')

// Output folder path
const outputFolder = './public/'

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder)
}

// Json-web-keys-set
const jwks = {
  keys: [publicJwk],
}

fs.writeFileSync(outputFolder + 'jwks.json', JSON.stringify(jwks))
