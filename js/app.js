const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacion = document.querySelector("#paginacion");

const registroPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;


document.addEventListener("DOMContentLoaded", ()=>{
    formulario.addEventListener("submit",ValidarFormulario);
})


function ValidarFormulario (e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value;
    if ( terminoBusqueda === "") {
        MostrarAlerta("Debes introducir un termino");
        return;
    }

    BuscarImagenes();
}

function MostrarAlerta (mensaje) {
    const AlertaExistente = document.querySelector(".bg-red-100");
    if(!AlertaExistente) {
        const texto = document.createElement("p");
        texto.classList.add("bg-red-100","border-red-400","text-red-700","px-4","py-3","rounded","max-w-lg","mx-auto","mt-6","text-center");
        texto.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(texto);
        setTimeout(() => {
            texto.remove();
        }, 2500);
    }
}

async function BuscarImagenes() {
    const termino = document.querySelector("#termino").value;
    const key = "23408739-48846ed7df75e6b0548444448";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;
    
    // fetch (url)
    //     .then (
    //         resultado => resultado.json()
    //     )
    //     .then (
    //         datos => {
    //             totalPaginas = CalcularPaginas(datos.totalHits);
    //             console.log(totalPaginas)
    //             MostrarImagenes(datos.hits)
    //         }
    //     )

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = CalcularPaginas(resultado.totalHits);
        console.log(totalPaginas)
        MostrarImagenes(resultado.hits)
     
    } catch (error) {
        console.log(error)
    }
}

//Generador 

function *Paginador (total) {
    for (let i=1; i<= total; i++) {
        yield i;
    }

}

function CalcularPaginas(total) {
    return parseInt(Math.ceil(total/registroPorPagina));
}

function LimpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function MostrarImagenes (imagenes) {
    LimpiarHTML();
    // console.log(imagenes);
    imagenes.forEach(imagen => {
        const {previewURL,likes,views,largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src = "${previewURL}"/>
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-ligth">Me gusta</span></p>
                        <p class="font-bold">${views} <span class="font-ligth">Veces vista</span></p>
                        <a href="${largeImageURL}" target="_blank">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>

        `;
    });

    //Limpiar Paginador

    while (paginacion.firstChild) {
        paginacion.removeChild(paginacion.firstChild);
    }

    ImprimirPaginador();
     
}

function ImprimirPaginador () {
    iterador = Paginador(totalPaginas)

    while (true) {
        const {done,value} = iterador.next();
        if (done) {
            return;
        }
        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add("siguiente","mx-auto","bg-yellow-400","px-4","py-1","mr-2","font-bold","mb-2","uppercase","rounded");
        boton.onclick = () => {
            paginaActual = value;
            BuscarImagenes();

        }
        paginacion.appendChild(boton);

    }
}