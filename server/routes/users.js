var express = require('express');
var router = express.Router();

var tokens = require('./model/tokens');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(tokens)
});
///hien thi tokens ra man hinh web

router.post('/', function(req, res, next) {
  if(req.body.token)
    var item ={
      token: req.body.token,
      user: req.body.user
    }
    console.log("so token= "+tokens.length);
    if(tokens.length==0){
      tokens.push(item);
    }
    else{
      var kt=0;
      for(var i=0;i<tokens.length;i++){
        console.log(tokens[i].token);
        if(tokens[i].token===req.body.token){
          kt=kt+1;
        }
      }
      console.log("k= "+kt);
      if(kt==0){
        tokens.push(item);
      }
    }
   // tokens.push(item);
    // for(var i=0;i<tokens.length;i++){
    //   if(tokens[i].user===item.user && tokens[i].token===item.token){
    //     tokens.push({
    //       token:'huhu',
    //       user:'12345'
    //     })
    //   }
    // }
  res.end();
});
//them token vao danh sach
//xoa token
router.get('/delete/:tokenuser/:tokenid',function(req,res,next){
  try{
    var tokenu=req.params.tokenuser;
    var tokeni=req.params.tokenid;
    for(var i=0;i<tokens.length;i++){
      if(tokens[i].user==tokenu&&tokens[i].token==tokeni){
        tokens.splice(i,1);
        res.send("ok");
      }
      else{
        res.send("failed");
      }
    }
  }
  catch(e){
    res.end();
  }
})
module.exports = router;
