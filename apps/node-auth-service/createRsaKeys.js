const crypto = require('crypto')
const fs = require('fs')

// Defining the key pair size (in bits)
const keyPairSize = 2048

const keyPairType = 'rsa'
const keyEncoding = {
  type: 'pkcs1',
  format: 'pem',
}

// Function to create a new RSA key pair
function generateRsaKeyPair() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync(keyPairType, {
    modulusLength: keyPairSize,
    publicKeyEncoding: keyEncoding,
    privateKeyEncoding: keyEncoding,
  })
  return { privateKey, publicKey }
}

// RSA key pair for access token
const { privateKey: accessPrivateKey, publicKey: accessPublicKey } = generateRsaKeyPair()
// RSA key pair for refresh token
const { privateKey: refreshPrivateKey, publicKey: refreshPublicKey } = generateRsaKeyPair()

// Output folder path
const outputFolder = './certs/'

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder)
}

fs.writeFileSync(outputFolder + 'access_private.pem', accessPrivateKey)
fs.writeFileSync(outputFolder + 'access_public.pem', accessPublicKey)
fs.writeFileSync(outputFolder + 'refresh_private.pem', refreshPrivateKey)
fs.writeFileSync(outputFolder + 'refresh_public.pem', refreshPublicKey)
