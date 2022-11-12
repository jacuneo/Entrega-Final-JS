// Clase para crear objetos:

class Producto {
    constructor(id, nombre, precio, img) {
        this.id = id;
        this.nombre = nombre; 
        this.precio = precio;
        this.img = img;
        this.cantidad = 1;  // cada vez que creo un objeto siempre va a haber 1 unidad
    }
}

const chomba = new Producto(001, "Chomba", 9000, "/img/chomba_hombre_negro.png");
const hoodie = new Producto(002, "Hoodie", 10000, "/img/hoodie_hombre_negro.png");
const polera = new Producto(003, "Polera", 7000, "/img/polera_hombre_negro.png");
const remera = new Producto(004, "Remera", 4500, "/img/remera_hombre_negro.png");


// Array con el stock de productos  

const productos = [chomba, hoodie, polera, remera];

// Array con el carrito de compras

let carrito = []; // Se inicializa vacío porque inicialmente no hay ningun producto en la lista de compra.

// Carga del carrito desde el localStorage

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

/* Cargo  el array de productos de forma dinámica.
Modifico el DOM mostrando los productos en el div.contenedorProductos:  */

const contenedorProductos = document.getElementById("contenedorProductos");

/* Función mostrarProductos: va a iterar sobre el array de productos y va a ir pintando las cards en el div.contenedorProductos */

const mostrarProductos = () => {
    productos.forEach((producto) => {   // creo una card en cada iteración del loop
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
            </div>
        `

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

const agregarAlCarrito = (id) => {
    const producto = productos.find((producto) => producto.id === id);
    const productoEnCarrito = carrito.find((producto) => producto.id === id);
    
    productoEnCarrito ? productoEnCarrito.cantidad++ 
    : carrito.push(producto);
    localStorage.setItem("carrito",JSON.stringify(carrito));
    
    calcularTotal();
}

mostrarProductos();

//Para mostrar el carrito de compras: 

const contenedorCarrito = document.getElementById("contenedorCarrito");

const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
});

//Función para mostrar el carrito: 

const mostrarCarrito = () => {
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

//Función para eliminar todo el contenido del carrito: 

const eliminarTodoElCarrito = () => {
    carrito = []; // carrito es ahora un array vacío
    mostrarCarrito(); // me actualiza la vista de carrito para ver que el carrito está vacío

    //Limpio el localStorage: 
    localStorage.clear();
}

//Mensaje con monto total de la compra 

const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0; 
    carrito.forEach((producto) => {
        totalCompra += producto.precio * producto.cantidad;
    })

    total.innerHTML = ` $${totalCompra}`;
}