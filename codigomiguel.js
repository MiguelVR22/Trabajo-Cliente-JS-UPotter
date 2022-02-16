"use strict";

mostrarArea("areaHome");   

var tienda = new Tienda;

var oUsuarioLogueado = null;

var aCarrito = [];

datosIniciales();

let oXML = loadXMLDoc("productos.xml");

let oXMLAdmin = loadXMLDoc("productos.xml");

mostrarNavBar();







//Añadimos los manejadores de eventos

document.querySelector("#navHome").addEventListener("click",function() {mostrarArea("areaHome");},false);

document.querySelector("#navProducto").addEventListener("click",function() {mostrarArea("areaProductos");},false);

document.querySelector("#navProductoLogueado").addEventListener("click",function() {mostrarArea("areaProductos");},false);

document.querySelector("#navIniciarSesion").addEventListener("click",function() {mostrarArea("areaIniciarSesion");},false);

document.querySelector("#navRegistro").addEventListener("click",function() {mostrarArea("areaRegistro");},false);

frmRegistroUsuario.botonAceptarRegistroUsuario.addEventListener("click",registroUsuario,false);

frmInicioSesion.botonAceptarInicioSesion.addEventListener("click",inicarSesion,false);

frmInicioSesion.botonAceptarInicioSesion.addEventListener("click", recuperarCookiesCarrito(),false);

document.querySelector("#navPerfilLogueado").addEventListener("click",contruyePerfil,false);   // **!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!

document.querySelector("#navCerrarSesionLogueado").addEventListener("click",function(){desloguear(),false})

document.querySelector("#navCerrarSesionAdmin").addEventListener("click",function(){desloguear(),false})



document.getElementById("navProducto").addEventListener("click", cargarTabla);

document.getElementById("botonFiltrar").addEventListener("click", filtrarTabla);

document.getElementById("areaProductos").addEventListener("click", seleccionarProducto);

document.getElementById("botonLimpiarSeleccionados").addEventListener("click", limpiarSeleccionados);

document.getElementById("botonComprarSeleccionados").addEventListener("click", comprarProductosSeleccionados);

document.querySelector("#navProductoLogueado").addEventListener("click",cargarTabla,false);

document.querySelector("#navProductoAdmin").addEventListener("click",function() {mostrarArea("areaListadoProductosAdmin");},false);

document.querySelector("#navCarrito").addEventListener("click",mostrarCarrito,false);

cargarTablaListarProductos();



//Fin manejadores de eventos



function datosIniciales()

{

    tienda.altaNuevoCliente("admin Rodríguez","admin@hotmail.com","00000000A","calle La Parra 0",true,"admin000");

    tienda.altaNuevoCliente("Cliente1","cliente1@hotmail.com","11111111B","calle La Parra 1",false,"kakakaka");

    tienda.altaNuevoCliente("Cliente2","cliente2@hotmail.com","22222222C","calle La Parra 2",true,"kakakaka");

    tienda.altaNuevoCliente("Cliente3","cliente3@hotmail.com","33333333D","calle La Parra 3",true,"kakakaka");

    tienda.altaNuevoCliente("Cliente4","cliente4@hotmail.com","44444444E","calle La Parra 4",false,"kakakaka");

}



function mostrarArea(areaVisible) {

    ocultarTodo();

    document.getElementById(areaVisible).style.display = "block"

}



function ocultarTodo(){

    for(let area of document.getElementsByClassName("areaContenido")){

        area.style.display = "none";

    }

    document.querySelector("#mensaje").style.display = "none";

}



function ocultarNavBar() {

   let listaNavs = document.getElementById("containerNavs").querySelectorAll(".row");

   for(let barra of listaNavs) {

       barra.style.display = "none";

   }

}



function mostrarNavBar() {     // CÓDIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



    ocultarNavBar();



    if(!oUsuarioLogueado) 

        document.querySelector("#navBarNoLogueado").style.display = "flex";

    

    else {



        if(document.querySelector("#navNombre"))

            document.querySelector("#navNombre").remove();



        let oTexto = document.createElement("a");

        oTexto.classList.add("nav-link");

        oTexto.style.cursor = "default";

        oTexto.style.userSelect = "none";

        oTexto.setAttribute("id","navNombre");



        if(oUsuarioLogueado.Correo=="admin@hotmail.com") {   

            oTexto.textContent = "ADMIN";

            document.querySelector("#navCerrarSesionAdmin").before(oTexto);

            document.querySelector("#navBarAdmin").style.display = "flex";

        }

         else {

            oTexto.textContent = oUsuarioLogueado.Nombre;

            document.querySelector("#navPerfilLogueado").before(oTexto); 

            document.querySelector("#navBarLogueado").style.display = "flex";

            document.querySelector("#navCarrito").textContent = "Carrito("+ aCarrito.length +")";

        }

    }

}



function validarDatos() {   //**!!!!!!!!!!!!!!!!!!!!!CÓDIGO NUEVO HE HECHO VALIDAR DATOS, EL AREA DE PERFIL, EL EVENT LISTENER DEL BOTON DE PERFIL (deja de funcionar \r\n)

    let bTodoOk = true;

    let bPrimerErrorEncontrado = false;

    let sMensajeError = "";



    //email

    let oAreaMail = frmRegistroUsuario.txtEmail;

    let sMail = oAreaMail.value.trim();

    let oExp =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;





    if(!oExp.test(sMail)) {

        bTodoOk = false;

        oAreaMail.classList.add("error");

        sMensajeError += "\r\n -El e-mail no tiene un formato correcto.";



        if(!bPrimerErrorEncontrado) {

            bPrimerErrorEncontrado = true;

            oAreaMail.focus();

        }



    }

    else if(!oUsuarioLogueado){

        let bExiste = tienda.buscarCliente(sMail);



        if(bExiste) {

            bTodoOk = false;

            oAreaMail.classList.add("error");

            sMensajeError += "\r\n -Ese usuario ya existe.";

    

            if(!bPrimerErrorEncontrado) {

                bPrimerErrorEncontrado = true;

                oAreaMail.focus();

            }

        }

        else {

        oAreaMail.classList.remove("error");

        }

    }



//confirmacion email 

if(!oUsuarioLogueado) {

let oAreaMail2 = frmRegistroUsuario.txtEmail2;

let sMail2 = oAreaMail2.value.trim();



if(!oAreaMail.classList.contains("error") && sMail2 != sMail ) {

    bTodoOk = false;

    oAreaMail2.classList.add("error");

    sMensajeError += "\r\n -El e-mail y su confirmación no coinciden.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaMail2.focus();

    }

}

else {

    oAreaMail2.classList.remove("error");

}

}



//contraseña

let oAreaPass = frmRegistroUsuario.txtPassword;

let sPass = oAreaPass.value.trim();

oExp = /^[a-zA-Z0-9]{8,}$/;



if(!oExp.test(sPass)) {

    bTodoOk = false;

    oAreaPass.classList.add("error");

    sMensajeError += "\r\n -La contraseña debe estar compuesta por números y/o letras y tener al menos 8 caracteres.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaPass.focus();

    }

}

else {

    oAreaPass.classList.remove("error");

}



//confirmación contraseña



let oAreaPass2 = frmRegistroUsuario.txtPassword2;

let sPass2 = oAreaPass2.value.trim();



if(!oAreaPass.classList.contains("error") && sPass2 != sPass) {

    bTodoOk = false;

    oAreaPass2.classList.add("error");

    sMensajeError += "\r\n -El password y su confirmación no coinciden.";



    if(!bPrimerErrorEncontrado) {

    bPrimerErrorEncontrado = true;

    oAreaPass2.focus();

    }

}

else {

    oAreaPass2.classList.remove("error");

}



//Nombre

let oAreaNombre = frmRegistroUsuario.txtNombreUsuario;

let sNombre = oAreaNombre.value.trim();

oExp = /^[a-zA-Z0-9\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]{5,15}$/;



if(!oExp.test(sNombre)) {

    bTodoOk = false;

    oAreaNombre.classList.add("error");

    sMensajeError += "\r -El nombre debe tener entre 5 y 15 caracteres.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaNombre.focus();

    }

}

else {

    oAreaNombre.classList.remove("error");

}



//Dni



let oAreaDni = frmRegistroUsuario.txtDni;

let sDni = oAreaDni.value.trim();

oExp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;



if(!oExp.test(sDni)) {

    bTodoOk = false;

    oAreaDni.classList.add("error");

    sMensajeError += "\r\n -Debe introducir un DNI válido.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaDni.focus();

    }

}

else {

    oAreaDni.classList.remove("error");

}



//Direccion

let oAreaDireccion = frmRegistroUsuario.txtDireccion;

let sDireccion = oAreaDireccion.value.trim();



