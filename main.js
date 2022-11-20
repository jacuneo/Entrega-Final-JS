// Array con el carrito de compras

let carrito = []; // Se inicializa vacío porque inicialmente no hay ningun producto en la lista de compra.

// Carga del carrito desde el localStorage

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

/* Modifico el DOM mostrando los productos en el div.contenedorProductos:  */

const contenedorProductos = document.getElementById("contenedorProductos");

/* Cargo  de productos consumiendo datos de un .JSON local. */
const catalogoTienda = "json/catalogo.json"; 

fetch(catalogoTienda)
    .then(res => res.json())
    .then((productos) => {
        mostrarProductos(productos);
    })
    
    .catch(error => console.log(error))
    .finally( () => console.log("Proceso Finalizado"))

/* Función mostrarProductos: va a iterar sobre el array de productos y va a ir pintando las cards en el div.contenedorProductos */

const mostrarProductos = async () => {
    const respuesta = await fetch(catalogoTienda);
    const productosJson = await respuesta.json();
    productosJson.forEach( producto => {   // creo una card en cada iteración del loop
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
            <div class="card">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                    <h4 class="card-title"> ${producto.nombre} </h4>
                    <p class="card-text"> ${producto.precio} </p>
                    <button class="btn colorBoton" id="boton${producto.id}"> Agregar al Carrito </button>  
                </div>
            </div> `

        //Se generó un id dinámico, diferente para cada card de cada producto. Esto es para vincular con futuros eventos (agregar, eliminar).

        contenedorProductos.appendChild(card);   

        //Agregar productos al carrito aprovechando el id dinámico: 
        const boton = document.getElementById(`boton${producto.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id)   // esta función se desarrolla en el bloque siguiente
        })
    })
}

//Función para agregar productos al carrito pero evitando la carga de productos repetidos: 

const agregarAlCarrito = async (id) => {
    const respuesta = await fetch(catalogoTienda);
    const productosJson = await respuesta.json();

    const producto = productosJson.find((producto) => producto.id === id);
    const productoEnCarrito = carrito.find((producto) => producto.id === id);
    
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push(producto);
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }
    calcularTotal();
}

//Para mostrar el carrito de compras: 

const contenedorCarrito = document.getElementById("contenedorCarrito");

const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
});

//Función para mostrar el carrito: 
const mostrarCarrito = async () => {
    const respuesta = await fetch(catalogoTienda);
    const productosJson = await respuesta.json();

    contenedorCarrito.innerHTML="";  // Las "" evitan que se estén duplicando las cards cada vez que hago click en ver carrito.
    carrito.forEach((producto) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="card">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                <h4 class="card-title"> ${producto.nombre} </h4>
                <p class="card-text"> ${producto.precio} </p>
                <p class="card-text"> ${producto.cantidad} </p>
                <button class="btn colorBoton" id="eliminar${producto.id}"> Eliminar Producto </button>
                </div>
            </div>
        `
        contenedorCarrito.appendChild(card);

        //Eliminar productos del carrito: 
        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);   // esta función se desarrolla en el bloque siguiente
        })
    })
    calcularTotal();
}

//Función para eliminar un producto del carrito por su id: 

const eliminarDelCarrito = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);
    
    mostrarCarrito();  // me actualiza la vista de carrito para ver que el producto se eliminó

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Vaciar el carrito de compras por completo: 

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})

// Función para eliminar todo el contenido del carrito: 

const eliminarTodoElCarrito = () => {
    carrito = []; // carrito es ahora un array vacío
    mostrarCarrito(); // me actualiza la vista de carrito para ver que el carrito está vacío

    //Limpio el localStorage: 
    localStorage.clear();
}

// Vaciar carrito - Uso la libreria sweet alert para mostrar que se vació el carrito.

const botonVaciar = document.getElementById("vaciarCarrito");
botonVaciar.addEventListener("click", () => {
    Swal.fire({
        title: "Listo! Se ha vaciado el carrito",
        text: 'Continúa agregando productos',
        icon: "warning",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
      })
});

//Mensaje con monto total de la compra 
const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0; 
    carrito.forEach((producto) => {
        totalCompra += producto.precio * producto.cantidad;
    })
    total.innerHTML = ` $${totalCompra}`;
}

//Finalizar compra -  Uso la libreria sweet alert para mostrar que finalizó el proceso de compra.

const botonFinalizar = document.getElementById("finalizarCompra");
botonFinalizar.addEventListener("click", () => {
    Swal.fire({
        title: "Listo! Finalizaste tu compra",
        text: 'Gracias por elegir nuestra tienda',
        icon: "success",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
      })
});