$(document).ready(function () {
  const userId = $("#userId").val();
  const userRole = $("#userRole").val();
  if (userRole === "0") {
    loadUserProducts(userId);
    loadUserDonations(userId);
  } else if (userRole === "1") {
    loadRiderProducts(userId);
  }
});

function loadUserProducts(userId) {
  firebase
    .database()
    .ref()
    .child("Products")
    .orderByChild("userId")
    .equalTo(userId)
    .once("value")
    .then((products) => {
      products.forEach((product) => {
        $("#userProducts tr:last").after(`
            <tr>
                <td>${product.val().name}</td>
                <td>${product.val().category}</td>
                <td>${product.val().quantityOfProducts}</td>
                <td>${product.val().phoneno}</td>
                <td><a href="/admin/productDetail?id=${
                  product.val().id
                }" class="btn btn-sm btn-primary">DETAILS</a></td>
            </tr>
        `);
      });
    });
}

function loadUserDonations(userId) {
  firebase
    .database()
    .ref()
    .child("Donations")
    .orderByChild("userId")
    .equalTo(userId)
    .once("value")
    .then((donations) => {
      donations.forEach((donation) => {
        firebase
          .database()
          .ref()
          .child("NGOS")
          .child(donation.val().ngoId)
          .once("value")
          .then((ngo) => {
            $("#userDonations tr:last").after(`
            <tr>
                <td>${ngo.val().name}</td>
                <td>${donation.val().amount} Rs</td>
                <td>${donation.val().date}</td>
                <td>${donation.val().paymentMethod}</td>
                <td>${donation.val().accountHolderName}</td>
                <td>${donation.val().accountNumber}</td>
            </tr>
        `);
          });
      });
    });
}

function loadRiderProducts(userId) {
  firebase
    .database()
    .ref()
    .child("Products")
    .orderByChild("riderId")
    .equalTo(userId)
    .once("value")
    .then((products) => {
      products.forEach((product) => {
        $("#userProducts tr:last").after(`
            <tr>
                <td>${product.val().name}</td>
                <td>${product.val().category}</td>
                <td>${product.val().quantityOfProducts}</td>
                <td>${product.val().phoneno}</td>
                <td><a href="/admin/productDetail?id=${
                  product.val().id
                }" class="btn btn-sm btn-primary">DETAILS</a></td>
            </tr>
        `);
      });
    });
}
