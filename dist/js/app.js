import { guardarColeccion,coleccionDatos, obtenerDoc, subirMultimedia, downMultimedia } from "./conn/firebase.js";
document.addEventListener("DOMContentLoaded", init())

//#0.------VARIABLES
let fichaActiva;
let datosFuncionarios; //almacena todos los datos cargados durante la inicializacion
let idfichaActivo;

//#1----------- FUNCIONES DE INICIALIZACION
function init(){
    cargarPerfilFuncionario()
    checkScrenDimension()
}
//--------./Funciones de inicializacion

//#2-------- CARGA TABLA FUNCIONARIOS
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
            // console.log(dato.data())
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
                        <span class="c-btn px-1 rounded-1 ver-ficha" type="button" id="${dato.id}" 
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
//#2-------- ./carga tabla funcionarios

//#3 ------------------ VER FICHA
async function verFicha(idFIcha){
    idfichaActivo = idFIcha;
    actEdicion(false)
    //modificar id de btn actualizar
    document.querySelectorAll(".btn-modificar").forEach((btnModificar)=>{
        btnModificar.setAttribute("id",idFIcha)
    })
    // resetar las imagenes
    document.querySelectorAll(".img-funcionario").forEach(imagen=>{
        imagen.removeAttribute('src')
        imagen.setAttribute('src','./img/user-solid.svg')
    })
    // console.log(idFIcha)
    //get ficha
    let res = await obtenerDoc('funcionarios',idFIcha);

    if(res){

        fichaActiva = res.data()

        let {nombre,apellidos,ciudad,funcion,provincia, escala, direccion, destino, tipoEstudios, email, estudios, expediente, tipoTitulo, nivelEstudios, nombramiento, bario,tel, historial} = fichaActiva

        // console.log(escala)
        //Nombre completo
        document.querySelectorAll(".ficha-nombre")[0].textContent = nombre.toUpperCase() + ' ' + apellidos.toUpperCase()
        document.querySelectorAll(".ficha-nombre")[1].textContent = nombre.toUpperCase() + ' ' + apellidos.toUpperCase()
        //escala
        document.querySelectorAll(".ficha-escala")[0].value = escala ? escala : "-";
        document.querySelectorAll(".ficha-escala")[1].value = escala ? escala : "-";
        //funcion 
        document.querySelectorAll(".ficha-funcion")[0].value = funcion ? funcion : "-";
        document.querySelectorAll(".ficha-funcion")[1].value = funcion ? funcion : "-";
        //Direccion
        document.querySelectorAll(".ficha-direccion")[0].value = direccion ? direccion : "-";
        document.querySelectorAll(".ficha-direccion")[1].value = direccion ? direccion : "-";
        //Destino actual
        document.querySelectorAll(".ficha-destino")[0].value = provincia & ciudad + " , "+provincia ? destino : "-";
        document.querySelectorAll(".ficha-destino")[1].value = provincia & ciudad + " , "+provincia ? destino : "-";
        //Fecha de nombramiento
        document.querySelectorAll(".ficha-fecha-nombramiento")[0].value = nombramiento ? nombramiento : "-";
        document.querySelectorAll(".ficha-fecha-nombramiento")[1].value = nombramiento ? nombramiento : "-";
        //bario
        document.querySelectorAll(".ficha-bario")[0].value = bario ? bario : "-";
        document.querySelectorAll(".ficha-bario")[1].value = bario ? bario : "-";
        //telefono
        document.querySelectorAll(".ficha-tel")[0].value = tel ? tel : "-";
        document.querySelectorAll(".ficha-tel")[1].value = tel ? tel : "-";
        //email
        document.querySelectorAll(".ficha-email")[0].value = email ? email : "-";
        document.querySelectorAll(".ficha-email")[1].value = email ? email : "-";
        
         //estudios
         document.querySelectorAll(".ficha-info-academica-1")[0].value = tipoEstudios && estudios? tipoEstudios: "-";
         document.querySelectorAll(".ficha-info-academica-1")[1].value = tipoEstudios && estudios? tipoEstudios: "-";

        document.querySelectorAll(".ver-expediente")[0] ? document.querySelectorAll(".ver-expediente")[0].setAttribute("id",`${expediente? expediente : 'false'}`):""
         document.querySelectorAll(".ver-expediente")[1] ? document.querySelectorAll(".ver-expediente")[1].setAttribute("id",`${expediente? expediente : 'false'}`):""

         //nivel-de-estudios
        //  document.querySelector(".ficha-historial-funcion-1").value = historial ? historial : "-";   
        
        cargarImgFuncionario()
    }
    
}




