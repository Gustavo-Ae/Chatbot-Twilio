const { criarMensagemResultado } = require("./criarMensagemResultado");

exports.finalizarJogo = (twiml, pontuacaoComputador, pontuacaoCliente) => {

    let respostaBot;

    if (pontuacaoCliente > pontuacaoComputador) {
        twiml.message("Você ganhou, parabéns 👏👏👏👏");
        criarMensagemResultado(twiml, pontuacaoComputador, pontuacaoCliente);
    } else if (pontuacaoComputador > pontuacaoCliente) {
        criarMensagemResultado(twiml, pontuacaoComputador, pontuacaoCliente);
        twiml.message("Ganhei! Ganhei!!!")
            .media(
            "https://img.freepik.com/vetores-premium/robo-fofo-personagem-de-desenho-animado_138676-2915.jpg"
            );
    } else {
        twiml.message("Deu Empate, vamos jogar novamente ?");
    }

    return twiml.toString();
};