if(sDireccion == "") {

    bTodoOk = false;

    oAreaDireccion.classList.add("error");

    sMensajeError += "\r\n -Debe introducir una dirección.";

    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaDireccion.focus();

    } 

}

else {

    oAreaDireccion.classList.remove("error");

}



if(!bTodoOk)

mensaje(sMensajeError);



return bTodoOk;

}



function registroUsuario() { //****************************************************!CÓDIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*************************



if(validarDatos()){



    let sMail = frmRegistroUsuario.txtEmail.value;

    let sPass = frmRegistroUsuario.txtPassword.value;

    let sNombre = frmRegistroUsuario.txtNombreUsuario.value;

    let sDni = frmRegistroUsuario.txtDni.value;

    let sDireccion = frmRegistroUsuario.txtDireccion.value;

    

    let sTipoSus = frmRegistroUsuario.radioSuscripcion.value;

    let bTipoSus;

    

    if(sTipoSus == "premium")

    bTipoSus = true;

    else

    bTipoSus = false;



    tienda.altaNuevoCliente(sNombre,sMail,sDni,sDireccion,bTipoSus,sPass)

    mensaje("Usuario registrado correctamente. ¡Bienvenido/a!");   

}



}



function inicarSesion()

{

    let bCorrecto = true;

    let bErrores = false;

    let sMensajeError = "";

    let oUsuarioTemporal;



    let oAreaMail = frmInicioSesion.txtEmailInicio;

    let sMail = oAreaMail.value.trim();

    let oExp =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;





    if(!oExp.test(sMail)) 

    {

        bCorrecto = false;

        oAreaMail.classList.add("error");

        sMensajeError += "\r\n -Introduzca el Email correctamente.";



        if(!bErrores) 

        {

            bErrores = true;

            oAreaMail.focus();

        }

    }



    else 

    {

       //le quitamos la clase error

        oAreaMail.classList.remove("error");

        oUsuarioTemporal = tienda.buscarCliente(sMail);



        if(!oUsuarioTemporal) 

        {

            bCorrecto = false;

            oAreaMail.classList.add("error");

            sMensajeError += "\r\n Ese usuario no existe.";

    

            if(!bErrores) 

            {

                bErrores = true;

                oAreaMail.focus();

            }

        }



        else 

        {

            oAreaMail.classList.remove("error");

        }

    }



    let oAreaPass = frmInicioSesion.txtPasswordInicio;

    let sPass = oAreaPass.value;



    if(oUsuarioTemporal){

        if(sPass != oUsuarioTemporal.password) 

        {

            bCorrecto = false;

            oAreaPass.classList.add("error");

            sMensajeError += "\r\n -Contraseña incorrecta.";



            if(!bErrores) 

            {

                bErrores = true;

                oAreaPass.focus();

            }

        }

            

            else 

            {

                oAreaPass.classList.remove("error");

            }

    }



        if(bCorrecto)

        {

            sMensajeError = "\r\n Inicio de Sesión Correctamente"; // PEQUEÑAS MODIFICACIONES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            oUsuarioLogueado = oUsuarioTemporal;   

            mostrarNavBar();

            mostrarArea("areaHome");

            

            //Si se desea mantener la sesion iniciada el usuario entra en una cookie

            if( document.querySelector('#checkboxMantenerSesion').checked )

            {

                guardaUsuarioLogueado(oUsuarioLogueado);

            }

        }

        mensaje(sMensajeError);   

       



}



function desloguear() {

    oUsuarioLogueado = null;

    deleteCookie("usuarioLogueado");

    location.reload();     // PEQUEÑAS MODIFICACIONES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

}





function mensaje(cadena) {

let oMensaje = document.querySelector("#mensaje");

oMensaje.textContent = cadena;

oMensaje.style.display = "block";

}



function contruyePerfil() {    // Construye el área de perfil usuario !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    mostrarArea("areaRegistro");

    let oCabecera = document.querySelector("#areaRegistro").querySelector(".cabecera");

    oCabecera.textContent = "Perfil de "+oUsuarioLogueado.Nombre; 

        if(!document.querySelector("[name=botonModificarUsuario]")) {

            let botonModificar = document.createElement("INPUT");

            botonModificar.setAttribute("name","botonModificarUsuario");

            botonModificar.setAttribute("type","button");

            botonModificar.classList.add("btn","btn-primary","w-25");

            botonModificar.setAttribute("value","Actualizar");

    

            let botonBorrable = document.querySelector("[name = botonAceptarRegistroUsuario]");

            botonBorrable.before(botonModificar);

            botonBorrable.style.display = "none";

    

            cargarDatosPerfil();

            frmRegistroUsuario.querySelector("#areaConfirmaMail").remove();

            frmRegistroUsuario.txtEmail.setAttribute("disabled","true");

            botonModificar.addEventListener("click",modificarDatos,"false");

            botonModificar.setAttribute("disabled","true");

        }

    

    }

    

    function cargarDatosPerfil() {   // Construye el área de perfil usuario !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        

        frmRegistroUsuario.txtEmail.value = oUsuarioLogueado.Correo;

        frmRegistroUsuario.txtEmail2.value = oUsuarioLogueado.Correo;

        frmRegistroUsuario.txtPassword.value = oUsuarioLogueado.password;

        //frmRegistroUsuario.txtPassword2.value = oUsuarioLogueado.password;

        frmRegistroUsuario.txtNombreUsuario.value = oUsuarioLogueado.Nombre;

        frmRegistroUsuario.txtDni.value = oUsuarioLogueado.Dni;

        frmRegistroUsuario.txtDireccion.value = oUsuarioLogueado.Direccion;

    

        let oInputs = frmRegistroUsuario.querySelectorAll("input");

        

        for(let i=0;i<oInputs.length;i++){

            oInputs[i].addEventListener("input",habilitarBtnModificar,false);

        }

        

    }

    

    function habilitarBtnModificar() { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO

        document.querySelector("[name = botonModificarUsuario]").removeAttribute("disabled");

    }

    

    function modificarDatos() { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO

        if(validarDatos()) {

            let sPassConfirmación = prompt("Para actualizar introduzca su contraseña actual");

         if (sPassConfirmación == sPassConfirmación) {

         oUsuarioLogueado.Correo = frmRegistroUsuario.txtEmail.value;

         oUsuarioLogueado.password = frmRegistroUsuario.txtPassword.value;

         oUsuarioLogueado.Nombre = frmRegistroUsuario.txtNombreUsuario.value;

         oUsuarioLogueado.Dni = frmRegistroUsuario.txtDni.value;

         oUsuarioLogueado.Direccion = frmRegistroUsuario.txtDireccion.value;

         let sTipoSus = frmRegistroUsuario.radioSuscripcion.value;

         let bTipoSus;

         

         if(sTipoSus == "premium")

         bTipoSus = true;

         else

         bTipoSus = false;

     

         oUsuarioLogueado.tipoSuscripcion = bTipoSus;

         mostrarNavBar();

         mensaje("Perfil actualizado correctamente.");

     } 

     else {

         mensaje("Contraseña incorrecta.");

     }

        }

     }



//Para recuperar el carrito del usuario --------------------- Se puede mejorar para que sea para un usuario en específico

function recuperarCookiesCarrito()

{

    let sCookieCarrito = getCookie("carrito");

    if (sCookieCarrito.lenght > 0)

    {

        cookieCarrito = JSON.parse(sCookieCarrito);

        for (producto of cookieCarrito)

        {

            aCarrito.push(producto);

        }

    }

}



//Actualizar la cookie del carrito cada vez que se añada o elimine un producto del carrito

function actualizaCookieCarrito(aCarrito)

{

    let sCarrito = JSON.stringify(aCarrito);

    setCookie("carrito",sCarrito,30);

}







//Para guardar en cookie el usuario logueado 

function guardaUsuarioLogueado(oUsuarioTemporal)

{

    let sUsuarioTemporal = JSON.stringify(oUsuarioTemporal);

    setCookie("usuarioLogueado",sUsuarioTemporal,30);

}



//Si hay cookie de un usuario para mantener la sesion iniciada ---------------------------- ¿HAY QUE COMPLETARLO CON QUE INICIE SESION SOLO?

function iniciarSesionUsuarioLogueado()

{

    let usuarioRegistradoEmail;

    let cookieUsuarioLogueado = getCookie("usuarioLogueado");

    if (cookieUsuarioLogueado.length > 0)

    {

        //CAMBIAR PARA QUE INICIE SESION AUTOMATICAMENTE





        //Creo el objeto del usuarioLogueado con indices 'email' y 'password'

        let oUsuarioInicioSesion = JSON.parse(cookieUsuarioLogueado);



        //Busco si hay un usuario con ese mismo email y lo saco a una variable

        usuarioRegistradoEmail = tienda.buscarCliente(oUsuarioInicioSesion["Correo"]);



        //Lo comparo para ver si existe el usuario en el registro de usuario

        if (usuarioRegistradoEmail.password == oUsuarioInicioSesion["password"])

        {

            //Usuario se inicia    --------------------   Cuando sepamos como iniciar los usuarios

            alert(oUsuarioInicioSesion);

        }

    }

}



