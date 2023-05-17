$(document).ready(function () {
    $("#buscarCep").click(function () {
        var valor = $("#idCep").val();
        var url = "https://brasilapi.com.br/api/cep/v2/{cep}".replace("{cep}", valor);
        var nome = $("#idNome").val();
        // Verificar se o CEP está no formato correto
        var cepRegex = /^[0-9]{8}$/;
        if (!cepRegex.test(valor)) {
            Swal.fire({
                title: "Erro!",
                text: "Por favor, digite um CEP válido.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }


        // verificar se foi inserido um nome
        if (nome === "") {
            Swal.fire({
                title: "Erro!",
                text: "Por favor, digite o seu nome! ",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        } else {
            // Chamar a função que vai exibir o resultado do CEP
            $.get(url, function (cep, status) {
                if (status === "success") {
                    var resultado = $("#resultado");
                    resultado.empty();
                    //verificar se ele existe
                    if (cep.error) {
                        setTimeout(function () {
                            Swal.fire({
                                title: "Erro!",
                                text: "CEP não encontrado.",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                            resultado.empty();
                        }, 1000);
                        return;
                    }
                    // Resultado do cep

                    resultado.append("<h3>Estado: " + cep.state + "</h3>");
                    resultado.append("<h3>Cidade: " + cep.city + "</h3>");
                    resultado.append("<h3>Bairro: " + cep.neighborhood + "</h3>");
                    resultado.append("<a href='https://www.google.com.br/maps/place/" +
                        encodeURI(cep.street) + ", " +
                        encodeURI(cep.city) + ", " +
                        encodeURI(cep.state) + "' target='_blank'><h3>" + cep.street + '<img src="imgs/google-maps.png" alt="icon_google">' + "</h3></a>");
                    resultado.append("<p><input type='text' name='fipe' id='idFipe' placeholder='Digite o código FIPE'></p>")
                    resultado.append("<p><button id='buscarCarro' class='btn-buscar'>Buscar Carro</button></p>")

                    //Inicio da consulta a tabela FIPE
                    $(document).ready(function () {
                        $("#buscarCarro").click(function () {
                            var codigo = $("#idFipe").val();
                            //Verificar se foi inserido um código FIPE
                            if (codigo === "") {
                                Swal.fire({
                                    title: "Erro!",
                                    text: "Por favor, digite um código FIPE.",
                                    icon: "error",
                                    confirmButtonText: "OK",
                                });
                                return;
                            }

                            var url = "https://brasilapi.com.br/api/fipe/preco/v1/{codigoFipe}".replace("{codigoFipe}", codigo);
                            // Chamar a função que vai exibir o resultado da tabela FIPE 
                            $.get(url, function (fipe, status) {
                                if (status === "success") {
                                    // verificar se o código fipe existe
                                    if (!Array.isArray(fipe) || fipe.length === 0) {
                                        Swal.fire({
                                            title: "Erro!",
                                            text: "Código FIPE não encontrado.",
                                            icon: "error",
                                            confirmButtonText: "OK",
                                        });
                                        return;
                                    }

                                    // resultados da tabela FIPE
                                    var resultado = $("#resultado");
                                    resultado.empty();
                                    resultado.append("<h3>Valor: " + fipe[0].valor + "</h3>");
                                    resultado.append("<h3>Marca: " + fipe[0].marca + "</h3>");
                                    resultado.append("<h3>Ano: " + fipe[0].anoModelo + "</h3>");
                                    resultado.append("<h3>Modelo: " + fipe[0].modelo + "</h3>");
                                    resultado.append("<a href=''><button id='btn-voltar' class='btn-buscar'>VOLTAR</button></a>");
                                }
                            }).fail(function () { // Caso de algum erro ao buscar o código FIPE
                                Swal.fire({
                                    title: "Erro!",
                                    text: "Ocorreu um erro ao buscar o código FIPE. Por favor, tente novamente!",
                                    icon: "error",
                                    confirmButtonText: "OK",
                                });
                            });
                        });
                    });

                    $(".etapa1").empty();
                }
            }).fail(function () {// Caso de algum erro ao buscar o CEP
                Swal.fire({
                    title: "Erro!",
                    text: "Ocorreu um erro ao buscar o CEP. Por favor, tente novamente!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            });
        }
    });
});
