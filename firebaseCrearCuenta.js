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

async function datosEnviados() {
  var nombre = document.getElementById("nombre").value;
  var usuario = document.getElementById("username").value;
  var mail = document.getElementById("mail").value;
  var contrasenia = document.getElementById("contrasenia").value;


  if (contrasenia == "") {
    document.getElementById("contraError").style.display = "block";
  } else{
     // Hashea la contraseña utilizando SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(contrasenia);


  window.crypto.subtle.digest("SHA-256", data)
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

      const docData = {
        nombre: nombre,
        usuario: usuario,
        mail: mail,
        contrasenia: hashHex, // Almacena el hash de la contraseña en lugar de la original
        seguidos: 0,
        seguidores: 0,
        provicional: contrasenia,
        descripcion: ""
      };

      const usuariosRef = db.collection('Usuario');

      usuariosRef.where('mail', '==', mail)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            console.log("El correo ya existe en la base de datos");
            document.getElementById("mailError").style.display = "block";
          } else {
            usuariosRef.where('usuario', '==', usuario)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                  console.log("El usuario ya existe en la base de datos");
                  document.getElementById("mailError").style.display = "none";
                  document.getElementById("userError").style.display = "block";
                } else {
                  db.collection("Usuario").doc(usuario).set(docData)
                    .then(() => {
                      console.log("Documento escrito exitosamente");
                      document.getElementById("mailError").style.display = "none";
                      document.getElementById("userError").style.display = "none";
                      document.getElementById("contraError").style.display = "none";
                      location.href="IniciarSesion.html";
                    })
                    .catch((error) => {
                      console.error('Error al escribir el documento:', error);
                    });
                }
              })
              .catch((error) => {
                console.error('Error al consultar la base de datos:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error al consultar la base de datos:', error);
        });
    })
    .catch(error => {
      console.error('Error al hashear la contraseña:', error);
    });
  }


 
}