//Cargar Tabla de Productos

function cargarTabla(){

    mostrarArea("areaProductos");

    

    let oTablaDesplegada = document.querySelector("#areaProductos table");

    if(oTablaDesplegada != null){

        oTablaDesplegada.remove();

    }



    let oMunecos = oXML.querySelectorAll("muneco producto");

    let oVaritas = oXML.querySelectorAll("varita producto");



    // Crear Tabla

    let oTabla = document.createElement("TABLE");

    oTabla.classList.add("table");

    oTabla.classList.add("table-striped");

    oTabla.classList.add("table-hover");



    // Crear Encabezado

    let oTHead = oTabla.createTHead();



    // Crear Fila 

    let oFila = oTHead.insertRow(-1);



    // Crear Celdas

    let oCelda = document.createElement("TH");

    oCelda.textContent = "Nombre";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Precio";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Stock";

    oFila.appendChild(oCelda);





    oCelda = document.createElement("TH");

    oCelda.textContent = "Personaje";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Caracteristica";

    oFila.appendChild(oCelda);



    // Crear Cuerpo de la Tabla

    let oTBody = document.createElement("TBODY");

    for(let i = 0; i< oMunecos.length; i++){

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "muneco";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;

    }



    for(let i = 0; i< oVaritas.length; i++){

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "varita";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("material").textContent;

    }

    

    // Agregar el cuerpo a la tablaa

    oTabla.appendChild(oTBody);



    document.getElementById("areaProductos").appendChild(oTabla);

    

}



function filtrarTabla(){

    cargarTabla();

    let iValor = parseFloat(frmTablasProductos.txtPrecio.value.trim());

    let bAscendente = frmTablasProductos.radioPrecio_0.checked;

    let bDescendente = frmTablasProductos.radioPrecio_1.checked;

    

    let bTodos = frmTablasProductos.radioTipo_0.checked;

    let bMunecos = frmTablasProductos.radioTipo_1.checked;

    let bVaritas = frmTablasProductos.radioTipo_2.checked;



    let oObjetosFiltradosTipo = [];

    let oObjetosEliminar = [];



    let oTabla = document.querySelector("#areaProductos table");

    let iNumeroRegistros = oTabla.children[1].children.length;



    //document.querySelector("#areaProductos table").children[1].children[4].children[1]



    if(iValor >0){

        if(bTodos){

            if(bAscendente){

                for(let i = 0; i< iNumeroRegistros;i++){

                    if(parseFloat(oTabla.children[1].children[i].children[1].textContent) < iValor){

                        oObjetosEliminar.push(oTabla.children[1].children[i]);

                    }

                }

            } 

            

            if(bDescendente){

                for(let i = 0; i< iNumeroRegistros;i++){

                    if(parseFloat(oTabla.children[1].children[i].children[1].textContent) > iValor){

                        oObjetosEliminar.push(oTabla.children[1].children[i]);

                    }

                }

            }

    

            for(let x = 0; x < oObjetosEliminar.length; x++){

                oObjetosEliminar[x].remove();

            } 

            

        } else if(bMunecos){

            for(let i = 0; i< iNumeroRegistros; i++){

            if(oTabla.children[1].children[i].dataset.tipo == "muneco"){

                oObjetosFiltradosTipo.push(oTabla.children[1].children[i]);

                }

            }

    

            oTabla.children[1].remove();

    

            let oTBody = document.createElement("TBODY");

            let oMunecos = oXML.querySelectorAll("muneco producto");

    

            if(bAscendente){

            for(let i = 0; i< oMunecos.length; i++){

                if(parseFloat(oMunecos[i].querySelector("precio").textContent) > iValor){

                let oFila = oTBody.insertRow(-1);

                oFila.dataset.tipo = "muneco";

                let oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("precio").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("stock").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;                

                }

                

            }

    

            // Agregar el cuerpo a la tablaa

            oTabla.appendChild(oTBody);

        

            document.getElementById("areaProductos").appendChild(oTabla);

    

            } else {

                for(let i = 0; i< oMunecos.length; i++){

                    if(parseFloat(oMunecos[i].querySelector("precio").textContent) < iValor){

                    let oFila = oTBody.insertRow(-1);

                    oFila.dataset.tipo = "muneco";

                    let oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("precio").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("stock").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;                

                    }

                    

                }

        

                // Agregar el cuerpo a la tablaa

                oTabla.appendChild(oTBody);

            

                document.getElementById("areaProductos").appendChild(oTabla);  

            }

    

            } else {

                for(let i = 0; i< iNumeroRegistros; i++){

                if(oTabla.children[1].children[i].dataset.tipo == "varita"){

                    oObjetosFiltradosTipo.push(oTabla.children[1].children[i]);

                    }

                }        

        

                oTabla.children[1].remove();        

        

                let oTBody = document.createElement("TBODY");

                let oVaritas = oXML.querySelectorAll("varita producto");

        

                if(bAscendente){

                for(let i = 0; i< oVaritas.length; i++){

                    if(parseFloat(oVaritas[i].querySelector("precio").textContent) > iValor){

                    let oFila = oTBody.insertRow(-1);

                    oFila.dataset.tipo = "varita";

                    let oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("precio").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("stock").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("material").textContent;                

                    }

                    

                }

        

                // Agregar el cuerpo a la tablaa

                oTabla.appendChild(oTBody);

            

                document.getElementById("areaProductos").appendChild(oTabla);

        

                } else {

                    for(let i = 0; i< oVaritas.length; i++){

                        if(parseFloat(oVaritas[i].querySelector("precio").textContent) < iValor){

                        let oFila = oTBody.insertRow(-1);

                        oFila.dataset.tipo = "varita";

                        let oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("precio").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("stock").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("material").textContent;                

                        }

                        

                    }

            

                    // Agregar el cuerpo a la tablaa

                    oTabla.appendChild(oTBody);

                

                    document.getElementById("areaProductos").appendChild(oTabla);  

                }

            }

    }

    

}



function seleccionarProducto(oEvento){

    let oE = oEvento || window.event;



    if(oE.target.nodeName == "TD"){

        oE.target.parentElement.classList.toggle("seleccionado");

    }

}



function limpiarSeleccionados(){

    let oFilasSeleccionados = document.querySelectorAll(".seleccionado");



    for(let i = 0; i<oFilasSeleccionados.length; i++){

        oFilasSeleccionados[i].classList.toggle("seleccionado");

    }



}



//Devuelve un objeto oTabla con la tabla de listar usuarios pintada en su interior

function pintaTablaListarUsuarios()

{

    //Creo la tabla con bordes

    let oTabla = document.createElement("TABLE");

    oTabla.setAttribute("border","1");



    //Recorro la tabla de los clientes insertando los datos en el "body" de la tabla

    for(let cliente of tienda.arrClientes)

    {

        let usuario = cliente;

        let oFila = oTabla.insertRow();



        let sDato = usuario.Nombre;

        let oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.Correo;

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.Dni;

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.Direccion;

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.tipoSuscripcion;



        let sDatoTabla;

        if(sDato)

            sDatoTabla = "Premium";

        else

            sDatoTabla = "Standard";

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDatoTabla;

        

    }



    //Pinto el Encabezado de la tabla

    let oEncabezado = oTabla.createTHead();

    let oFilaEncabezado = oEncabezado.insertRow();



    let oDivNombre = document.createElement("TH");

    oDivNombre.textContent = "Nombre";

    oFilaEncabezado.appendChild(oDivNombre);



    let oDivCorreo = document.createElement("TH");

    oDivCorreo.textContent = "Correo";

    oFilaEncabezado.appendChild(oDivCorreo);

    

    let oDivDNI = document.createElement("TH");

    oDivDNI.textContent = "DNI";

    oFilaEncabezado.appendChild(oDivDNI);



    let oDivDireccion = document.createElement("TH");

    oDivDireccion.textContent = "Direccion";

    oFilaEncabezado.appendChild(oDivDireccion);



    let oDivTipoSubscripcion = document.createElement("TH");

    oDivTipoSubscripcion.textContent = "Tipo de Subscripción";

    oFilaEncabezado.appendChild(oDivTipoSubscripcion);

    

    return oTabla;

}



