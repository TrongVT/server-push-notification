var Expo = require( 'expo-server-sdk');
var express = require('express');
var router = express.Router();
var tokens = require('./model/tokens');//goi danh sach 
router.get('/:tokenUserID', function (req, res, next) {

  // Create a new Expo SDK client
  let expo = new Expo();

  // Create the messages that you want to send to clents
  let messages = [];
  var userTokenSend = req.params.tokenUserID;
  var token2Send=null;
  // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)

   for(let item of tokens){
     if(item.user==userTokenSend){
      token2Send=item.token;
     }
     continue;
   }
    messages.push({
      to:token2Send,
      sound: 'default',
      title:'Thông tin ký duyệt',
      body: 'Notification of Sign',
      data: { withSome: 'data' },
    })
  // for (let item of tokens) {
  //   // if(item.user !== "nst23223"){
  //   //     continue;
  //   // }
  //   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

  //   // Check that all your push tokens appear to be valid Expo push tokens
  //   if (!Expo.isExpoPushToken(item.token)) {
  //     console.error(`Push token ${item.token} is not a valid Expo push token`);
  //     continue;
  //   }
  //  // var userToken = request.params.tokenSend;
  //   // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
  //   messages.push({
  //     to: item.token,
  //     sound: 'default',
  //     body: 'This is a test notification'+item.token,
  //     data: { withSome: 'data' },
  //   })
  // }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);

  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
  res.end()
});
//push to only user
router.get('/special/:user&:title&:content',function(req,res,next){
  let expo=new Expo();
  let messages=[];
  let user=req.params.user;
  let title=req.params.title;
  let content=req.params.content;
  var token2Send=[];
  for (let item of tokens) {
    if (!Expo.isExpoPushToken(item.token)) {
    console.error(`Push token ${item.token} is not a valid Expo push token`);
    continue;
    }
    if(item.user==user){
      messages.push({
        to: item.token,
        sound: 'default',
        title:title,
        body: content,
        data: { withSome: content },
      })
    }
    }
  let chunks = expo.chunkPushNotifications(messages);
    (async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();
    res.end();
});
router.get('/list/send2all/:title&:content',function(req,res,next){
  let expo = new Expo();
  
  // Create the messages that you want to send to clents
  let messages = [];
  var title=req.params.title;
  var content=req.params.content;
for (let item of tokens) {
      if (!Expo.isExpoPushToken(item.token)) {
      console.error(`Push token ${item.token} is not a valid Expo push token`);
      continue;
  }
  messages.push({
          to: item.token,
          sound: 'default',
          title:title,
          body: content,
          data: { withSome: 'data' },
        })
  }
  let chunks = expo.chunkPushNotifications(messages);
  
    (async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log(receipts);
        } catch (error) {
          console.error(error);
        }
      }
    })();
    res.end()
});
module.exports = router;
