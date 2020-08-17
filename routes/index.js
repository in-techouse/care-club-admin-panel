var express = require("express");
var router = express.Router();

var firebase = require("firebase");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};
firebase.initializeApp(firebaseConfig);

/* GET home page. */
router.get("/", function(req, res) {
    res.render("pages/index", { action: "index" });
});

router.get("/contact", function(req, res) {
    res.render("pages/contact", { action: "contact" });
});

router.get("/login", function(req, res) {
    res.render("pages/login", { error: "", action: "login" });
});

router.post("/login", function(req, res) {
    firebase
        .auth()
        .signInWithEmailAndPassword(req.body.userEmail, req.body.userPassword)
        .then((are) => {
            var id = req.body.userEmail.replace("@", "-");
            id = id.replace(/\./g, "_");
            firebase
                .database()
                .ref()
                .child("NGOS")
                .child(id)
                .once("value")
                .then((data) => {
                    if (
                        data === null ||
                        data === undefined ||
                        data.val() === null ||
                        data.val() === undefined
                    ) {
                        firebase
                            .database()
                            .ref()
                            .child("Admins")
                            .child(id)
                            .once("value")
                            .then((admin) => {
                                if (
                                    admin === null ||
                                    admin === undefined ||
                                    admin.val() === null ||
                                    admin.val() === undefined
                                ) {
                                    res.render("pages/login", {
                                        error: "You are not authorized to login here",
                                        action: "login",
                                    });
                                } else {
                                    req.session.adminId = admin.val().id;
                                    req.session.email = admin.val().email;
                                    req.session.name = admin.val().name;
                                    req.session.isAdmin = true;
                                    res.redirect("/admin");
                                }
                            });
                    } else {
                        req.session.address = data.val().address;
                        req.session.category = data.val().category;
                        req.session.email = data.val().email;
                        req.session.ngoId = data.val().id;
                        req.session.image = data.val().image;
                        req.session.levelOfAction = data.val().levelOfAction;
                        req.session.name = data.val().name;
                        req.session.phone = data.val().phone;
                        req.session.vision = data.val().vision;
                        req.session.website = data.val().website;
                        req.session.workingSince = data.val().workingSince;
                        req.session.isNGO = true;
                        res.redirect("/ngo");
                        // if (data.val().approved === 0) {
                        //     res.render("pages/login", {
                        //         error: "Your account is not approved yet. You can use your account after admin approval.",
                        //     });
                        // } else if (data.val().approved === -1) {
                        //     res.render("pages/login", {
                        //         error: "Your account has been restricted by the admin. You can't use your account anymore.",
                        //     });
                        // } else {
                        //     req.session.address = data.val().address;
                        //     req.session.category = data.val().category;
                        //     req.session.email = data.val().email;
                        //     req.session.ngoId = data.val().id;
                        //     req.session.image = data.val().image;
                        //     req.session.levelOfAction = data.val().levelOfAction;
                        //     req.session.name = data.val().name;
                        //     req.session.phone = data.val().phone;
                        //     req.session.vision = data.val().vision;
                        //     req.session.website = data.val().website;
                        //     req.session.workingSince = data.val().workingSince;
                        //     req.session.isNGO = true;
                        //     res.redirect("/ngo");
                        // }
                    }
                })
                .catch((err) => {
                    res.render("pages/login", {
                        error: "You are not authorized to login here",
                        action: "login",
                    });
                });
        })
        .catch((e) => {
            res.render("pages/login", { error: e.message, action: "login" });
        });
});

router.get("/registeration", function(req, res) {
    res.render("pages/registration", { error: "", action: "registration" });
});

router.post("/registeration", function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let passwordConfirmation = req.body.passwordConfirmation;
    var id = req.body.email.replace("@", "-");
    id = id.replace(/\./g, "_");
    let ngo = {
        category: req.body.ngoCategory,
        name: req.body.ngoName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        id: id,
        images: [],
        paymentMethods: [],
        approved: false,
    };
    if (password === passwordConfirmation) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((n) => {
                firebase
                    .database()
                    .ref()
                    .child("NGOS")
                    .child(ngo.id)
                    .set(ngo)
                    .then((r) => {
                        req.session.category = ngo.category;
                        req.session.name = ngo.name;
                        req.session.email = ngo.email;
                        req.session.phone = ngo.phone;
                        req.session.address = ngo.address;
                        req.session.id = ngo.id;
                        req.session.isNGO = true;
                        res.redirect("/ngo");
                    });
            })
            .catch((e) => {
                res.render("pages/registration", {
                    error: e.message,
                    action: "registration",
                });
            });
    } else {
        res.render("pages/registration", {
            error: "Password doesn't match",
            action: "registration",
        });
    }
});

router.get("/forgetPassword", function(req, res) {
    res.render("pages/forgetPassword", {
        error: "",
        success: "",
        action: "forgotPassword",
    });
});

router.post("/forgetPassword", function(req, res) {
    let email = req.body.userEmail;
    firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then((r) => {
            res.render("pages/forgetPassword", {
                error: "",
                success: "A password recovery email has been sent to your email address. Check the email and follow the instructions to reset your password.",
                action: "forgotPassword",
            });
        })
        .catch((e) => {
            res.render("pages/forgetPassword", {
                error: e.message,
                success: "",
                action: "forgotPassword",
            });
        });
});

router.get("/logout", function(req, res) {
    firebase.auth().signOut();
    req.session.destroy(function(err) {
        if (err) {
            res.negotiate(err);
        }
        res.redirect("/");
    });
});

module.exports = router;