function comprarProductosSeleccionados(){

    let oObjetosSeleccionados = document.querySelectorAll(".seleccionado");

    // let oCompras = [];

    let oProducto;



    if(oUsuarioLogueado == null){

        alert("Debe iniciar sesión para poder comprar");

    } else {

        if(oObjetosSeleccionados.length == 0){

            alert("Debe seleccionar productos primero");

        } else {

            for(let i=0;i<oObjetosSeleccionados.length;i++){

                oProducto = { nombre:oObjetosSeleccionados[i].children[0].textContent,

                              precio:oObjetosSeleccionados[i].children[1].textContent,

                              stock:oObjetosSeleccionados[i].children[2].textContent,

                              personaje:oObjetosSeleccionados[i].children[3].textContent,

                              caracteristica:oObjetosSeleccionados[i].children[4].textContent

                }

                aCarrito.push(oProducto);

            }

              //  oCompras.push(oProducto);

              //  alert("Compra realizada");



                for(let x = 0; x<oObjetosSeleccionados.length;x++){

                    oObjetosSeleccionados[x].remove();

                }

                actualizaCookieCarrito();

                mostrarNavBar();

                alert("Producto/s añadido al carrito");

        }        

        // oUsuarioLogueado.compras = oCompras;

       

        }



    }



    function mostrarCarrito() {

    

        if(document.querySelector("#areaCarrito").querySelector("table"))

        document.querySelector("#areaCarrito").querySelector("table").remove();

    

        if(document.querySelector("#areaCarrito").querySelector(".h2"))

        document.querySelector("#areaCarrito").querySelector(".h2").remove();

    

        let precioTotal = 0;

        let oTabla = document.createElement("table");

        oTabla.classList.add("table");

        let oCabecera = oTabla.createTHead();

        let oLineaCabecera = oCabecera.insertRow();

    

        let oCeldaCabNombre = document.createElement("th");

        oCeldaCabNombre.textContent = "Nombre";

    

        let oCeldaCabPrecio = document.createElement("th");

        oCeldaCabPrecio.textContent = "Precio";

    

        let oCeldaCabStock = document.createElement("th");

        oCeldaCabStock.textContent = "Stock";

    

        let oCeldaCabPersonaje = document.createElement("th");

        oCeldaCabPersonaje.textContent = "Personaje";

    

        let oCeldaCabCaracteristica = document.createElement("th");

        oCeldaCabCaracteristica.textContent = "Característica";

        

        oLineaCabecera.appendChild(oCeldaCabNombre);

        oLineaCabecera.appendChild(oCeldaCabPrecio);

        oLineaCabecera.appendChild(oCeldaCabStock);

        oLineaCabecera.appendChild(oCeldaCabPersonaje);

        oLineaCabecera.appendChild(oCeldaCabCaracteristica);

    

        for(let producto of aCarrito) {

       

        let oLinea = oTabla.insertRow();

    

        let oCeldaNombre = oLinea.insertCell();

        oCeldaNombre.textContent = producto.nombre;

    

        let oCeldaPrecio = oLinea.insertCell();

        oCeldaPrecio.textContent = producto.precio;

        precioTotal = precioTotal + parseFloat(producto.precio);

    

        let oCeldaStock = oLinea.insertCell();

        oCeldaStock.textContent = producto.stock;

    

        let oCeldaPersonaje = oLinea.insertCell();

        oCeldaPersonaje.textContent = producto.personaje;

    

        let oCeldaCaracteristica = oLinea.insertCell();

        oCeldaCaracteristica.textContent = producto.caracteristica;

    

        }

    

        let oPiePrecio = oTabla.createTFoot();

        let oLineaPrecioT = oPiePrecio.insertRow();

        let oCeldaPieTexto = document.createElement("th");

        oCeldaPieTexto.textContent = "Precio Total";

        let oCeldaPieTotal = document.createElement("th");

        oCeldaPieTotal.textContent = precioTotal.toFixed(2);

    

        oLineaPrecioT.appendChild(oCeldaPieTexto);

        oLineaPrecioT.appendChild(oCeldaPieTotal);

        oCeldaPieTexto.setAttribute("colspan","4");

        

    

        if(oTabla.querySelectorAll("tr").length>2) {

        document.querySelector("#areaCarrito").appendChild(oTabla);

        crearBotonesCarrito();

        }

        else {

            let oMensaje = document.createElement("div");

            oMensaje.classList.add("h2");;

            oMensaje.textContent = "No hay productos en el carrito."

            document.querySelector("#areaCarrito").appendChild(oMensaje);

        }

        mostrarArea("areaCarrito");

        }

    

        function crearBotonesCarrito() {

            if(!document.querySelector("#areaCarrito").querySelector("#btnCarritoBorrar")) {

            let oBotonBorrar = document.createElement("button");

            oBotonBorrar.classList.add("btn");

            oBotonBorrar.classList.add("btn-primary");

            oBotonBorrar.classList.add("me-2");

            oBotonBorrar.setAttribute("id","btnCarritoBorrar");

            oBotonBorrar.textContent = "Borrar";

            document.querySelector("#areaCarrito").appendChild(oBotonBorrar);   

            oBotonBorrar.addEventListener("click",borrarDelCarrito,false);

            }

            else {

               let oBotonBorrar = document.querySelector("#areaCarrito").querySelector("#btnCarritoBorrar");

               document.querySelector("#areaCarrito").appendChild(oBotonBorrar);

            }

    

        if(!document.querySelector("#btnCarritoPagar")) {

            let oBotonPagar = document.createElement("button");

            oBotonPagar.classList.add("btn");

            oBotonPagar.classList.add("btn-primary");

            oBotonPagar.classList.add("ms-2");

            oBotonPagar.setAttribute("id","btnCarritoPagar");

            oBotonPagar.textContent = "Pagar";

            document.querySelector("#areaCarrito").appendChild(oBotonPagar);

            oBotonPagar.addEventListener("click",pagarCarrito,false);   

            }

            else {

                let oBotonPagar = document.querySelector("#areaCarrito").querySelector("#btnCarritoPagar");

                document.querySelector("#areaCarrito").appendChild(oBotonPagar);

             }

        }



function borrarDelCarrito() {

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FALTA POR HACER: Usad algo parecido a lo que hizo Paco en el listado de productos para seleccionar

}



function pagarCarrito() {

alert("Compra realizada");

aCarrito = [];

document.querySelector("#btnCarritoPagar").remove();

document.querySelector("#btnCarritoBorrar").remove();

mostrarCarrito();

}







function cargarTablaProductosAdmin()

{





let oTablaDesplegada = document.querySelector("#areaProductosAdmin table");

    if(oTablaDesplegada != null)

    {

        oTablaDesplegada.remove();

    }



    let oMunecos = oXMLAdmin.querySelectorAll("muneco producto");

    let oVaritas = oXMLAdmin.querySelectorAll("varita producto");



    //crear tabla//

    let oTabla = document.createElement("TABLE");

    oTabla.classList.add("table");

    oTabla.classList.add("table-striped");

    oTabla.classList.add("table-hover");



    //crear encabezado/7

    let oTHead = oTabla.createTHead();



    //crear fila//

    let oFila = oTHead.insertRow(-1);



    //crear celdas//

    let oCelda = document.createElement("TH");

    oCelda.textContent = "Nombre";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Precio";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Stock";

    oFila.appendChild(oCelda);





    oCelda = document.createElement("TH");

    oCelda.textContent = "Personaje";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Caracteristica";

    oFila.appendChild(oCelda);



    //cuerpo de la Tabla//

    let oTBody = document.createElement("TBODY");

    for(let i = 0; i< oMunecos.length; i++)

    {

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "muneco";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;

    }



    for(let i = 0; i< oVaritas.length; i++)

    {

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "varita";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("material").textContent;

    }

    

    // Agregar el cuerpo a la tablaa

    oTabla.appendChild(oTBody);



   /// document.getElementById("areaProductosAdmin").appendChild(oTabla);

return oTabla;



}





function seleccionarProductoAdmin(oEvento)

{

    let oE = oEvento || window.event;



    if(oE.target.nodeName == "TD"){

        oE.target.parentElement.classList.toggle("seleccionado");

    }

}



function cargarTablaListarProductos()

{

    let oAreaListadoProductosAdmin = document.querySelector("#areaListadoProductosAdmin table");



    if(oAreaListadoProductosAdmin != null)

    {

        oAreaListadoProductosAdmin.remove();

    }



    let oTablaDesplegada = cargarTablaProductosAdmin();

    

    oAreaListadoProductosAdmin = document.querySelector("#areaListadoProductosAdmin");

    

    oAreaListadoProductosAdmin.appendChild(oTablaDesplegada);

}

"use strict";

mostrarArea("areaHome");   

var tienda = new Tienda;

var oUsuarioLogueado = null;

var aCarrito = [];

datosIniciales();

let oXML = loadXMLDoc("productos.xml");

let oXMLAdmin = loadXMLDoc("productos.xml");

mostrarNavBar();







//Añadimos los manejadores de eventos

document.querySelector("#navHome").addEventListener("click",function() {mostrarArea("areaHome");},false);

