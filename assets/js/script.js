// Función para comprobar que solo se ingresen números y que esté en el rango
function comprobar(texto) {


    let eR = /[^0-9]/;
    if (eR.test(texto)) {
        return [false, "Ingresa solo números!"]
    } else if (!(0 < Number(texto) && Number(texto) < 733)) {
        return [false, "Ingresa un número desde 1 hasta 732!"];

    } else {
        return [true]
    }

}

// Función donde se agregan los datos al grafico, adicionalmente evalúa si no hay ningún dato que graficar
function creaGrafico(datos) {

    let grafico = {
        title: { text: "Estadisticas de poder para " + datos.name, },
        axisX: { title: "Powet Stats", titleFontSize: 12 },
        axisY: { title: "Nivel", titleFontSize: 12 },

        data: [  // es un arreglo objetos que contiene tipo grafico y datos a graficar
            {
                type: "pie",
                showInLegend: true,
                dataPoints: [],
            },
        ],
    };
    let contador = 0
    Object.entries(datos.powerstats).forEach(([llave, valor]) => {
        console.log(llave)
        if (valor == "null") {
            grafico.data[0].dataPoints.push({ label: llave.charAt(0).toUpperCase() + llave.slice(1) + " (0)", y: 0, name: llave.charAt(0).toUpperCase() + llave.slice(1) })
            contador += 1

        } else {

            grafico.data[0].dataPoints.push({ label: llave.charAt(0).toUpperCase() + llave.slice(1) + " (" + valor + ")", y: Number(valor), name: llave.charAt(0).toUpperCase() + llave.slice(1) })
        }
    })

    if (contador == 6) {
        return [false]
    } else {

        return [true, grafico];
    }


}


// Funciones para reemplazar 0 y - por sin datos en la tarjeta
function reemplazarGion(cadena) {

    let nuevaCadena = cadena.replace(/-(?!\s)/g, 'sin datos');
    return nuevaCadena;
}
function reemplazarCero(cadena) {

    var nuevaCadena = cadena.replace(/\b0\b/g, 'sin datos');
    return nuevaCadena;
}




// Esta función agrega los datos requeridos a la tarjeta
function datosCard(datosAPI) {
    let listaDatos = ["<p>Conecciones: " + datosAPI.connections['group-affiliation'] + "</p>",
    "<p>Publicado por: " + datosAPI.biography.publisher + "</p>",
    "<p>Ocupación: " + datosAPI.work.occupation + "</p>",
    "<p>Primera aparición: " + datosAPI.biography['first-appearance'] + "</p>",
    "<p>Altura: " + datosAPI.appearance.height.join(" / ") + "</p>",
    "<p>Peso: " + datosAPI.appearance.weight.join(" / ") + "</p>",
    "<p>Alianzas: " + datosAPI.biography.aliases.join(", ") + "</p>"
    ]
    let texto = listaDatos.join("<hr>")
    texto = reemplazarGion(texto)
    texto = reemplazarCero(texto)

    return texto


}



$(document).ready(function () {

    // Guardamos la ubicación del gráfico en una variable
    let ubicacion = $('#grafico');

    // Instrucciones que se realizarán cuando se clickee el botón
    $('#boton').click(function (e) {
        e.preventDefault()
        // Se captura el valor ingresado por el usuario
        let indiceBusqueda = $('#index').val();

        // Se comprueba que el valor ingresado cumpla con las condicione establecidas
        if (comprobar(indiceBusqueda)[0]) {
            // se hace la conección con la API si todo está en orden
            $.ajax({
                type: "GET",
                url: "https://www.superheroapi.com/api.php/4905856019427443/" + indiceBusqueda,
                dataType: "json",
                success: function (datos) {



                    // Información del la tarjeta
                    $('#imgSuper').attr('src', datos.image.url)
                    $('.card-title').html('Nombre: ' + datos.name)
                    $('#detalles').html(datosCard(datos))
                    // Mostrar tarjeta y texto de éxito
                    $('.card').removeClass('d-none');
                    $('#encontrado').removeClass('d-none');

                    // Aquí se evalúa que el id ingresado contenga al menos una PowerStat para graficar
                    if (creaGrafico(datos)[0]) {

                        ubicacion.CanvasJSChart(creaGrafico(datos)[1])
                    } else {
                        //Si no hay datos se muestra el mensaje
                        ubicacion.html('<p>Sin datos para graficar</p>')
                    }


                },
                error: function (error) {
                    alert("Error!")
                },
            });
        } else {

            alert(comprobar(indiceBusqueda)[1])

        }

    })

})