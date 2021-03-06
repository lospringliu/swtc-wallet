"use strict"

var keypairs = require("swtc-keypairs")
var ec = keypairs.ec

var Wallet = function(secret) {
  try {
    this._keypairs = keypairs.deriveKeyPair(secret)
    this._secret = secret
  } catch (err) {
    this._keypairs = null
    this._secret = null
  }
}

/**
 * static funcion
 * generate one wallet
 * @returns {{secret: string, address: string}}
 */
Wallet.generate = function() {
  var secret = keypairs.generateSeed()
  var keypair = keypairs.deriveKeyPair(secret)
  var address = keypairs.deriveAddress(keypair.publicKey)
  return { secret: secret, address: address }
}

/**
 * static function
 * generate one wallet from secret
 * @param secret
 * @returns {*}
 */
Wallet.fromSecret = function(secret) {
  try {
    var keypair = keypairs.deriveKeyPair(secret)
    var address = keypairs.deriveAddress(keypair.publicKey)
    return { secret: secret, address: address }
  } catch (err) {
    return null
  }
}

/**
 * static function
 * check if address is valid
 * @param address
 * @returns {boolean}
 */
Wallet.isValidAddress = keypairs.checkAddress

/**
 * static function
 * check if secret is valid
 * @param secret
 * @returns {boolean}
 */
Wallet.isValidSecret = function(secret) {
  try {
    keypairs.deriveKeyPair(secret)
    return true
  } catch (err) {
    return false
  }
}

/**
 * sign message with wallet privatekey
 * @param message
 * @returns {*}
 */
Wallet.prototype.sign = function(message) {
  if (!message || message.length === 0) return null
  if (!this._keypairs) return null
  var privateKey = this._keypairs.privateKey

  // Export DER encoded signature in Array
  return ec.sign(message, privateKey)
}

/**
 * verify signature with wallet publickey
 * @param message
 * @param signature
 * @returns {*}
 */
Wallet.prototype.verify = function(message, signature) {
  if (!this._keypairs) return null
  var publicKey = this._keypairs.publicKey
  return ec.verify(message, signature, publicKey)
}

/**
 * get wallet address
 * @returns {*}
 */
Wallet.prototype.address = function() {
  if (!this._keypairs) return null
  var address = keypairs.deriveAddress(this._keypairs.publicKey)
  return address
}

/**
 * get wallet secret
 * @returns {*}
 */
Wallet.prototype.secret = function() {
  if (!this._keypairs) return null
  return this._secret
}

Wallet.prototype.toJson = function() {
  if (!this._keypairs) return null
  return {
    secret: secret(),
    address: address()
  }
}

/*
 * Get the public key from key pair
 * used for local signing operation.
 */
Wallet.prototype.getPublicKey = function() {
  if (!this._keypairs) return null
  return this._keypairs.publicKey
}

/**
 * sign message with wallet privatekey
 * Export DER encoded signature in Array
 * Used for
 * @param message
 * @returns {*}
 */
Wallet.prototype.signTx = function(message) {
  if (!message || message.length === 0) return null
  if (!this._keypairs) return null
  var privateKey = this._keypairs.privateKey

  // Export DER encoded signature in Array
  return ec.signTx(message, privateKey)
}

/**
 * verify signature with wallet publickey
 * @param message
 * @param signature
 * @returns {*}
 */
Wallet.prototype.verifyTx = function(message, signature) {
  if (!this._keypairs) return null
  var publicKey = this._keypairs.publicKey
  return ec.verifyTx(message, signature, publicKey)
}
module.exports = Wallet
