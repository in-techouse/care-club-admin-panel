// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDwZmt0hjlG9xgRbtcLterT6-gz1LsSWY0",
  authDomain: "care-club.firebaseapp.com",
  databaseURL: "https://care-club.firebaseio.com",
  projectId: "care-club",
  storageBucket: "care-club.appspot.com",
  messagingSenderId: "623065144487",
  appId: "1:623065144487:web:6d667d71be09ab5ae9cf82",
  measurementId: "G-217XRK2H6J",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

$(document).ready(function () {
  console.log("Profile Document is ready");
  $("#selectImage").change(function () {
    readURL(this);
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#profileImage").attr("src", e.target.result);
      startUpload();
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function startUpload() {
  $("#submitProfile").prop("disabled", true);
  var file = document.getElementById("selectImage").files[0];
  let dateTime = new Date().getTime();
  var fileName = dateTime + file.name;
  console.log("File: ", file);
  console.log("Date Tme: ", dateTime);
  console.log("File Name: ", fileName);

  var ref = firebase.storage().ref("NGOs").child("Profile").child(fileName);
  var uploadTask = ref.put(file);
  console.log("File Upload Started");

  uploadTask.on(
    "state_changed",
    function (snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      progress = progress.toFixed(2);
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function (error) {
      $("#submitProfile").prop("disabled", false);
      console.log("Upload Error: ", error);
    },
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log("File available at", downloadURL);
        $("#imageUrl").val(downloadURL);
        $("#submitProfile").prop("disabled", false);
      });
    }
  );
}
