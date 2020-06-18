$(document).ready(function () {
  const ngoId = $("#ngoId").val();
  loadProducts(ngoId);
  loadRiders(ngoId);
  loadDonations(ngoId);
});

function loadProducts(ngoId) {
  let claimedProducts = [];
  let openProducts = [];
  firebase
    .database()
    .ref()
    .child("Products")
    .once("value")
    .then((data) => {
      $("#totalProducts").text(data.numChildren());
      data.forEach((p) => {
        if (
          p.val().ngoid !== null &&
          p.val().ngoid !== undefined &&
          p.val().ngoid === ngoId
        ) {
          claimedProducts.push(p.val());
        } else if (
          p.val().ngoid === undefined ||
          p.val().ngoid === null ||
          p.val().ngoid.length < 1
        ) {
          openProducts.push(p.val());
        }
      });
      $("#claimedProducts").text(claimedProducts.length);
      $("#openProducts").text(openProducts.length);
    });
}

function loadRiders(ngoId) {
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("ngoId")
    .equalTo(ngoId)
    .once("value")
    .then((data) => {
      $("#totalRiders").text(data.numChildren());
    });
}

function loadDonations(ngoId) {
  firebase
    .database()
    .ref()
    .child("Donations")
    .orderByChild("ngoId")
    .equalTo(ngoId)
    .once("value")
    .then((data) => {
      $("#totalDonations").text(data.numChildren());
    });
}
