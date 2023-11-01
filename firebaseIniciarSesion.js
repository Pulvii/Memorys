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
    var usuario = document.getElementById("username").value;
    var contrasenia = document.getElementById("contrasenia").value;
  
    // Hashea la contraseña utilizando SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(contrasenia);
  
    window.crypto.subtle.digest("SHA-256", data)
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
        const usuariosRef = db.collection('Usuario');

        usuariosRef.where('usuario', '==', usuario)
          .get()
          .then((querySnapshot) => {
            if (!(querySnapshot.size > 0)) {
              console.log("El usuario no existe");
              document.getElementById("userError").style.display = "block";
            } else {
              usuariosRef.where('contrasenia', '==', hashHex)
                .get()
                .then((querySnapshot) => {
                  if (!(querySnapshot.size > 0)) {
                    console.log("Contraseña incorrecta");
                    document.getElementById("contraError").style.display = "block";
                    document.getElementById("userError").style.display = "none";
                  } else {
                    console.log("entro");
                    document.getElementById("userError").style.display = "none";
                    document.getElementById("contraError").style.display = "none";
                    window.location.href = "index.html";
                    localStorage.setItem("nombreUsuario", usuario);
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
  