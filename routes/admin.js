var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/index", {
    action: "dashboard",
    admin: req.session,
  });
});

router.get("/allngos", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

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
});

router.get("/approvedNgos", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

  let ngos = [];
  firebase
    .database()
    .ref()
    .child("NGOS")
    .orderByChild("approved")
    .equalTo(1)
    .once("value")
    .then((data) => {
      data.forEach((d) => {
        ngos.push(d.val());
      });
      res.render("pages/admin/approvedNgos", {
        ngos: ngos,
        action: "approvedNgos",
        admin: req.session,
      });
    })
    .catch((e) => {
      res.render("pages/admin/approvedNgos", {
        ngos: ngos,
        action: "approvedNgos",
        admin: req.session,
      });
    });
});

router.get("/blockedNgos", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

  let ngos = [];
  firebase
    .database()
    .ref()
    .child("NGOS")
    .orderByChild("approved")
    .equalTo(-1)
    .once("value")
    .then((data) => {
      data.forEach((d) => {
        ngos.push(d.val());
      });
      res.render("pages/admin/blockedNgos", {
        ngos: ngos,
        action: "blockedNgos",
        admin: req.session,
      });
    })
    .catch((e) => {
      res.render("pages/admin/blockedNgos", {
        ngos: ngos,
        action: "blockedNgos",
        admin: req.session,
      });
    });
});

router.get("/pendingNgos", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

  let ngos = [];
  firebase
    .database()
    .ref()
    .child("NGOS")
    .orderByChild("approved")
    .equalTo(0)
    .once("value")
    .then((data) => {
      data.forEach((d) => {
        ngos.push(d.val());
      });
      res.render("pages/admin/pendingNgos", {
        ngos: ngos,
        action: "pendingNgos",
        admin: req.session,
      });
    })
    .catch((e) => {
      res.render("pages/admin/pendingNgos", {
        ngos: ngos,
        action: "pendingNgos",
        admin: req.session,
      });
    });
});

router.get("/alluser", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

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
});

router.get("/ngoDetail", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
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
});

router.get("/approveNgo", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

  firebase
    .database()
    .ref()
    .child("NGOS")
    .child(req.query.id)
    .child("approved")
    .set(1)
    .then((r) => {
      res.redirect("/admin/ngoDetail?id=" + req.query.id);
    })
    .catch((e) => {
      res.redirect("/admin/allngos");
    });
});

router.get("/blockNgo", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

  firebase
    .database()
    .ref()
    .child("NGOS")
    .child(req.query.id)
    .child("approved")
    .set(-1)
    .then((r) => {
      res.redirect("/admin/ngoDetail?id=" + req.query.id);
    })
    .catch((e) => {
      res.redirect("/admin/allngos");
    });
});

router.get("/userDetail", function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }

  firebase
    .database()
    .ref()
    .child("Users")
    .child(req.query.id)
    .once("value")
    .then((data) => {
      let products = [];
      firebase
        .database()
        .ref()
        .child("Products")
        .orderByChild("userId")
        .equalTo(req.query.id)
        .once("value")
        .then((p) => {
          p.forEach((n) => {
            products.push(n.val());
          });
          res.render("pages/admin/userDetail", {
            user: data.val(),
            action: "userDetail",
            admin: req.session,
            products: products,
          });
        });
    })
    .catch((e) => {
      res.redirect("/admin/alluser");
    });
});

module.exports = router;
