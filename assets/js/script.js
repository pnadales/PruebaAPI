
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

function reemplazarGion(cadena) {

    let nuevaCadena = cadena.replace(/-(?!\s)/g, 'sin datos');
    return nuevaCadena;
}
function reemplazarCero(cadena) {

    var nuevaCadena = cadena.replace(/\b0\b/g, 'sin datos');
    return nuevaCadena;
}
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


    let ubicacion = $('#grafico');
    $('#boton').click(function (e) {
        e.preventDefault()
        let indiceBusqueda = $('#index').val();

        if (comprobar(indiceBusqueda)[0]) {

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

                    // grafico
                    if (creaGrafico(datos)[0]) {

                        ubicacion.CanvasJSChart(creaGrafico(datos)[1])
                    } else {
                        ubicacion.html('<p>Sin datos para graficar</p>')
                    }


                },
                error: function (error) {
                    alert("mal")
                    //si todo sale bien, se agrega la funcionalidad aquí.
                },
            });
        } else {

            alert(comprobar(indiceBusqueda)[1])

        }

    })

})