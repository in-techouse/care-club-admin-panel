$(document).ready(function () {
  console.log("Admin Dashboard is ready");
  loadNgos();
  loadUsers();
  loadRiders();
  loadProducts();
  loadDonations();
});

function loadNgos() {
  let pendingNgos = [];
  let approvedNgos = [];
  let rejectedNgos = [];

  firebase
    .database()
    .ref()
    .child("NGOS")
    .once("value")
    .then((data) => {
      $("#totalNgos").text(data.numChildren());
      data.forEach((ngo) => {
        if (ngo.val().approved === 0) {
          pendingNgos.push(ngo.val());
        } else if (ngo.val().approved === 1) {
          approvedNgos.push(ngo.val());
        } else if (ngo.val().approved === -1) {
          rejectedNgos.push(ngo.val());
        }
        $("#pendingApprovals").text(pendingNgos.length);
        $("#approvedNgos").text(approvedNgos.length);
        $("#rejectedNgos").text(rejectedNgos.length);
      });
    });
}

function loadUsers() {
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("role")
    .equalTo(0)
    .once("value")
    .then((data) => {
      $("#totalUsers").text(data.numChildren());
    });
}

function loadRiders() {
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("role")
    .equalTo(1)
    .once("value")
    .then((data) => {
      $("#totalRiders").text(data.numChildren());
    });
}

function loadProducts() {
  let claimedProducts = [];
  let unclaimedProducts = [];
  firebase
    .database()
    .ref()
    .child("Products")
    .once("value")
    .then((data) => {
      $("#totalProducts").text(data.numChildren());
      data.forEach((p) => {
        if (
          p.val().ngoid === undefined ||
          p.val().ngoid === null ||
          p.val().ngoid.length < 1
        ) {
          unclaimedProducts.push(p.val());
        } else {
          claimedProducts.push(p.val());
        }
        $("#unclaimedProducts").text(unclaimedProducts.length);
        $("#claimedProducts").text(claimedProducts.length);
      });
    });
}

function loadDonations() {
  firebase
    .database()
    .ref()
    .child("Donations")
    .once("value")
    .then((data) => {
      $("#totalDonations").text(data.numChildren());
    });
}
