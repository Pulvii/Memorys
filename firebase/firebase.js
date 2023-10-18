  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
  
  
  const firebaseConfig = {

    apiKey: "AIzaSyCpfhOnjmnpqGriQ2gnCEt0gSnWPJw63qI",

    authDomain: "memorys-c7164.firebaseapp.com",

    projectId: "memorys-c7164",

    storageBucket: "memorys-c7164.appspot.com",

    messagingSenderId: "287007507996",

    appId: "1:287007507996:web:5408ee2a2c78b72ea941d9",

    measurementId: "G-LRBSYE2205"

  };


  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);


  console.log("conexion establecida");
//
//let db  = firebase.firestore();

//const saveUser = (user) =>{
  //  db.collection("Usuarios").add({
  //      user
  //  })
 //   .then(function(docRef){
  //      MJSOK();
  //  })
   // .catch(function(error) {
 //       MSJERROR();
   // });
//}



//const MJSOK =()=>{
  //  Swal.fire(
  //      'Good job!',
  //      'You clicked the button!',
   //     'success'
  //    )
//}

//const MSJERROR =()=>{
    //Swal.fire(
    //    'Ops!',
    //    'Something Wrong!',
   //     'error'
   //   )
//}

 //$("#prueba12").on('click',()=>{
  //  alert("hola");
 //})