document.querySelector("#navProducto").addEventListener("click",function() {mostrarArea("areaProductos");},false);

document.querySelector("#navProductoLogueado").addEventListener("click",function() {mostrarArea("areaProductos");},false);

document.querySelector("#navIniciarSesion").addEventListener("click",function() {mostrarArea("areaIniciarSesion");},false);

document.querySelector("#navRegistro").addEventListener("click",function() {mostrarArea("areaRegistro");},false);

frmRegistroUsuario.botonAceptarRegistroUsuario.addEventListener("click",registroUsuario,false);

frmInicioSesion.botonAceptarInicioSesion.addEventListener("click",inicarSesion,false);

frmInicioSesion.botonAceptarInicioSesion.addEventListener("click", recuperarCookiesCarrito(),false);

document.querySelector("#navPerfilLogueado").addEventListener("click",contruyePerfil,false);   // **!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!

document.querySelector("#navCerrarSesionLogueado").addEventListener("click",function(){desloguear(),false})

document.querySelector("#navCerrarSesionAdmin").addEventListener("click",function(){desloguear(),false})



document.getElementById("navProducto").addEventListener("click", cargarTabla);

document.getElementById("botonFiltrar").addEventListener("click", filtrarTabla);

document.getElementById("areaProductos").addEventListener("click", seleccionarProducto);

document.getElementById("botonLimpiarSeleccionados").addEventListener("click", limpiarSeleccionados);

document.getElementById("botonComprarSeleccionados").addEventListener("click", comprarProductosSeleccionados);

document.querySelector("#navProductoLogueado").addEventListener("click",cargarTabla,false);

document.querySelector("#navProductoAdmin").addEventListener("click",function() {mostrarArea("areaListadoProductosAdmin");},false);

document.querySelector("#navCarrito").addEventListener("click",mostrarCarrito,false);

cargarTablaListarProductos();



//Fin manejadores de eventos



function datosIniciales()

{

    tienda.altaNuevoCliente("admin Rodríguez","admin@hotmail.com","00000000A","calle La Parra 0",true,"admin000");

    tienda.altaNuevoCliente("Cliente1","cliente1@hotmail.com","11111111B","calle La Parra 1",false,"kakakaka");

    tienda.altaNuevoCliente("Cliente2","cliente2@hotmail.com","22222222C","calle La Parra 2",true,"kakakaka");

    tienda.altaNuevoCliente("Cliente3","cliente3@hotmail.com","33333333D","calle La Parra 3",true,"kakakaka");

    tienda.altaNuevoCliente("Cliente4","cliente4@hotmail.com","44444444E","calle La Parra 4",false,"kakakaka");

}



function mostrarArea(areaVisible) {

    ocultarTodo();

    document.getElementById(areaVisible).style.display = "block"

}



function ocultarTodo(){

    for(let area of document.getElementsByClassName("areaContenido")){

        area.style.display = "none";

    }

    document.querySelector("#mensaje").style.display = "none";

}



function ocultarNavBar() {

   let listaNavs = document.getElementById("containerNavs").querySelectorAll(".row");

   for(let barra of listaNavs) {

       barra.style.display = "none";

   }

}



function mostrarNavBar() {     // CÓDIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



    ocultarNavBar();



    if(!oUsuarioLogueado) 

        document.querySelector("#navBarNoLogueado").style.display = "flex";

    

    else {



        if(document.querySelector("#navNombre"))

            document.querySelector("#navNombre").remove();



        let oTexto = document.createElement("a");

        oTexto.classList.add("nav-link");

        oTexto.style.cursor = "default";

        oTexto.style.userSelect = "none";

        oTexto.setAttribute("id","navNombre");



        if(oUsuarioLogueado.Correo=="admin@hotmail.com") {   

            oTexto.textContent = "ADMIN";

            document.querySelector("#navCerrarSesionAdmin").before(oTexto);

            document.querySelector("#navBarAdmin").style.display = "flex";

        }

         else {

            oTexto.textContent = oUsuarioLogueado.Nombre;

            document.querySelector("#navPerfilLogueado").before(oTexto); 

            document.querySelector("#navBarLogueado").style.display = "flex";

            document.querySelector("#navCarrito").textContent = "Carrito("+ aCarrito.length +")";

        }

    }

}



function validarDatos() {   //**!!!!!!!!!!!!!!!!!!!!!CÓDIGO NUEVO HE HECHO VALIDAR DATOS, EL AREA DE PERFIL, EL EVENT LISTENER DEL BOTON DE PERFIL (deja de funcionar \r\n)

    let bTodoOk = true;

    let bPrimerErrorEncontrado = false;

    let sMensajeError = "";



    //email

    let oAreaMail = frmRegistroUsuario.txtEmail;

    let sMail = oAreaMail.value.trim();

    let oExp =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;





    if(!oExp.test(sMail)) {

        bTodoOk = false;

        oAreaMail.classList.add("error");

        sMensajeError += "\r\n -El e-mail no tiene un formato correcto.";



        if(!bPrimerErrorEncontrado) {

            bPrimerErrorEncontrado = true;

            oAreaMail.focus();

        }



    }

    else if(!oUsuarioLogueado){

        let bExiste = tienda.buscarCliente(sMail);



        if(bExiste) {

            bTodoOk = false;

            oAreaMail.classList.add("error");

            sMensajeError += "\r\n -Ese usuario ya existe.";

    

            if(!bPrimerErrorEncontrado) {

                bPrimerErrorEncontrado = true;

                oAreaMail.focus();

            }

        }

        else {

        oAreaMail.classList.remove("error");

        }

    }



//confirmacion email 

if(!oUsuarioLogueado) {

let oAreaMail2 = frmRegistroUsuario.txtEmail2;

let sMail2 = oAreaMail2.value.trim();



if(!oAreaMail.classList.contains("error") && sMail2 != sMail ) {

    bTodoOk = false;

    oAreaMail2.classList.add("error");

    sMensajeError += "\r\n -El e-mail y su confirmación no coinciden.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaMail2.focus();

    }

}

else {

    oAreaMail2.classList.remove("error");

}

}



//contraseña

let oAreaPass = frmRegistroUsuario.txtPassword;

let sPass = oAreaPass.value.trim();

oExp = /^[a-zA-Z0-9]{8,}$/;



if(!oExp.test(sPass)) {

    bTodoOk = false;

    oAreaPass.classList.add("error");

    sMensajeError += "\r\n -La contraseña debe estar compuesta por números y/o letras y tener al menos 8 caracteres.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaPass.focus();

    }

}

else {

    oAreaPass.classList.remove("error");

}



//confirmación contraseña



let oAreaPass2 = frmRegistroUsuario.txtPassword2;

let sPass2 = oAreaPass2.value.trim();



if(!oAreaPass.classList.contains("error") && sPass2 != sPass) {

    bTodoOk = false;

    oAreaPass2.classList.add("error");

    sMensajeError += "\r\n -El password y su confirmación no coinciden.";



    if(!bPrimerErrorEncontrado) {

    bPrimerErrorEncontrado = true;

    oAreaPass2.focus();

    }

}

else {

    oAreaPass2.classList.remove("error");

}



//Nombre

let oAreaNombre = frmRegistroUsuario.txtNombreUsuario;

let sNombre = oAreaNombre.value.trim();

oExp = /^[a-zA-Z0-9\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]{5,15}$/;



if(!oExp.test(sNombre)) {

    bTodoOk = false;

    oAreaNombre.classList.add("error");

    sMensajeError += "\r -El nombre debe tener entre 5 y 15 caracteres.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaNombre.focus();

    }

}

else {

    oAreaNombre.classList.remove("error");

}



//Dni



let oAreaDni = frmRegistroUsuario.txtDni;

let sDni = oAreaDni.value.trim();

oExp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;



if(!oExp.test(sDni)) {

    bTodoOk = false;

    oAreaDni.classList.add("error");

    sMensajeError += "\r\n -Debe introducir un DNI válido.";



    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaDni.focus();

    }

}

else {

    oAreaDni.classList.remove("error");

}



//Direccion

let oAreaDireccion = frmRegistroUsuario.txtDireccion;

let sDireccion = oAreaDireccion.value.trim();



if(sDireccion == "") {

    bTodoOk = false;

    oAreaDireccion.classList.add("error");

    sMensajeError += "\r\n -Debe introducir una dirección.";

    if(!bPrimerErrorEncontrado) {

        bPrimerErrorEncontrado = true;

        oAreaDireccion.focus();

    } 

}

else {

    oAreaDireccion.classList.remove("error");

}



if(!bTodoOk)

mensaje(sMensajeError);



return bTodoOk;

}



