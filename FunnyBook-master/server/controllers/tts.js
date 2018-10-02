const crypto = require('crypto');
const stream = require('stream');
const querystring = require('querystring');
const axios = require('axios');
const cos = new require('cos-nodejs-sdk-v5');

// 腾讯云
const qAppId = '1257184029';
const qSecretId = 'AKID21oSuAD5jBQTL1JnupZ7XmpgLo5ABlHb';
const qSecretKey = 'GLEwSoywiJiuujNp591hCWdcQ2ShkcJr';
// 腾讯云COS
const cosRegion = "ap-guangzhou";
const cosBucket = "ttstemp"; // bucket名不能有"-"（属于SDK的bug）
// 讯飞语音合成API
const xfUrl = "http://api.xfyun.cn/v1/service/v1/tts"
const xfAppid = "5b6d5107"; // 目前是免费版账号
const xfApiKey = "4b37b62a43fbff0e72543206cefdfbb7";
// 讯飞语音合成API的参数
const xfParams = Buffer.from(JSON.stringify({
  "auf": "audio/L16;rate=16000",
  "aue": "lame", // raw: xxx.wav; lame: xxx.mp3
  "voice_name": "xiaoyan",
  "speed": "50",
  "volume": "50",
  "pitch": "50",
  "engine_type": "intp65",
  "text_type": "text"
})).toString("base64");

// cos client
var cosClient = new cos({
  AppId: qAppId,
  SecretId: qSecretId,
  SecretKey: qSecretKey,
});

// 上传到音频到COS
function uploadAudio(filename, fileData) {
  return new Promise(function (resolve, reject) {
    var thisResolve = resolve, thisReject = reject;
    // 从Buffer生成可读流
    let bufferStream = new stream.PassThrough();
    bufferStream.end(fileData);
    // 上传
    cosClient.putObject({
      Bucket: cosBucket,
      Region: cosRegion,
      Key: filename,
      Body: bufferStream,
      ContentLength: fileData.length.toString(),
    }, function (err, data) {
      if (!err) {
        thisResolve(`https://${cosBucket}-${qAppId}.cos.${cosRegion}.myqcloud.com/${filename}`);
      }
      else {
        thisReject(err);
      }
    });
  })
}

// 接收text -> 调用TTS API -> 上传音频到COS
module.exports = async function (ctx) {
  var curTime = Date.parse(new Date()).toString().slice(0, -3);
  var checkSum = crypto.createHash('md5').update(xfApiKey + curTime + xfParams).digest('hex');
  var requestData = querystring.stringify({ text: ctx.request.body.text });
  var requestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      "X-Param": xfParams,
      "X-Appid": xfAppid,
      "X-CurTime": curTime,
      "X-CheckSum": checkSum,
    },
    responseType: "arraybuffer", // 非常重要！浪费了我一整天时间！
    responseEncoding: 'binary'
  }
  await axios.post(xfUrl, requestData, requestConfig)
    .then(async function (response) { // response.data是Buffer类型
      if (response.headers["content-type"] == "audio/mpeg") {
        await uploadAudio("audio-" + response.headers["sid"].replace('@','-') + ".mp3", response.data)
          .then(function (loc) {
            ctx.state.data = {
              code: 0,
              msg: loc,
            }
          }, function (err) {
            ctx.state.data = {
              code: -2,
              msg: "upload failed with message:" + err,
            }
          })
      }
      else {
        ctx.state.data = {
          code: -1,
          msg: "call XF API failed with message:" + response.data.toString(),
        }
      }
    })
}