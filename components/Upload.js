var CryptoJS = require('crypto-js');

export default uploadImage = (uri, callback) => {
  let timestamp = ((Date.now() / 1000) | 0).toString();
  let api_key = '178574322734136';
  let api_secret = 'vpGN1t0TTUEXRNtxdDcXuRM39w8';
  let cloud = 'dg9dvran5';
  let hash_string = 'timestamp=' + timestamp + api_secret;
  let signature = CryptoJS.SHA1(hash_string).toString();
  let upload_url = 'https://api.cloudinary.com/v1_1/' + cloud + '/image/upload';

  let xhr = new XMLHttpRequest();
  xhr.open('POST', upload_url);
  xhr.onload = () => {
    console.log(xhr.responseHeaders.Status);
    console.log(JSON.parse(xhr._response).url);
    callback(JSON.parse(xhr._response).url);
  };
  let formdata = new FormData();
  formdata.append('file', {uri: uri, type: 'image/png', name: 'upload.png'});
  formdata.append('timestamp', timestamp);
  formdata.append('api_key', api_key);
  formdata.append('signature', signature);
  xhr.send(formdata);
};
