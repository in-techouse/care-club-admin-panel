var express = require("express");
var firebase = require("firebase");
var router = express.Router();

// Action Dashboard
router.get("/", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }
    res.render("pages/ngos/index", { ngo: req.session, action: "dashboard" });
});

// Action All Products
router.get("/allproducts", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

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
});

// Action My Funds
router.get("/myDonations", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

    let donations = [];
    firebase
        .database()
        .ref()
        .child("Donations")
        .orderByChild("ngoId") // ngoid
        .equalTo(req.session.ngoId) // req.session.ngoId
        .once("value")
        .then((data) => {
            data.forEach((d) => {
                donations.push(d.val());
            });
            res.render("pages/ngos/myDonations", {
                ngo: req.session,
                donations: donations,
                action: "myDonations",
            });
        })
        .catch((e) => {
            res.render("pages/ngos/myDonations", {
                ngo: req.session,
                donations: donations,
                action: "myDonations",
            });
        });
});

// Action My Profile
router.get("/myprofile", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }
    res.render("pages/ngos/myprofile", {
        ngo: req.session,
        action: "myprofile",
    }); // render page
});

router.post("/update", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }
    let updatedNGO = req.body;
    firebase
        .database()
        .ref()
        .child("NGOS")
        .child(req.session.ngoId)
        .once("value")
        .then((d) => {
            let ngo = d.val();
            ngo.category = updatedNGO.ngoCategory;
            ngo.name = updatedNGO.name;
            ngo.phone = updatedNGO.phone;
            ngo.address = updatedNGO.address;
            ngo.website = updatedNGO.website;
            ngo.workingSince = updatedNGO.workingSince;
            ngo.levelOfAction = updatedNGO.levelOfAction;
            ngo.vision = updatedNGO.vision;
            ngo.image = updatedNGO.image;
            firebase
                .database()
                .ref()
                .child("NGOS")
                .child(req.session.ngoId)
                .set(ngo)
                .then((r) => {
                    req.session.address = ngo.address;
                    req.session.category = ngo.category;
                    req.session.email = ngo.email;
                    req.session.ngoId = ngo.id;
                    req.session.image = ngo.image;
                    req.session.levelOfAction = ngo.levelOfAction;
                    req.session.name = ngo.name;
                    req.session.phone = ngo.phone;
                    req.session.vision = ngo.vision;
                    req.session.website = ngo.website;
                    req.session.workingSince = ngo.workingSince;
                    req.session.isNGO = true;
                    res.redirect("/ngo/myprofile");
                });
        })
        .catch((e) => {
            res.redirect("/ngo/myprofile");
        });
});

// Action Product Detail
router.get("/productdetail", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

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
});

// Action Product Detail
router.get("/claimProduct", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

    firebase
        .database()
        .ref()
        .child("Products")
        .child(req.query.id)
        .once("value")
        .then((d) => {
            let product = d.val();
            product.taken = true;
            product = {...product, ngoid: req.session.ngoId };
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
});

// Assign Product
router.post("/assignProduct", function(req, res) {
    firebase
        .database()
        .ref()
        .child("Products")
        .child(req.body.productId)
        .child("riderId")
        .set(req.body.riderId)
        .then((r) => {
            res.redirect("/ngo/myProducts");
        })
        .catch((e) => {
            res.redirect("/ngo/myProducts");
        });
});

// Action Add Payment Method
router.get("/adPayment", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }
    res.render("pages/ngos/adPayment", {
        ngo: req.session,
        action: "adPayment",
    }); // render page
});

router.post("/adPayment", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

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
});

// Action My Payment
router.get("/mypayment", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

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
});

// Action Add Rider
router.get("/addrider", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }
    res.render("pages/ngos/addrider", {
        ngo: req.session,
        action: "addrider",
        error: "",
    }); // render page
});

router.post("/addrider", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

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
});

// Action My Rider
router.get("/myrider", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

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
});

// Action My Products
router.get("/myProducts", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

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
});

router.get("/paymentEdit", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

    firebase
        .database()
        .ref()
        .child("PaymentMethods")
        .child(req.query.id)
        .once("value")
        .then((data) => {
            res.render("pages/ngos/paymentEdit", {
                ngo: req.session,
                payment: data.val(),
                action: "paymentEdit",
            });
        })
        .catch((e) => {
            res.redirect("/ngo/mypayment");
        });
});

router.post("/paymentEdit", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

    firebase
        .database()
        .ref()
        .child("PaymentMethods")
        .child(req.body.id)
        .once("value")
        .then((data) => {
            let payment = data.val();
            payment.name = req.body.Name;
            payment.providerName = req.body.ProviderName;
            payment.accountNumber = req.body.accountNumber;
            payment.accountHolderName = req.body.accountHolderName;
            firebase
                .database()
                .ref()
                .child("PaymentMethods")
                .child(req.body.id)
                .set(payment)
                .then((d) => {
                    res.redirect("/ngo/mypayment");
                });
        })
        .catch((e) => {
            res.redirect("/ngo/mypayment");
        });
});

router.get("/riderDetail", function(req, res) {
    if (!req.session.isNGO) {
        res.redirect("/");
    }

    firebase
        .database()
        .ref()
        .child("Users")
        .child(req.query.id)
        .once("value")
        .then((data) => {
            res.render("pages/ngos/riderDetail", {
                ngo: req.session,
                rider: data.val(),
                action: "riderDetail",
            });
        })
        .catch((e) => {
            res.redirect("/ngo/myrider");
        });
});

module.exports = router;