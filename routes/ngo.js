var express = require("express");
var firebase = require("firebase");
var router = express.Router();

// Action Dashboard
router.get("/", function (req, res) {
  // if (req.session.isNGO && req.session.isNGO === true) {
  res.render("pages/ngos/index", { ngo: req.session, action: "dashboard" });
  // } else {
  //   res.redirect("/");
  // }
});

// Action All Products
router.get("/allproducts", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    let products = [];
    firebase
      .database()
      .ref()
      .child("Products")
      .orderByChild("taken")
      .equalTo(false)
      .once("value")
      .then((data) => {
        data.forEach((d) => {
          products.push(d.val());
        });
        res.render("pages/ngos/allproducts", {
          ngo: req.session,
          products: products,
          action: "allproducts",
        });
      })
      .catch((e) => {
        res.render("pages/ngos/allproducts", {
          ngo: req.session,
          products: products,
          action: "allproducts",
        });
      });
  } else {
    res.redirect("/");
  }
});

// Action My Funds
router.get("/myfunds", function (req, res) {
  // if (req.session.isNGO && req.session.isNGO === true) {
  res.render("pages/ngos/myfunds", { ngo: req.session, action: "myfunds" }); // render page
  // } else {
  //   res.redirect("/");
  // }
});

// Action My Profile
router.get("/myprofile", function (req, res) {
  // if (req.session.isNGO && req.session.isNGO === true) {
  res.render("pages/ngos/myprofile", {
    ngo: req.session,
    action: "myprofile",
  }); // render page
  // } else {
  //   res.redirect("/");
  // }
});

// Action Product Detail
router.get("/productdetail", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    firebase
      .database()
      .ref()
      .child("Products")
      .child(req.query.id)
      .once("value")
      .then((d) => {
        firebase
          .database()
          .ref()
          .child("Users")
          .child(d.val().userId)
          .once("value")
          .then((u) => {
            res.render("pages/ngos/productdetail", {
              ngo: req.session,
              action: "productdetail",
              product: d.val(),
              user: u.val(),
            });
          })
          .catch((e) => {
            res.redirect("/ngo/allproducts");
          });
      })
      .catch((e) => {
        res.redirect("/ngo/allproducts");
      });
  } else {
    res.redirect("/");
  }
});

// Action Product Detail
router.get("/claimProduct", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    firebase
      .database()
      .ref()
      .child("Products")
      .child(req.query.id)
      .once("value")
      .then((d) => {
        let product = d.val();
        product.taken = true;
        product = { ...product, ngoid: req.session.ngoId };
        firebase
          .database()
          .ref()
          .child("Products")
          .child(product.id)
          .set(product)
          .then((d) => {
            res.redirect("/ngo/myProducts");
          });
      })
      .catch((e) => {
        res.redirect("/ngo/allproducts");
      });
  } else {
    res.redirect("/");
  }
});

// Action Add Payment Method
router.get("/adPayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/adPayment", {
      ngo: req.session,
      action: "adPayment",
    }); // render page
  } else {
    res.redirect("/");
  }
});

router.post("/adPayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    let payment = {
      id: "",
      name: "",
      providerName: "",
      accountNumber: "",
      accountHolderName: "",
      ngoId: req.session.ngoId,
    };
    let pId = firebase.database().ref().child("PaymentMethods").push().key;
    payment.id = pId;
    payment.name = req.body.Name;
    payment.providerName = req.body.ProviderName;
    payment.accountNumber = req.body.accountNumber;
    payment.accountHolderName = req.body.accountHolderName;

    firebase
      .database()
      .ref()
      .child("PaymentMethods")
      .child(payment.id)
      .set(payment)
      .then((d) => {
        res.redirect("/ngo/mypayment");
      })
      .catch((e) => {
        res.render("pages/ngos/adPayment", {
          ngo: req.session,
          action: "adPayment",
        });
      });
  } else {
    res.redirect("/");
  }
});

// Action My Payment
router.get("/mypayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    let payments = [];
    firebase
      .database()
      .ref()
      .child("PaymentMethods")
      .orderByChild("ngoId") // ngoid
      .equalTo(req.session.ngoId) // req.session.ngoId
      .once("value")
      .then((data) => {
        data.forEach((d) => {
          payments.push(d.val());
        });
        res.render("pages/ngos/mypayment", {
          ngo: req.session,
          payments: payments,
          action: "mypayment",
        });
      })
      .catch((e) => {
        res.render("pages/ngos/mypayment", {
          ngo: req.session,
          payments: payments,
          action: "mypayment",
        });
      });
  } else {
    res.redirect("/");
  }
});

// Action Add Rider
router.get("/addrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/addrider", {
      ngo: req.session,
      action: "addrider",
      error: "",
    }); // render page
  } else {
    res.redirect("/");
  }
});

router.post("/addrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    let rider = {
      id: "",
      fname: "",
      lname: "",
      email: "",
      phone: "",
      address: "",
      ngoId: req.session.ngoId,
      role: 1,
    };
    var rId = req.body.email.replace("@", "-");
    rId = rId.replace(/\./g, "_");
    rider.id = rId;
    rider.fname = req.body.firstName;
    rider.lname = req.body.lastName;
    rider.email = req.body.email;
    let password = req.body.password;
    rider.phone = req.body.mobileNo;
    firebase
      .auth()
      .createUserWithEmailAndPassword(rider.email, password)
      .then((r) => {
        firebase
          .database()
          .ref()
          .child("Users")
          .child(rider.id)
          .set(rider)
          .then((d) => {
            res.redirect("/ngo/myrider");
          });
      })
      .catch((e) => {
        res.render("pages/ngos/addrider", {
          ngo: req.session,
          action: "addrider",
          error: e.message,
        });
      });
  } else {
    res.redirect("/");
  }
});

// Action My Rider
router.get("/myrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    let riders = [];
    firebase
      .database()
      .ref()
      .child("Users")
      .orderByChild("ngoId") // ngoid
      .equalTo(req.session.ngoId) // req.session.ngoId
      .once("value")
      .then((data) => {
        data.forEach((d) => {
          riders.push(d.val());
        });
        res.render("pages/ngos/myrider", {
          ngo: req.session,
          riders: riders,
          action: "myrider",
        });
      })
      .catch((e) => {
        res.render("pages/ngos/myrider", {
          ngo: req.session,
          riders: rider,
          action: "myrider",
        });
      });
  } else {
    res.redirect("/");
  }
});

// Action My Products
router.get("/myProducts", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    let products = [];
    firebase
      .database()
      .ref()
      .child("Products")
      .orderByChild("ngoid") // ngoid
      .equalTo(req.session.ngoId) // req.session.ngoId
      .once("value")
      .then((data) => {
        data.forEach((d) => {
          products.push(d.val());
        });
        res.render("pages/ngos/myProducts", {
          ngo: req.session,
          products: products,
          action: "myProducts",
        });
      })
      .catch((e) => {
        res.render("pages/ngos/myProducts", {
          ngo: req.session,
          products: products,
          action: "myPproducts",
        });
      });
  } else {
    res.redirect("/");
  }
});

router.get("/paymentDetail", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/paymentDetail", {
      ngo: req.session,
      action: "paymentDetail",
    });
  } else {
    res.redirect("/");
  }
});

router.get("/riderDetail", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/riderDetail", {
      ngo: req.session,
      action: "riderDetail",
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
