
const firebaseConfig = {
  apiKey: "AIzaSyCpfhOnjmnpqGriQ2gnCEt0gSnWPJw63qI",
  authDomain: "memorys-c7164.firebaseapp.com",
  projectId: "memorys-c7164",
  storageBucket: "memorys-c7164.appspot.com",
  messagingSenderId: "287007507996",
  appId: "1:287007507996:web:5408ee2a2c78b72ea941d9",
  measurementId: "G-LRBSYE2205"
};



const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var numCuenta = 0;



function datosEnviados(){
  var usuario = document.getElementById("username").value;
var mail = document.getElementById("mail").value;
var contrasenia = document.getElementById("contrasenia").value;

const docData = {
  usuario : usuario,
  mail : mail,
  contrasenia: contrasenia,
  seguidos : 1,
  seguidores : 2
};
  db.collection("Usuario").doc("numCuenta").set(docData).then(() => {
    console.log("Document successfully written!");
    numCuenta++;
  });
}



