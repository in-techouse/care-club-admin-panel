$(document).ready(function () {
  console.log("Assign product page is ready");
  const ngoId = $("#ngoId").val();
  console.log("NGO Id: ", ngoId);

  const isTaken = $("#isTaken").val();
  console.log("Is Taken: ", isTaken);

  const productNgoId = $("#productNgoId").val();
  console.log("Product Ngo Id: ", productNgoId);

  const productId = $("#productId").val();
  console.log("Product Id: ", productId);
  if (
    isTaken !== null &&
    isTaken !== undefined &&
    (isTaken === "true" || isTaken === true)
  ) {
    console.log("Product can be assigned");
    loadRiders(ngoId);
  } else {
    console.log("Product can't be assigned");
  }
});

function loadRiders(ngoId) {
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("ngoId")
    .equalTo(ngoId)
    .once("value")
    .then((data) => {
      data.forEach((rider) => {
        console.log("Rider: ", rider.val());
        $("#riderId").append(
          `<option value="${rider.val().id}">${rider.val().fname} ${
            rider.val().lname
          }</option>`
        );
      });
    });
}
