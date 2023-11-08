


  function borrarDatos() {
    localStorage.clear();
  }

// ID del documento que contiene las memorias
const documentoId = "MemoriesPublicas";

// Obtener la referencia del documento que contiene las memorias
const documentoRef = db.collection('Usuario').doc(documentoId);

// Escuchar cambios en el documento
documentoRef.onSnapshot((doc) => {
    if (doc.exists) {
        const data = doc.data();
        const publicaciones = data.Publicaciones || [];

        // Limpia el feed antes de agregar las nuevas memorias
        const feed = document.getElementById("feed");
        feed.innerHTML = "";

        // Agrega las memorias al feed
        publicaciones.forEach((memoria, index) => {
            usuarios.push({ id: index+1, usuario: memoria.id,nombre:memoria.nombre, fotoPerfil: memoria.fotoPerf });
            agregarMemoriaAlFeed({
                id: index + 1, // Puedes ajustar la lógica de generación de IDs
                usuarioId: memoria.id, // Puedes ajustar el usuarioId según tus necesidades
                tipo: "foto", // Puedes obtener el tipo de memoria de otro campo si es necesario
                contenido: memoria.linkFoto,
                nota: memoria.texto,
            });
        });
    } else {
        console.log("El documento no existe");
    }
});




// Variables globales para la cámara y el stream
let video = null;
let stream = null;
let photoCanvas = null;
let listening = false;
let camaraFuncinando = true;
let fotoSacada = false;
let mensajeEscrito = false;
const soundBar = document.getElementById("soundBar");
soundBar.style.display = "none"; 


// Simulando datos de usuarios y memorias
const usuarios = [
    { id: 1, usuario:" " , nombre: "Martin Tincho", fotoPerfil: "perfil.jpg" },
    { id: 2, usuario:" " , nombre: "Barbery", fotoPerfil: "perfil2.jpg" }
];

const memorias = [
];



// Función para crear y agregar una memoria al feed
function agregarMemoriaAlFeed(memoria) {
    uploadForm.classList.add("hidden");
    const usuario = usuarios.find(u => u.usuario === memoria.usuarioId);
    const memoriaElement = document.createElement("div");
    memoriaElement.classList.add("memoria", "flip-container");
    memoriaElement.innerHTML = `
        <div class="flipper">
            <div class="back">
                <img src="${usuario.fotoPerfil}" alt="${usuario.nombre}" class="profile-pic">
                <p style="font-size: x-large;font-weight: bold;">${usuario.nombre}</p>
                <p>${memoria.nota}</p>
            </div>
            <div class="front">
                <img src="${memoria.contenido}" alt="${memoria.nota}" class="front-img">
            </div>
        </div>
    `;
    const feed = document.getElementById("feed");
    feed.appendChild(memoriaElement);
}

// Cargar memorias en el feed inicialmente
const feed = document.getElementById("feed");
memorias.forEach(memoria => {
    agregarMemoriaAlFeed(memoria);
});

// Función para buscar un usuario por ID
function findUserById(userId) {
    return usuarios.find(user => user.id === parseInt(userId));
}

// Obtener elementos del formulario
const uploadForm = document.getElementById("uploadForm");
const closeFormButton = document.getElementById("closeForm");
const usuarioIdInput = document.getElementById("usuarioId"); // Campo de ID de usuario
const tipoInput = document.getElementById("tipo");
const capturePhotoButton = document.getElementById("capturePhoto");
photoCanvas = document.getElementById("photoCanvas");
const capturedImage = document.getElementById("capturedImage");
const notaInput = document.getElementById("nota");

// Manejar clic en el botón "Subir Memoria"
const uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("click", () => {
    // Mostrar el formulario
    uploadForm.classList.remove("hidden");
    startCamera(); // Iniciar la cámara cuando abres el formulario
    capturedImage.style.display = "none";
    capturedImage.src = ""; // Limpiar la imagen previamente capturada
    photoCanvas.style.display = "none";
});

