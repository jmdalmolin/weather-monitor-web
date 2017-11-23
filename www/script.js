var dadoAtual = undefined;
var stations;
var contagem = 0;
var tabela;
$(document).ready(function () {
    tabela = $('tbody');
    getStationList();
    setInterval(getDados, 1000);
    // setInterval(sendDados, 5000);
});

function getDados() {
    var dados = {
        limit: undefined
    };
    setStateAnimation(true);
    $.ajax({
        url: "http://localhost:2324/weathermonitor/data",
        data: dados,
        success: function (data) {
            // console.log(data);
            if (data !== undefined) {
                if (dadoAtual !== undefined) {
                    if (data.index >= dadoAtual.index) {
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

function sendStation() {

    var dados = {
        name: $('#name').val(),
        description: $('#description').val(),
        latitude: $('#latitude').val(),
        longitude: $('#longitude').val(),
        thermometer: $('#thermometer').val(),
        barometer: $('#barometer').val(),
        hygrometer: $('#hygrometer').val(),
        anemometer: $('#anemometer').val(),
        windsock: $('#windsock').val(),
        pluviometer: $('#pluviometer').val()
    };

    if (dados.name == ""){
        alert("Preencha o nome");
        return;
    }
    if (dados.description == ""){
        alert("Preencha a descricao");
        return;
    }
    if (dados.latitude == ""){
        alert("Preencha o latitude");
        return;
    }
    if (dados.longitude == ""){
        alert("Preencha o longitude");
        return;
    }

    setStateAnimation(true);
    $.ajax({
        url: "http://localhost:2324/weathermonitor/station",
        // data: JSON.stringify(dados),
        data: dados,
        success: function (data) {
            console.log(data);
            $('#response').text('Hash: ' + data.hash);
            setStateAnimation(false);
        },
        error: function () {
            alert('Falha ao cadastrar a estacao');
        },
        dataType: 'json',
        method: "POST"
    });
}

function getStationList() {
    setStateAnimation(true);
    $.ajax({
        url: "http://localhost:2324/weathermonitor/station/list",
        data: undefined,
        success: function (data) {
            if (data.warning === undefined) {
                // console.log(data);
                stations = data;
            }
            preencherTabelaEstacoes(data);
            setStateAnimation(false);
        },
        dataType: 'json'
    });
}

function clearStation() {
    $('#name').val('');
    $('#description').val('');
    $('#latitude').val('');
    $('#longitude').val('');
    $('#thermometer').val('');
    $('#barometer').val('');
    $('#hygrometer').val('');
    $('#anemometer').val('');
    $('#windsock').val('');
    $('#pluviometer').val('');
    $('#response').text('&nbsp;');
}

function preencherTabelaEstacoes(datas) {
    console.log(datas);
    datas.forEach(function (data) {
        console.log(data);
        var linha = "<tr>" +
            "<td><input class='station_check' type='checkbox' data-id='" + data.id + "'></td>" +
            "<td>" + (data.id !== undefined ? data.id : "[Indefinido]") + "</td>" +
            "<td>" + (data.name !== undefined ? data.name : "[Indefinido]") + "</td>" +
            "<td>" + (data.description !== undefined ? data.description : "&nbsp;") + "</td>" +
            "<td>" + (data.latitude !== undefined ? (data.latitude) : "&nbsp;") + "</td>" +
            "<td>" + (data.longitude !== undefined ? (data.longitude) : "&nbsp;") + "</td>" +
            "</tr>";
        $('#thead_s').after(linha);
    });
}

function preencherTabela(datas) {
    var name = undefined;
    datas.forEach(function (data) {
        stations.forEach(function (t) {
            // console.log(t);
            if (data.station == t.id) {
                // console.log(t.name);
                data.station_name = t.name;
            }
        });
        var linha = "<tr>" +
            "<td>" + (data.id !== undefined ? data.id : "[Indefinido]") + "</td>" +
            "<td>" + new Date(data.storage_date).toLocaleString() + "</td>" +
            "<td>" + (data.station_name !== undefined ? data.station_name : "[Indefinido]") + "</td>" +
            "<td>" + (data.temperature !== undefined ? (data.temperature + "°C") : "&nbsp;") + "</td>" +
            "<td>" + (data.atmospheric_pressure !== undefined ? (data.atmospheric_pressure + "ml") : "&nbsp;") + "</td>" +
            "<td>" + (data.relative_humidity !== undefined ? (data.relative_humidity + "%") : "&nbsp;") + "</td>" +
            "<td>" + (data.wind_speed !== undefined ? (data.wind_speed + "m/s") : "&nbsp;") + "</td>" +
            "<td>" + (data.wind_direction !== undefined ? (data.wind_direction + "°") : "&nbsp;") + "</td>" +
            "<td>" + (data.precipitation !== undefined ? (data.precipitation + "mL") : "&nbsp;") + "</td>" +
            "</tr>";
        $('#thead_d').after(linha);
    });
}


function setStateAnimation(state) {
    if (state) {
        $('i').addClass('spin');
    } else {
        $('i').removeClass('spin');
    }
}