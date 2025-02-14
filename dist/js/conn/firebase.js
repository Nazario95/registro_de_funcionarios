import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";    
import {getFirestore,collection,getDocs, addDoc,updateDoc, doc, getDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {getStorage, ref, getDownloadURL,uploadBytes, deleteObject} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDo9aV_yl9KAzBBXabNwcN3SVVS92q1GRE",
    authDomain: "fenaeg-46281.firebaseapp.com",
    projectId: "fenaeg-46281",
    storageBucket: "fenaeg-46281.appspot.com",
    messagingSenderId: "547523336916",
    appId: "1:547523336916:web:75883741859da8e50b7941",
    measurementId: "G-PRDLNVDJ97"
};
const app = initializeApp(firebaseConfig); 

export var x = app

//=================>CRUD FIRESTORE
const db = getFirestore(app)
// ------>subir datos
    export function guardarDoc(){

    }
    export async function guardarColeccion(ruta,datos){
        const respuesta =  await addDoc(collection(db,ruta),datos);
        if(respuesta)  return true;
        else return false;      
    }
    export async function actualizar(ruta,id,datos){
       let res =  await updateDoc(doc(db,ruta,id),datos);
       return res;
    }

    export async function borrar(ruta,id){
        let res = await deleteDoc(doc(db,ruta,id));
        return res;
    }

    export async function obtenerDoc(ruta,id){
        const res = await getDoc(doc(db,ruta,id));
        return res;
    }

//---------> CONSULTAR DATOS

    export async function consulta(consultarDatos,ruta) {
        // console.log(consultarDatos)
        // console.log(`${Object.keys(consultarDatos)[0]}`)
        // console.log(`${Object.values(consultarDatos)[0]}`)
        let res
        try {
            res = await getDocs(query(collection(db,ruta,),  where(`${Object.keys(consultarDatos)[0]}`, "==", `${Object.values(consultarDatos)[0]}`)));
            return res
        } catch (error) {
            return error
        }
    }
    
    export async function coleccionDatos(ruta) {
        const res = await getDocs(collection(db,ruta));
        return res;
    }

//=================>CRUD STORAGE    
const storage = getStorage(app); 
//>>>>> Descargar
export async function subirMultimedia(nomArchivo,archivo,path){

    const storageRef = ref(storage, `${path}/${nomArchivo}`);

    uploadBytes(storageRef, archivo)
        .then((res) => {
            localStorage.setItem('up_file','true');
            return res;
        })
        .catch(err=>{
            return err
        })
}   
//>>>>>Borrar
export async function  borrarMultimedia(ruta,nomImg){
    const archivoRef = ref(storage,`${ruta}/${nomImg}`);		
    deleteObject(archivoRef)
        .then((res) => {return res})
        .catch((err) => {return err});
}
//>>>>>>Descargar
export async function downMultimedia(ruta,id){
    const res = getDownloadURL(ref(storage, `${ruta}/${id}`));
    return res;
}
