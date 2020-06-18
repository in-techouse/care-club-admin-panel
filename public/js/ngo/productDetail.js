$(document).ready(function () {
  console.log("Product Detail page is ready");
  const riderId = $("#riderId").val();
  console.log("Rider Id: ", riderId);

  firebase
    .database()
    .ref()
    .child("Users")
    .child(riderId)
    .once("value")
    .then((rider) => {
      console.log("Rider: ", rider.val());
      $("#riderName").text(rider.val().fname + " " + rider.val().lname);
      $("#riderEmail").text(rider.val().email);
      $("#riderContact").text(rider.val().phone);
    })
    .catch((e) => {});
});
