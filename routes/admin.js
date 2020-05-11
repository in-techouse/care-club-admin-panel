var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function (req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/index", {
      action: "dashboard",
      admin: req.session,
    });
  } else {
    res.redirect("/");
  }
});

router.get("/allngos", function (req, res) {
  // if (req.session.isAdmin && req.session.isAdmin === true) {
  let ngos = [];
  firebase
    .database()
    .ref()
    .child("NGOS")
    .orderByKey()
    .once("value")
    .then((data) => {
      data.forEach((d) => {
        ngos.push(d.val());
      });
      res.render("pages/admin/allngos", {
        ngos: ngos,
        action: "allngos",
        admin: req.session,
      });
    })
    .catch((e) => {
      res.render("pages/admin/allngos", {
        ngos: ngos,
        action: "allngos",
        admin: req.session,
      });
    });
  // } else {
  //   res.redirect("/");
  // }
});

router.get("/alluser", function (req, res) {
  // if (req.session.isAdmin && req.session.isAdmin === true) {
  let users = [];
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("role")
    .equalTo(0)
    .once("value")
    .then((data) => {
      data.forEach((u) => {
        users.push(u.val());
      });
      res.render("pages/admin/alluser", {
        users: users,
        action: "alluser",
        admin: req.session,
      });
    })
    .catch((e) => {
      res.render("pages/admin/alluser", {
        users: users,
        action: "alluser",
        admin: req.session,
      });
    });
  // } else {
  //   res.redirect("/");
  // }
});

router.get("/ngoDetail", function (req, res) {
  // if (req.session.isAdmin && req.session.isAdmin === true) {
  // res.json(req.query.id);
  firebase
    .database()
    .ref()
    .child("NGOS")
    .child(req.query.id)
    .once("value")
    .then((data) => {
      res.render("pages/admin/ngoDetail", {
        ngo: data.val(),
        action: "ngoDetail",
        admin: req.session,
      });
    })
    .catch((e) => {
      res.redirect("/admin/allngos");
    });
  // } else {
  //   res.redirect("/");
  // }
});

router.get("/userDetail", function (req, res) {
  // if (req.session.isAdmin && req.session.isAdmin === true) {
  firebase
    .database()
    .ref()
    .child("Users")
    .child(req.query.id)
    .once("value")
    .then((data) => {
      let Products =[];
      firebase.database.ref().child("Products").orderByKey("userId").equalTo(req.query.id).once("value")
      .then((p)=>{
      p.forEach((n)=>{
      Products.push(n.val());  
      });
       res.render("pages/admin/userDetail", {
        user: data.val(),
        action: "userDetail",
        admin: req.session,
        Products:Products,
      });

      })
      .catch((l)=>{
        res.render("pages/admin/userDetail", {
          user: data.val(),
          action: "userDetail", 
          admin: req.session,
          Products:Products,
        });
        
      });
      
    })
    .catch((e) => {
      res.redirect("/admin/alluser");
    });
  // res.render("pages/admin/userDetail");
  // } else {
  //   res.redirect("/");
  // }
});

module.exports = router;
