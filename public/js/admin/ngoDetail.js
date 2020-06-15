$(document).ready(function () {
  const ngoId = $("#ngoId").val();
  loadPaymentMethods(ngoId);
  loadDonations(ngoId);
  loadRiders(ngoId);
  loadProducts(ngoId);
});

function loadPaymentMethods(ngoId) {
  firebase
    .database()
    .ref()
    .child("PaymentMethods")
    .orderByChild("ngoId")
    .equalTo(ngoId)
    .once("value")
    .then((data) => {
      data.forEach((method) => {
        $("#ngoPaymentMethod tr:last").after(`
            <tr>
                <td>${method.val().name}</td>
                <td>${method.val().providerName}</td>
                <td>${method.val().accountHolderName}</td>
                <td>${method.val().accountNumber}</td>
            </tr>
        `);
      });
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
      data.forEach((donation) => {
        firebase
          .database()
          .ref()
          .child("Users")
          .child(donation.val().userId)
          .once("value")
          .then((user) => {
            $("#ngoDonations tr:last").after(`
                <tr>
                    <td>${user.val().fname} ${user.val().lname}</td>
                    <td>${donation.val().amount} RS</td>
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

function loadRiders(ngoId) {
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("ngoId")
    .equalTo(ngoId)
    .once("value")
    .then((riders) => {
      riders.forEach((rider) => {
        if (rider.val().role === 1) {
          $("#ngoRiders tr:last").after(`
            <tr>
                <td>${rider.val().fname} ${rider.val().lname}</td>
                <td>${rider.val().email}</td>
                <td>${rider.val().phone}</td>
                <td>
                  <a href="/admin/userDetail?id=${
                    rider.val().id
                  }" class="btn btn-sm btn-primary">Details</a>
                </td>
            </tr>
        `);
        }
      });
    });
}

function loadProducts(ngoId) {
  firebase
    .database()
    .ref()
    .child("Products")
    .orderByChild("ngoid")
    .equalTo(ngoId)
    .once("value")
    .then((products) => {
      products.forEach((product) => {
        $("#ngoProducts tr:last").after(`
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
