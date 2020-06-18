$(document).ready(function () {
  const ngoId = $("#ngoId").val();
  loadDonations(ngoId);
});

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
            $("#myDonations tr:last").after(`
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