function registroUsuario() { //****************************************************!CÓDIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*************************



if(validarDatos()){



    let sMail = frmRegistroUsuario.txtEmail.value;

    let sPass = frmRegistroUsuario.txtPassword.value;

    let sNombre = frmRegistroUsuario.txtNombreUsuario.value;

    let sDni = frmRegistroUsuario.txtDni.value;

    let sDireccion = frmRegistroUsuario.txtDireccion.value;

    

    let sTipoSus = frmRegistroUsuario.radioSuscripcion.value;

    let bTipoSus;

    

    if(sTipoSus == "premium")

    bTipoSus = true;

    else

    bTipoSus = false;



    tienda.altaNuevoCliente(sNombre,sMail,sDni,sDireccion,bTipoSus,sPass)

    mensaje("Usuario registrado correctamente. ¡Bienvenido/a!");   

}



}



function inicarSesion()

{

    let bCorrecto = true;

    let bErrores = false;

    let sMensajeError = "";

    let oUsuarioTemporal;



    let oAreaMail = frmInicioSesion.txtEmailInicio;

    let sMail = oAreaMail.value.trim();

    let oExp =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;





    if(!oExp.test(sMail)) 

    {

        bCorrecto = false;

        oAreaMail.classList.add("error");

        sMensajeError += "\r\n -Introduzca el Email correctamente.";



        if(!bErrores) 

        {

            bErrores = true;

            oAreaMail.focus();

        }

    }



    else 

    {

       //le quitamos la clase error

        oAreaMail.classList.remove("error");

        oUsuarioTemporal = tienda.buscarCliente(sMail);



        if(!oUsuarioTemporal) 

        {

            bCorrecto = false;

            oAreaMail.classList.add("error");

            sMensajeError += "\r\n Ese usuario no existe.";

    

            if(!bErrores) 

            {

                bErrores = true;

                oAreaMail.focus();

            }

        }



        else 

        {

            oAreaMail.classList.remove("error");

        }

    }



    let oAreaPass = frmInicioSesion.txtPasswordInicio;

    let sPass = oAreaPass.value;



    if(oUsuarioTemporal){

        if(sPass != oUsuarioTemporal.password) 

        {

            bCorrecto = false;

            oAreaPass.classList.add("error");

            sMensajeError += "\r\n -Contraseña incorrecta.";



            if(!bErrores) 

            {

                bErrores = true;

                oAreaPass.focus();

            }

        }

            

            else 

            {

                oAreaPass.classList.remove("error");

            }

    }



        if(bCorrecto)

        {

            sMensajeError = "\r\n Inicio de Sesión Correctamente"; // PEQUEÑAS MODIFICACIONES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            oUsuarioLogueado = oUsuarioTemporal;   

            mostrarNavBar();

            mostrarArea("areaHome");

            

            //Si se desea mantener la sesion iniciada el usuario entra en una cookie

            if( document.querySelector('#checkboxMantenerSesion').checked )

            {

                guardaUsuarioLogueado(oUsuarioLogueado);

            }

        }

        mensaje(sMensajeError);   

       



}



function desloguear() {

    oUsuarioLogueado = null;

    deleteCookie("usuarioLogueado");

    location.reload();     // PEQUEÑAS MODIFICACIONES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

}





function mensaje(cadena) {

let oMensaje = document.querySelector("#mensaje");

oMensaje.textContent = cadena;

oMensaje.style.display = "block";

}



function contruyePerfil() {    // Construye el área de perfil usuario !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    mostrarArea("areaRegistro");

    let oCabecera = document.querySelector("#areaRegistro").querySelector(".cabecera");

    oCabecera.textContent = "Perfil de "+oUsuarioLogueado.Nombre; 

        if(!document.querySelector("[name=botonModificarUsuario]")) {

            let botonModificar = document.createElement("INPUT");

            botonModificar.setAttribute("name","botonModificarUsuario");

            botonModificar.setAttribute("type","button");

            botonModificar.classList.add("btn","btn-primary","w-25");

            botonModificar.setAttribute("value","Actualizar");

    

            let botonBorrable = document.querySelector("[name = botonAceptarRegistroUsuario]");

            botonBorrable.before(botonModificar);

            botonBorrable.style.display = "none";

    

            cargarDatosPerfil();

            frmRegistroUsuario.querySelector("#areaConfirmaMail").remove();

            frmRegistroUsuario.txtEmail.setAttribute("disabled","true");

            botonModificar.addEventListener("click",modificarDatos,"false");

            botonModificar.setAttribute("disabled","true");

        }

    

    }

    

    function cargarDatosPerfil() {   // Construye el área de perfil usuario !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        

        frmRegistroUsuario.txtEmail.value = oUsuarioLogueado.Correo;

        frmRegistroUsuario.txtEmail2.value = oUsuarioLogueado.Correo;

        frmRegistroUsuario.txtPassword.value = oUsuarioLogueado.password;

        //frmRegistroUsuario.txtPassword2.value = oUsuarioLogueado.password;

        frmRegistroUsuario.txtNombreUsuario.value = oUsuarioLogueado.Nombre;

        frmRegistroUsuario.txtDni.value = oUsuarioLogueado.Dni;

        frmRegistroUsuario.txtDireccion.value = oUsuarioLogueado.Direccion;

    

        let oInputs = frmRegistroUsuario.querySelectorAll("input");

        

        for(let i=0;i<oInputs.length;i++){

            oInputs[i].addEventListener("input",habilitarBtnModificar,false);

        }

        

    }

    

    function habilitarBtnModificar() { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO

        document.querySelector("[name = botonModificarUsuario]").removeAttribute("disabled");

    }

    

    function modificarDatos() { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CODIGO NUEVO

        if(validarDatos()) {

            let sPassConfirmación = prompt("Para actualizar introduzca su contraseña actual");

         if (sPassConfirmación == sPassConfirmación) {

         oUsuarioLogueado.Correo = frmRegistroUsuario.txtEmail.value;

         oUsuarioLogueado.password = frmRegistroUsuario.txtPassword.value;

         oUsuarioLogueado.Nombre = frmRegistroUsuario.txtNombreUsuario.value;

         oUsuarioLogueado.Dni = frmRegistroUsuario.txtDni.value;

         oUsuarioLogueado.Direccion = frmRegistroUsuario.txtDireccion.value;

         let sTipoSus = frmRegistroUsuario.radioSuscripcion.value;

         let bTipoSus;

         

         if(sTipoSus == "premium")

         bTipoSus = true;

         else

         bTipoSus = false;

     

         oUsuarioLogueado.tipoSuscripcion = bTipoSus;

         mostrarNavBar();

         mensaje("Perfil actualizado correctamente.");

     } 

     else {

         mensaje("Contraseña incorrecta.");

     }

        }

     }



//Para recuperar el carrito del usuario --------------------- Se puede mejorar para que sea para un usuario en específico

function recuperarCookiesCarrito()

{

    let sCookieCarrito = getCookie("carrito");

    if (sCookieCarrito.lenght > 0)

    {

        cookieCarrito = JSON.parse(sCookieCarrito);

        for (producto of cookieCarrito)

        {

            aCarrito.push(producto);

        }

    }

}



//Actualizar la cookie del carrito cada vez que se añada o elimine un producto del carrito

function actualizaCookieCarrito(aCarrito)

{

    let sCarrito = JSON.stringify(aCarrito);

    setCookie("carrito",sCarrito,30);

}







//Para guardar en cookie el usuario logueado 

function guardaUsuarioLogueado(oUsuarioTemporal)

{

    let sUsuarioTemporal = JSON.stringify(oUsuarioTemporal);

    setCookie("usuarioLogueado",sUsuarioTemporal,30);

}



//Si hay cookie de un usuario para mantener la sesion iniciada ---------------------------- ¿HAY QUE COMPLETARLO CON QUE INICIE SESION SOLO?

function iniciarSesionUsuarioLogueado()

{

    let usuarioRegistradoEmail;

    let cookieUsuarioLogueado = getCookie("usuarioLogueado");

    if (cookieUsuarioLogueado.length > 0)

    {

        //CAMBIAR PARA QUE INICIE SESION AUTOMATICAMENTE





        //Creo el objeto del usuarioLogueado con indices 'email' y 'password'

        let oUsuarioInicioSesion = JSON.parse(cookieUsuarioLogueado);



        //Busco si hay un usuario con ese mismo email y lo saco a una variable

        usuarioRegistradoEmail = tienda.buscarCliente(oUsuarioInicioSesion["Correo"]);



        //Lo comparo para ver si existe el usuario en el registro de usuario

        if (usuarioRegistradoEmail.password == oUsuarioInicioSesion["password"])

        {

            //Usuario se inicia    --------------------   Cuando sepamos como iniciar los usuarios

            alert(oUsuarioInicioSesion);

        }

    }

}



//Cargar Tabla de Productos

