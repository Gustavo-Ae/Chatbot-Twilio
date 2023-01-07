
exports.criarMensagemResultado = (twiml, pontuacaoComputador, pontuacaoCliente) => {

  twiml.message(`Resultado: 
        💻Computador: ${pontuacaoComputador}
        🧑Você: ${pontuacaoCliente}`);
  return twiml.toString();
};