//------------ GUARDAR NUEVO FUNCIONARIO
    //capturar datos
    var btnSaveNew = document.getElementById("save-new")
    btnSaveNew.addEventListener("click",()=>{
        btnSaveNew.setAttribute("disabled","true")
        document.querySelector(".load-efx").classList.remove("d-none")
        captDatos()
    })
    function captDatos(){
        let chkIput = true;
        const nombre = document.querySelector(".nombre").value
        const apellidos = document.querySelector(".apellidos").value
        const funcion = document.querySelector(".funcion").value
        const destProvincia = document.querySelector(".destino-provincia").value
        const destCiudad = document.querySelector(".destino-ciudad").value
        const escala = document.querySelector(".escala").value
        const direccion = document.querySelector(".direccion").value
        const destino = document.querySelector(".destino").value
        const tipoEstudios = document.querySelector(".tipoEstudios").value
        const email = document.querySelector(".email").value
        const fechaFombramiento = document.querySelector(".fecha-nombramiento").value

        // sanear datos
        // console.log(funcion)
        document.querySelectorAll(".form-new-funcionario").forEach(neFuncionario => {
            console.log(neFuncionario.value)
            if(neFuncionario.value === ""){
                console.log("no se admitene caracteres vacios")
                inputError("No se admiten campos vacios","form-nuevo-funcionario-err");
            }
            // else if(nombre == ""){inputError("","form-nuevo-funcionario-err")}
            // else if(apellidos == ""){inputError("apellidos")}
            else if(funcion == "0"){inputError("Selecione una funcion","form-nuevo-funcionario-err")}
            else if(destProvincia=="0"){inputError("Selecione una provincia","form-nuevo-funcionario-err")}
            else if(destCiudad=="0"){inputError("Selecione una ciudad","form-nuevo-funcionario-err")}
            else{
                chkIput = false;                
            }
        });

        if(chkIput == false){
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
                nombramiento:fechaFombramiento
            })
        }
    }
    
    // Guardamos
    async function saveNewData(data){
        let res = await guardarColeccion("funcionarios",data)
        res?location.reload():alert("Error al Subir datos")
    }

    function inputError(msg,ubicacion){
        if(ubicacion == "error-actualizar"){
            btnSaveNew.removeAttribute("disabled")
            document.querySelector(".efx-actualizando").classList.add("d-none")
            document.querySelector(`.${ubicacion}`).textContent= msg
        }
        else{
            btnSaveNew.removeAttribute("disabled")
            document.querySelector(".load-efx").classList.add("d-none")
            document.querySelector(`.${ubicacion}`).textContent= msg
        }
    }
//-------------- ./Guardar nuevo funcionario

//---------------ACTUALIZAR DATOS
    async function actualizarDatos(){        
		let foto = document.querySelector(".ficha-foto-movil").files[0];
        let nombreFoto;
		
        if(foto == undefined){
            inputError('Selecione una Imagen','error-actualizar')
        }
        else{
            nombreFoto = `img-${idfichaActivo}`
            await subirMultimedia(nombreFoto,foto,'funcionarios');
            let resInt1 = setInterval(()=>{
                let checkRes = localStorage.getItem('up_file')
                if(checkRes != null && checkRes == 'true'){
                    clearInterval(resInt1);
                    localStorage.removeItem('up_file');
                    location.reload()
                }                
            },200)
            // console.log(foto)
            // console.log(idfichaActivo)
        }
       
    }
    // ---------------DESCARGAR IMAGENES
    async function cargarImgFuncionario(){
        'buscar img'
        let res = await downMultimedia('funcionarios',`img-${idfichaActivo}`);
        'Mostrar img'
        
        if(res){
            document.querySelectorAll(".img-funcionario").forEach(imagen=>{
                imagen.setAttribute('src',res)
            })
        }        
    }

// -----------ACTIVAR EDICION / DESCATIVAR EDICION
    document.querySelectorAll(".btn-modificar").forEach(btnModificar =>{
        btnModificar.addEventListener("click",()=>{
            //Activar accion de Modificar Datos
            console.log(btnModificar.value)
            if(btnModificar.value == "0"){
                console.log(btnModificar.value)
                actEdicion(true)
                btnModificar.innerHTML = 'Actualizar <i class="nav-icon fas fa-edit"></i>'
                btnModificar.classList.remove("btn-success")
                btnModificar.classList.add("btn-primary")
                btnModificar.setAttribute("value","1")
            }
            //Activar accion de actualizar los Datos
            else if(btnModificar.value == "1"){
                console.log(btnModificar.value)
                actEdicion(false)
                btnModificar.innerHTML = 'Actualizando <i class="nav-icon fas fa-edit"></i> <img src="./img/load.svg" alt="" class="efx-actualizando">';

                actualizarDatos()
            }
           
         })
    })

    function actEdicion(accion){
        //activar
        if(accion){
            document.querySelectorAll(".ficha").forEach(ficha=>{
                ficha.classList.remove("c-btn")
                ficha.classList.add("bg-danger", "bg-opacity-25")
                ficha.removeAttribute("disabled")
            })
        }
        //descativar
        else{
            document.querySelectorAll(".ficha").forEach(ficha=>{
                ficha.classList.remove("bg-danger", "bg-opacity-25")
                ficha.classList.add("c-btn", "bg-opacity-25")
                ficha.setAttribute("disabled",true)
            })
        }
    }
// -------------/Activar o descativar edicion

//EVENTO DE CIERRE DE MODAL
$(document).on('hidden.bs.modal', '#ficha',()=>{    
    document.querySelectorAll(".btn-modificar").forEach((btnModificar)=>{
        btnModificar.innerHTML = ' Modificar  <i class="nav-icon fas fa-edit"></i>'
        btnModificar.setAttribute("value","0")
        btnModificar.classList.add("btn-success")        
    });

});


// FUNCIONES REUSABLES ----------------------------------------------
    //detectar dimension de pantalla
    function checkScrenDimension(){
        if (window.innerWidth >= 992){
            //ver ficha para ordenador
            document.querySelector(".ficha").classList.remove("d-none")
        }
    }