function cargarTabla(){

    mostrarArea("areaProductos");

    

    let oTablaDesplegada = document.querySelector("#areaProductos table");

    if(oTablaDesplegada != null){

        oTablaDesplegada.remove();

    }



    let oMunecos = oXML.querySelectorAll("muneco producto");

    let oVaritas = oXML.querySelectorAll("varita producto");



    // Crear Tabla

    let oTabla = document.createElement("TABLE");

    oTabla.classList.add("table");

    oTabla.classList.add("table-striped");

    oTabla.classList.add("table-hover");



    // Crear Encabezado

    let oTHead = oTabla.createTHead();



    // Crear Fila 

    let oFila = oTHead.insertRow(-1);



    // Crear Celdas

    let oCelda = document.createElement("TH");

    oCelda.textContent = "Nombre";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Precio";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Stock";

    oFila.appendChild(oCelda);





    oCelda = document.createElement("TH");

    oCelda.textContent = "Personaje";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Caracteristica";

    oFila.appendChild(oCelda);



    // Crear Cuerpo de la Tabla

    let oTBody = document.createElement("TBODY");

    for(let i = 0; i< oMunecos.length; i++){

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "muneco";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;

    }



    for(let i = 0; i< oVaritas.length; i++){

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "varita";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("material").textContent;

    }

    

    // Agregar el cuerpo a la tablaa

    oTabla.appendChild(oTBody);



    document.getElementById("areaProductos").appendChild(oTabla);

    

}



function filtrarTabla(){

    cargarTabla();

    let iValor = parseFloat(frmTablasProductos.txtPrecio.value.trim());

    let bAscendente = frmTablasProductos.radioPrecio_0.checked;

    let bDescendente = frmTablasProductos.radioPrecio_1.checked;

    

    let bTodos = frmTablasProductos.radioTipo_0.checked;

    let bMunecos = frmTablasProductos.radioTipo_1.checked;

    let bVaritas = frmTablasProductos.radioTipo_2.checked;



    let oObjetosFiltradosTipo = [];

    let oObjetosEliminar = [];



    let oTabla = document.querySelector("#areaProductos table");

    let iNumeroRegistros = oTabla.children[1].children.length;



    //document.querySelector("#areaProductos table").children[1].children[4].children[1]



    if(iValor >0){

        if(bTodos){

            if(bAscendente){

                for(let i = 0; i< iNumeroRegistros;i++){

                    if(parseFloat(oTabla.children[1].children[i].children[1].textContent) < iValor){

                        oObjetosEliminar.push(oTabla.children[1].children[i]);

                    }

                }

            } 

            

            if(bDescendente){

                for(let i = 0; i< iNumeroRegistros;i++){

                    if(parseFloat(oTabla.children[1].children[i].children[1].textContent) > iValor){

                        oObjetosEliminar.push(oTabla.children[1].children[i]);

                    }

                }

            }

    

            for(let x = 0; x < oObjetosEliminar.length; x++){

                oObjetosEliminar[x].remove();

            } 

            

        } else if(bMunecos){

            for(let i = 0; i< iNumeroRegistros; i++){

            if(oTabla.children[1].children[i].dataset.tipo == "muneco"){

                oObjetosFiltradosTipo.push(oTabla.children[1].children[i]);

                }

            }

    

            oTabla.children[1].remove();

    

            let oTBody = document.createElement("TBODY");

            let oMunecos = oXML.querySelectorAll("muneco producto");

    

            if(bAscendente){

            for(let i = 0; i< oMunecos.length; i++){

                if(parseFloat(oMunecos[i].querySelector("precio").textContent) > iValor){

                let oFila = oTBody.insertRow(-1);

                oFila.dataset.tipo = "muneco";

                let oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("precio").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("stock").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;

        

                oCelda = oFila.insertCell(-1);

                oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;                

                }

                

            }

    

            // Agregar el cuerpo a la tablaa

            oTabla.appendChild(oTBody);

        

            document.getElementById("areaProductos").appendChild(oTabla);

    

            } else {

                for(let i = 0; i< oMunecos.length; i++){

                    if(parseFloat(oMunecos[i].querySelector("precio").textContent) < iValor){

                    let oFila = oTBody.insertRow(-1);

                    oFila.dataset.tipo = "muneco";

                    let oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("precio").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("stock").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;                

                    }

                    

                }

        

                // Agregar el cuerpo a la tablaa

                oTabla.appendChild(oTBody);

            

                document.getElementById("areaProductos").appendChild(oTabla);  

            }

    

            } else {

                for(let i = 0; i< iNumeroRegistros; i++){

                if(oTabla.children[1].children[i].dataset.tipo == "varita"){

                    oObjetosFiltradosTipo.push(oTabla.children[1].children[i]);

                    }

                }        

        

                oTabla.children[1].remove();        

        

                let oTBody = document.createElement("TBODY");

                let oVaritas = oXML.querySelectorAll("varita producto");

        

                if(bAscendente){

                for(let i = 0; i< oVaritas.length; i++){

                    if(parseFloat(oVaritas[i].querySelector("precio").textContent) > iValor){

                    let oFila = oTBody.insertRow(-1);

                    oFila.dataset.tipo = "varita";

                    let oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("precio").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("stock").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;

            

                    oCelda = oFila.insertCell(-1);

                    oCelda.textContent = oVaritas[i].querySelector("material").textContent;                

                    }

                    

                }

        

                // Agregar el cuerpo a la tablaa

                oTabla.appendChild(oTBody);

            

                document.getElementById("areaProductos").appendChild(oTabla);

        

                } else {

                    for(let i = 0; i< oVaritas.length; i++){

                        if(parseFloat(oVaritas[i].querySelector("precio").textContent) < iValor){

                        let oFila = oTBody.insertRow(-1);

                        oFila.dataset.tipo = "varita";

                        let oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("precio").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("stock").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;

                

                        oCelda = oFila.insertCell(-1);

                        oCelda.textContent = oVaritas[i].querySelector("material").textContent;                

                        }

                        

                    }

            

                    // Agregar el cuerpo a la tablaa

                    oTabla.appendChild(oTBody);

                

                    document.getElementById("areaProductos").appendChild(oTabla);  

                }

            }

    }

    

}



function seleccionarProducto(oEvento){

    let oE = oEvento || window.event;



    if(oE.target.nodeName == "TD"){

        oE.target.parentElement.classList.toggle("seleccionado");

    }

}



function limpiarSeleccionados(){

    let oFilasSeleccionados = document.querySelectorAll(".seleccionado");



    for(let i = 0; i<oFilasSeleccionados.length; i++){

        oFilasSeleccionados[i].classList.toggle("seleccionado");

    }



}



//Devuelve un objeto oTabla con la tabla de listar usuarios pintada en su interior

function pintaTablaListarUsuarios()

{

    //Creo la tabla con bordes

    let oTabla = document.createElement("TABLE");

    oTabla.setAttribute("border","1");



    //Recorro la tabla de los clientes insertando los datos en el "body" de la tabla

    for(let cliente of tienda.arrClientes)

    {

        let usuario = cliente;

        let oFila = oTabla.insertRow();



        let sDato = usuario.Nombre;

        let oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.Correo;

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.Dni;

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.Direccion;

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDato;



        sDato = usuario.tipoSuscripcion;



        let sDatoTabla;

        if(sDato)

            sDatoTabla = "Premium";

        else

            sDatoTabla = "Standard";

        oDivTabla = oFila.insertCell();

        oDivTabla.textContent = sDatoTabla;

        

    }



    //Pinto el Encabezado de la tabla

    let oEncabezado = oTabla.createTHead();

    let oFilaEncabezado = oEncabezado.insertRow();



    let oDivNombre = document.createElement("TH");

    oDivNombre.textContent = "Nombre";

    oFilaEncabezado.appendChild(oDivNombre);



    let oDivCorreo = document.createElement("TH");

    oDivCorreo.textContent = "Correo";

    oFilaEncabezado.appendChild(oDivCorreo);

    

    let oDivDNI = document.createElement("TH");

    oDivDNI.textContent = "DNI";

    oFilaEncabezado.appendChild(oDivDNI);



    let oDivDireccion = document.createElement("TH");

    oDivDireccion.textContent = "Direccion";

    oFilaEncabezado.appendChild(oDivDireccion);



    let oDivTipoSubscripcion = document.createElement("TH");

    oDivTipoSubscripcion.textContent = "Tipo de Subscripción";

    oFilaEncabezado.appendChild(oDivTipoSubscripcion);

    

    return oTabla;

}



