import CryptoJS from "crypto-js";
import base64 from "./Base64";

export function runBefore (code, options) {
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    try
    {
        if(code)
        {
            eval(code);
        }
    }
    catch (err)
    {
        console.log("Before Error:"+err);
    }
}

export function runAfter  (code,options) {
    try
    {
        if(code)
        {
            eval(code);
        }
    }
    catch (err)
    {
        console.log("After Error:"+err);
    }
}