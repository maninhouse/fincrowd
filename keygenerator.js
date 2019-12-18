const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log('Public Key: ', publicKey);
console.log('\nPrivate Key: ', privateKey);
/*
Public Key:  0415d6bf155d9e13bf547fef8eb0e933012972d3af900da48d2373251dd87f34ec989ad98fc926842eed13218ca19c0fcffcbbffc2b8479fd5db87e5be9c663cef

Private Key:  52a0296cf4bdf8d7fda9f8c4a81bd5914389f72f475c28bb0f50c3a28bcfb88e
*/