// Manejar clic en el botón "Cerrar"
closeFormButton.addEventListener("click", () => {
    // Ocultar el formulario y detener la cámara
    uploadForm.classList.add("hidden");
    capturedImage.style.display = "none";
    photoCanvas.style.display = "none";
    stopCamera(); // Detener la cámara cuando cierras el formulario
});

// Función para iniciar la cámara
function startCamera() {
    fotoSacada = false;
    mensajeEscrito = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
            video: {
                width: { ideal: 1080 },
                height: { ideal: 1350 },
            },
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (mediaStream) {
                stream = mediaStream;
                camaraFuncinando = true;
                document.getElementById("sacarFoto").style.display = "inline-block";
                document.getElementById("errorCamara").style.display = "none";
                video = document.createElement("video");
                video.style.height = "40%";
                video.setAttribute("id", "video");
                video.srcObject = mediaStream;
                video.onloadedmetadata = function (e) {
                    video.play();
                };
                const videoContainer = document.getElementById("videoContainer");
                videoContainer.innerHTML = ""; // Limpiar cualquier instancia previa de la cámara
                videoContainer.appendChild(video);
            })
            .catch(function (error) {
                console.error("Error al acceder a la cámara: " + error);
                document.getElementById("sacarFoto").style.display = "none";
                document.getElementById("errorCamara").style.display = "block";
                camaraFuncinando = false;
            });
    } else {
        console.error("getUserMedia no está disponible en este navegador");
    }
}


// Función para detener la cámara
function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
    }
    if (video) {
        video.pause();
        video.srcObject = null;
    }
}

// Manejar clic en el botón "Tomar Foto"
capturePhotoButton.addEventListener("click", () => {
    if (video) {
        fotoSacada = true;
        photoCanvas.width = video.videoWidth;
        photoCanvas.height = video.videoHeight;
        document.getElementById("sacarFoto").style.display = "none";
        const context = photoCanvas.getContext('2d');
        context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
        stopCamera(); // Detener la cámara después de tomar la foto
        capturedImage.src = photoCanvas.toDataURL('image/png');
        capturedImage.style.display = "block";
        photoCanvas.style.display = "none";
        document.getElementById("video").style.display = "none";
    }
});


// Función para manejar el envío del formulario
uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const tipo = "foto";
    let contenido;
    let nota;
    if (fotoSacada) {
        contenido = capturedImage.src; // Usar la imagen capturada como contenido
    } else {
        contenido = document.getElementById('imagenMostrada').src;
    }
    if (mensajeEscrito) {
        nota = transcript0;
        transcript0 = "";
    } else {
        nota = " ";
    }
    primVez = true;
    var output = document.getElementById('output').innerHTML = " ";

    // Verificar si el usuario existe
    var usuarioLocal = localStorage.getItem("nombreUsuario");



    // Comprimir la imagen antes de subirla
    const maxImageSize = 500; // Establece el tamaño máximo que deseas para la imagen (puedes ajustarlo según tus necesidades)
    const compressedImage = await compressImage(contenido, maxImageSize);

    // Crear un objeto memoria con los datos del formulario
    const nuevaMemoria = {
        id: memorias.length + 1,
        usuarioId: usuario.id, // Asociar el ID del usuario
        tipo: tipo,
        contenido: compressedImage, // Utiliza la imagen comprimida
        nota: nota
    };

    // Actualizar el documento del usuario en Firestore para agregar la nueva memoria
    try {
        const usuarioRef = db.collection('Usuario').doc(usuarioLocal);
        await usuarioRef.update({
            Publicaciones: firebase.firestore.FieldValue.arrayUnion({ // Agrega el mapa al array
                linkFoto: compressedImage, // Enlace a la imagen en Firestore
                texto: nota // Texto asociado a la memoria
            })
        });
        console.log("Memoria agregada al array de Publicaciones en Firestore");
    } catch (error) {
        console.error("Error al agregar memoria a Firestore:", error);
    }

    try {
        const usuarioRef = db.collection('Usuario').doc("MemoriesPublicas");
        await usuarioRef.update({
            Publicaciones: firebase.firestore.FieldValue.arrayUnion({ // Agrega el mapa al array
                linkFoto: compressedImage, // Enlace a la imagen en Firestore
                texto: nota, // Texto asociado a la memoria
                id: localStorage.getItem("usuario"),
                nombre: localStorage.getItem("nombre"),
                fotoPerf: localStorage.getItem("fotoDePerfil")
            })
        });
        console.log("Memoria agregada al array de Publicaciones en Firestore");
    } catch (error) {
        console.error("Error al agregar memoria a Firestore:", error);
    }

    // Agregar la nueva memoria al feed
    agregarMemoriaAlFeed(nuevaMemoria);

    // Después de procesar la subida, puedes ocultar el formulario nuevamente
    uploadForm.classList.add("hidden");

    // También puedes enviar los datos al servidor o realizar otras acciones según tus necesidades
});

