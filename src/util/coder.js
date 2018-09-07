import CryptoJS from 'crypto-js';

class Coder {
  static encode(message, key) {
    return CryptoJS.AES.encrypt(message, key).toString();
  }
  static decode(message, key) {
    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
  }
}
export default Coder;
