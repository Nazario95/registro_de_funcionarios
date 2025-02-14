import { guardarColeccion,coleccionDatos, obtenerDoc } from "./conn/firebase.js";
document.addEventListener("DOMContentLoaded", init())

// VARIABLES
let fichaActiva;

function init(){
    cargarPerfilFuncionario()
    checkScrenDimension()
}

//CARGA TABLA FUNCIONARIOS
async function cargarPerfilFuncionario(){
    // descarga de datos
    let res = await coleccionDatos('funcionarios')
    // console.log(res)
    if(!res){
        alert("Error de consulta, recargue la paguina")
    }
    else{
        let elementos =  '';
        let orden = res.size

        res.forEach(dato => {
            console.log(dato.data())
            // Desestructurar datos
            let {nombre, apellidos, ciudad, funcion, direccion} = dato.data()
            elementos += `
                <tr>
                      <td>OR${orden}</td>
                      <td>${nombre}</td>
                      <td>${apellidos}</td>
                      <td>${ciudad}</td>
                      <td>${funcion}</td>
                      <td>${direccion ? direccion : "Sin Asignacion"}</td>
                      <td>
                        <span class="badge badge-success ver-ficha" type="button" id="${dato.id}" 
                        ${window.innerWidth < 992 ? 'data-bs-toggle="modal" data-bs-target="#ficha" ' : ""}
                        >
                          Ver Ficha
                        </span>
                      </td>
                </tr> 
            ` 
            orden--
        });
        // Inyectar Datos
        document.querySelector(".tabla-registros").innerHTML = elementos
        
        document.querySelectorAll(".ver-ficha").forEach(btnVerFicha=>{
            btnVerFicha.addEventListener("click",(e)=>{
                // console.log(e.target.id) 
                //Ver Ficha
                verFicha(e.target.id)
            })
        })  
    }
}

//VER FICHA
async function verFicha(idFIcha){
    //modificar id de btn actualizar
    document.querySelector(".btn-actualizar-ficha").setAttribute("id",idFIcha)
    // console.log(idFIcha)
    //get ficha
    let res = await obtenerDoc('funcionarios',idFIcha);
    if(res){
        fichaActiva = res.data()

        let {nombre,apellidos,ciudad,funcion,provincia, escala, direccion, destino, tipoEstudios, email, estudios, expediente, tipoTitulo, nivelEstudios, nombramiento, bario,tel, historial} = fichaActiva

        // console.log(escala)
        //Nombre completo
        document.querySelector(".ficha-nombre").textContent = nombre.toUpperCase() + ' ' + apellidos.toUpperCase()
        //escala
        document.querySelector(".ficha-escala").textContent = escala ? escala : "-";
        //funcion 
        document.querySelector(".ficha-funcion").textContent = funcion ? funcion : "-";
        //Direccion
        document.querySelector(".ficha-direccion").textContent = direccion ? direccion : "-";
        //Destino actual
        document.querySelector(".ficha-destino").textContent = provincia & ciudad + " , "+provincia ? destino : "-";
        //Fecha de nombramiento
        document.querySelector(".ficha-nombramiento").textContent = nombramiento ? nombramiento : "-";
        //bario
        document.querySelector(".ficha-bario").textContent = bario ? bario : "-";
        //telefono
        document.querySelector(".ficha-tel").textContent = tel ? tel : "-";
         //formacion-tipo-nivel
         document.querySelector(".ficha-estudio-tipo-nivel").textContent = tipoEstudios ? tipoEstudios : "-";
          //estudios
          document.querySelector(".ficha-estudio").textContent = estudios ? estudios : "-";
          //email
          document.querySelector(".ficha-email").textContent = email ? email : "-";
           //numero expediente
           console.log( document.querySelector(".expediente"))

           document.querySelector(".expediente") ? document.querySelector(".expediente").setAttribute("id",`${expediente? expediente : 'false'}`):""

        //email
        document.querySelector(".ficha-estudio-tipo-nivel").textContent = tipoTitulo ?? tipoTitulo;

          //nivel-de-estudios
          document.querySelector(".ficha-estudio").textContent = nivelEstudios ? tipoTitulo : "-";

         //nivel-de-estudios
         document.querySelector(".ficha-historial-funcion-1").textContent = historial ? historial : "-";        
    }
    
}

//DETECTAR DIMENSION DE PANTALLA
function checkScrenDimension(){
    if (window.innerWidth >= 992){
        //ver ficha para ordenador
        document.querySelector(".ficha").classList.remove("d-none")
    }
    // else {console.log(window.innerWidth)} 
}
//CARGAR DATOS EN MODAL DE RELLENAR FICHA
document.querySelector(".btn-actualizar-ficha").addEventListener("click",(e)=>{
    //let idFichaActivo = e.target.getAtribute("id")
    let {nombre,apellidos,ciudad,funcion,provincia, escala, direccion, destino, tipoEstudios, email, estudios, expediente, tipoTitulo, nivelEstudios, nombramiento, bario,tel, historial} = fichaActiva


})

//GUARDAR NUEVO FUNCIONARIO
    //capturar datos
    var btnSaveNew = document.getElementById("save-new")
    btnSaveNew.addEventListener("click",()=>{
        btnSaveNew.setAttribute("disabled","true")
        document.querySelector(".load-efx").classList.remove("d-none")
        captDatos()
    })
    function captDatos(){
        const nombre = document.querySelector(".escala").value
        const apellidos = document.querySelector(".apellidos").value
        const funcion = document.querySelector(".funcion").value
        const destProvincia = document.querySelector(".destino-provincia").value
        const destCiudad = document.querySelector(".destino-ciudad").value

        const escala = document.querySelector(".nombre").value
        const direccion = document.querySelector(".direccion").value
        const destino = document.querySelector(".destino").value
        const tipoEstudios = document.querySelector(".tipoEstudios").value
        const email = document.querySelector(".email").value
        const fechaFombramiento = document.querySelector(".fecha-nombramiento").value
        const estudios = document.querySelector(".estudios").value

        // sanear datos
        // console.log(funcion)

        if(nombre == ""){inputError("nombre")}
        else if(apellidos == ""){inputError("apellidos")}
        else if(funcion == "0"){inputError("funcion")}
        else if(destProvincia=="0"){inputError("destProvincia")}
        else if(destCiudad=="0"){inputError("destCiudad")}
        else{
            // console.log({
            //     nombre:nombre,
            //     apellidos:apellidos,
            //     funcion:funcion,
            //     provincia:destProvincia,
            //     ciudad:destCiudad
            // })
            //guardando info
            saveNewData({
                nombre:nombre,
                apellidos:apellidos,
                funcion:funcion,
                provincia:destProvincia,
                ciudad:destCiudad,
                escala:escala,
                direccion:direccion,
                destino:destino,
                tipoEstudios:tipoEstudios,
                email:email,
                nombramiento:fechaFombramiento,
                estudios:estudios
            })
        }        
    }
    
    // Guardamos
    async function saveNewData(data){
        let res = await guardarColeccion("funcionarios",data)
        res?location.reload():alert("Error al Subir datos")
    }

    function inputError(data){
        console.log("error de insercion en " + data)
    }