// Función para comprimir la imagen
async function compressImage(imageSrc, maxSize) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Verifica si la imagen supera el tamaño máximo
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height *= maxSize / width;
                    width = maxSize;
                } else {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Convierte la imagen comprimida a un Data URL (base64)
            const compressedImage = canvas.toDataURL("image/jpeg", 0.8); // Ajusta la calidad de compresión según tus necesidades

            resolve(compressedImage);
        };
    });
}







    var transcript;
    var transcript0;
    var output = document.getElementById('output');
    var primVez = true;



    function updateMicIcon() {
        const micIcon = document.getElementById("mic-icon");
        const micContainer = document.getElementById("mic-container");
    
        if (listening) {
            micIcon.classList.add("listening");
            micContainer.style.border = "2px solid lightblue"; // Cambia el color del borde
            micContainer.style.display = "none"; // Cambia el color del borde
            soundBar.style.display = "flex";
        } else {
            micIcon.classList.remove("listening");
            micContainer.style.border = "2px solid blue"; // Restaura el color del borde original
            micContainer.style.display = "inline-block"; // Cambia el color del borde
            soundBar.style.display = "none";
        }
    }


    let recognitionTimeout;

    function runSpeechRecog() {
        listening = true;
        updateMicIcon();
        document.getElementById("output").innerHTML = "Loading text...";
        var output = document.getElementById('output');
        var action = document.getElementById('action');
        let recognition = new webkitSpeechRecognition();
        
        recognition.onstart = () => {
            action.innerHTML = "Listening...";
        };
        
        recognition.onresult = (e) => {
            clearTimeout(recognitionTimeout); // Limpiar el temporizador cuando se recibe una entrada de voz
        
            transcript = e.results[0][0].transcript;
            mensajeEscrito = true;        
            if (primVez) {
                transcript0 = transcript;
            }
            if (primVez) {
                output.innerHTML = transcript + " " + "<img onclick='borrarMsj()' src='borrar.png' style='max-width: 5%; max-height: 5%;'>";
                output.classList.remove("hide");
                primVez = false;
            } else {
                escribirMensaje();
            }
        };
        
        recognition.onend = () => {
            // Iniciar un temporizador de x segundos para detener la escucha si no hay entrada de voz
            recognitionTimeout = setTimeout(() => {
                listening = false;
                recognition.stop();
                updateMicIcon();
                if (!primVez) {
                    output.innerHTML = transcript0+ "<img onclick='borrarMsj()' src='borrar.png' style='max-width: 5%; max-height: 5%;'>";                   
                }else{
                    output.innerHTML = "";                    
                }
            }, 1);
        };
        
        recognition.start();
    }
    
 function escribirMensaje(){
        transcript0=transcript0+" "+transcript;
        output.innerHTML = " "+transcript0 + " " + "<img onclick='borrarMsj()' src='borrar.png' style='max-width: 5%; max-height: 5%;'>";
 }

 function borrarMsj(){
    output.innerHTML = " ";
    primVez = true;
    transcript0 = " ";
 }

 