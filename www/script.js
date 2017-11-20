var dadoAtual = undefined;
var stations;
var contagem = 0;
var tabela;
$(document).ready(function () {
    tabela = $('tbody');
    getStationList();
    setInterval(getDados, 5000);
    // setInterval(sendDados, 5000);
});

function getDados() {
    var dados = {limit: 1};
    setStateAnimation(true);
    $.ajax({
        url: "http://localhost:2324/weathermonitor/data",
        data: dados,
        success: function (data) {
            console.log(data);
            if (data !== undefined) {
                if (dadoAtual !== undefined) {
                    if (data._id !== dadoAtual._id) {
                        preencherTabela(data);
                        dadoAtual = data;
                    }
                } else {
                    preencherTabela(data);
                    dadoAtual = data;
                }
            }
            setStateAnimation(false);
        },
        dataType: 'json'
    });
}

// function sendDados() {
//     var dados = {station: "59e9e6d083747507612e8ab2",
//         temperature: 23,
//         relative_humidity: 74
//     };
//     setStateAnimation(true);
//     $.ajax({
//         url: "http://localhost:2324/weathermonitor/data",
//         data: dados,
//         success: function (data) {
//             console.log(data);
//             if(data !== undefined){
//                 console.log("foi")
//             }
//             setStateAnimation(false);
//         },
//         dataType: 'json',
//         method: "POST"
//     });
// }

function getStationList() {
    setStateAnimation(true);
    $.ajax({
        url: "http://localhost:2324/weathermonitor/station/list",
        data: undefined,
        success: function (data) {
            if (data.warning === undefined) {
                console.log(data);
                stations = data;
            }
            setStateAnimation(false);
        },
        dataType: 'json'
    });
}

function preencherTabela(data) {
    var name = undefined;
    stations.forEach(function (t) {
        if (t._id === data._station_id) {
            name = t.name;
        }
    });

    var linha = "<tr>" +
        "<td>" + (++contagem) + "</td>" +
        "<td>" + new Date(data.storage_date).toLocaleString() + "</td>" +
        "<td>" + (name !== undefined ? name : "[Indefinido]") + "</td>" +
        "<td>" + (data.temperature !== undefined ? (data.temperature + "°C") : "&nbsp;") + "</td>" +
        "<td>" + (data.relative_humidity !== undefined ? (data.relative_humidity + "%") : "&nbsp;") + "</td>" +
        "</tr>";
    console.log(linha);
    $('#thead').after(linha);
}

function setStateAnimation(state) {
    if (state) {
        $('i').addClass('spin');
    } else {
        $('i').removeClass('spin');
    }
}