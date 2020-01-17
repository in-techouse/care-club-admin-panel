var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get("/",function(req,res){
    res.render("pages/admin/index");
});
router.get("/allngos",function(req,res){
    res.render("pages/admin/allngos");
});
router.get("/alluser",function(req,res){
    res.render("pages/admin/alluser");
});
router.get("/ngosdetail",function(req,res){
    res.render("pages/admin/ngosdetail");
});
router.get("/userdetail",function(req,res){
    res.render("pages/admin/userdetail");
});



module.exports = router;