function comprarProductosSeleccionados(){

    let oObjetosSeleccionados = document.querySelectorAll(".seleccionado");

    // let oCompras = [];

    let oProducto;



    if(oUsuarioLogueado == null){

        alert("Debe iniciar sesión para poder comprar");

    } else {

        if(oObjetosSeleccionados.length == 0){

            alert("Debe seleccionar productos primero");

        } else {

            for(let i=0;i<oObjetosSeleccionados.length;i++){

                oProducto = { nombre:oObjetosSeleccionados[i].children[0].textContent,

                              precio:oObjetosSeleccionados[i].children[1].textContent,

                              stock:oObjetosSeleccionados[i].children[2].textContent,

                              personaje:oObjetosSeleccionados[i].children[3].textContent,

                              caracteristica:oObjetosSeleccionados[i].children[4].textContent

                }

                aCarrito.push(oProducto);

            }

              //  oCompras.push(oProducto);

              //  alert("Compra realizada");



                for(let x = 0; x<oObjetosSeleccionados.length;x++){

                    oObjetosSeleccionados[x].remove();

                }

                actualizaCookieCarrito();

                mostrarNavBar();

                alert("Producto/s añadido al carrito");

        }        

        // oUsuarioLogueado.compras = oCompras;

       

        }



    }



    function mostrarCarrito() {

    

        if(document.querySelector("#areaCarrito").querySelector("table"))

        document.querySelector("#areaCarrito").querySelector("table").remove();

    

        if(document.querySelector("#areaCarrito").querySelector(".h2"))

        document.querySelector("#areaCarrito").querySelector(".h2").remove();

    

        let precioTotal = 0;

        let oTabla = document.createElement("table");

        oTabla.classList.add("table");

        let oCabecera = oTabla.createTHead();

        let oLineaCabecera = oCabecera.insertRow();

    

        let oCeldaCabNombre = document.createElement("th");

        oCeldaCabNombre.textContent = "Nombre";

    

        let oCeldaCabPrecio = document.createElement("th");

        oCeldaCabPrecio.textContent = "Precio";

    

        let oCeldaCabStock = document.createElement("th");

        oCeldaCabStock.textContent = "Stock";

    

        let oCeldaCabPersonaje = document.createElement("th");

        oCeldaCabPersonaje.textContent = "Personaje";

    

        let oCeldaCabCaracteristica = document.createElement("th");

        oCeldaCabCaracteristica.textContent = "Característica";

        

        oLineaCabecera.appendChild(oCeldaCabNombre);

        oLineaCabecera.appendChild(oCeldaCabPrecio);

        oLineaCabecera.appendChild(oCeldaCabStock);

        oLineaCabecera.appendChild(oCeldaCabPersonaje);

        oLineaCabecera.appendChild(oCeldaCabCaracteristica);

    

        for(let producto of aCarrito) {

       

        let oLinea = oTabla.insertRow();

    

        let oCeldaNombre = oLinea.insertCell();

        oCeldaNombre.textContent = producto.nombre;

    

        let oCeldaPrecio = oLinea.insertCell();

        oCeldaPrecio.textContent = producto.precio;

        precioTotal = precioTotal + parseFloat(producto.precio);

    

        let oCeldaStock = oLinea.insertCell();

        oCeldaStock.textContent = producto.stock;

    

        let oCeldaPersonaje = oLinea.insertCell();

        oCeldaPersonaje.textContent = producto.personaje;

    

        let oCeldaCaracteristica = oLinea.insertCell();

        oCeldaCaracteristica.textContent = producto.caracteristica;

    

        }

    

        let oPiePrecio = oTabla.createTFoot();

        let oLineaPrecioT = oPiePrecio.insertRow();

        let oCeldaPieTexto = document.createElement("th");

        oCeldaPieTexto.textContent = "Precio Total";

        let oCeldaPieTotal = document.createElement("th");

        oCeldaPieTotal.textContent = precioTotal.toFixed(2);

    

        oLineaPrecioT.appendChild(oCeldaPieTexto);

        oLineaPrecioT.appendChild(oCeldaPieTotal);

        oCeldaPieTexto.setAttribute("colspan","4");

        

    

        if(oTabla.querySelectorAll("tr").length>2) {

        document.querySelector("#areaCarrito").appendChild(oTabla);

        crearBotonesCarrito();

        }

        else {

            let oMensaje = document.createElement("div");

            oMensaje.classList.add("h2");;

            oMensaje.textContent = "No hay productos en el carrito."

            document.querySelector("#areaCarrito").appendChild(oMensaje);

        }

        mostrarArea("areaCarrito");

        }

    

        function crearBotonesCarrito() {

            if(!document.querySelector("#areaCarrito").querySelector("#btnCarritoBorrar")) {

            let oBotonBorrar = document.createElement("button");

            oBotonBorrar.classList.add("btn");

            oBotonBorrar.classList.add("btn-primary");

            oBotonBorrar.classList.add("me-2");

            oBotonBorrar.setAttribute("id","btnCarritoBorrar");

            oBotonBorrar.textContent = "Borrar";

            document.querySelector("#areaCarrito").appendChild(oBotonBorrar);   

            oBotonBorrar.addEventListener("click",borrarDelCarrito,false);

            }

            else {

               let oBotonBorrar = document.querySelector("#areaCarrito").querySelector("#btnCarritoBorrar");

               document.querySelector("#areaCarrito").appendChild(oBotonBorrar);

            }

    

        if(!document.querySelector("#btnCarritoPagar")) {

            let oBotonPagar = document.createElement("button");

            oBotonPagar.classList.add("btn");

            oBotonPagar.classList.add("btn-primary");

            oBotonPagar.classList.add("ms-2");

            oBotonPagar.setAttribute("id","btnCarritoPagar");

            oBotonPagar.textContent = "Pagar";

            document.querySelector("#areaCarrito").appendChild(oBotonPagar);

            oBotonPagar.addEventListener("click",pagarCarrito,false);   

            }

            else {

                let oBotonPagar = document.querySelector("#areaCarrito").querySelector("#btnCarritoPagar");

                document.querySelector("#areaCarrito").appendChild(oBotonPagar);

             }

        }



function borrarDelCarrito() {

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FALTA POR HACER: Usad algo parecido a lo que hizo Paco en el listado de productos para seleccionar

}



function pagarCarrito() {

alert("Compra realizada");

aCarrito = [];

document.querySelector("#btnCarritoPagar").remove();

document.querySelector("#btnCarritoBorrar").remove();

mostrarCarrito();

}







function cargarTablaProductosAdmin()

{





let oTablaDesplegada = document.querySelector("#areaProductosAdmin table");

    if(oTablaDesplegada != null)

    {

        oTablaDesplegada.remove();

    }



    let oMunecos = oXMLAdmin.querySelectorAll("muneco producto");

    let oVaritas = oXMLAdmin.querySelectorAll("varita producto");



    //crear tabla//

    let oTabla = document.createElement("TABLE");

    oTabla.classList.add("table");

    oTabla.classList.add("table-striped");

    oTabla.classList.add("table-hover");



    //crear encabezado/7

    let oTHead = oTabla.createTHead();



    //crear fila//

    let oFila = oTHead.insertRow(-1);



    //crear celdas//

    let oCelda = document.createElement("TH");

    oCelda.textContent = "Nombre";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Precio";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Stock";

    oFila.appendChild(oCelda);





    oCelda = document.createElement("TH");

    oCelda.textContent = "Personaje";

    oFila.appendChild(oCelda);



    oCelda = document.createElement("TH");

    oCelda.textContent = "Caracteristica";

    oFila.appendChild(oCelda);



    //cuerpo de la Tabla//

    let oTBody = document.createElement("TBODY");

    for(let i = 0; i< oMunecos.length; i++)

    {

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "muneco";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("personaje").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oMunecos[i].querySelector("tipo").textContent;

    }



    for(let i = 0; i< oVaritas.length; i++)

    {

        oFila = oTBody.insertRow(-1);

        oFila.dataset.tipo = "varita";

        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("nombre").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("precio").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("stock").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("propietario").textContent;



        oCelda = oFila.insertCell(-1);

        oCelda.textContent = oVaritas[i].querySelector("material").textContent;

    }

    

    // Agregar el cuerpo a la tablaa

    oTabla.appendChild(oTBody);



   /// document.getElementById("areaProductosAdmin").appendChild(oTabla);

return oTabla;



}





function seleccionarProductoAdmin(oEvento)

{

    let oE = oEvento || window.event;



    if(oE.target.nodeName == "TD"){

        oE.target.parentElement.classList.toggle("seleccionado");

    }

}



function cargarTablaListarProductos()

{

    let oAreaListadoProductosAdmin = document.querySelector("#areaListadoProductosAdmin table");



    if(oAreaListadoProductosAdmin != null)

    {

        oAreaListadoProductosAdmin.remove();

    }



    let oTablaDesplegada = cargarTablaProductosAdmin();

    

    oAreaListadoProductosAdmin = document.querySelector("#areaListadoProductosAdmin");

    

    oAreaListadoProductosAdmin.appendChild(oTablaDesplegada);

}


