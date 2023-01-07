require("dotenv").config();

const bodyParser = require("body-parser");
const twilio = require("twilio");
var express = require("express");
const { criarMensagemResultado } = require("./utils/criarMensagemResultado");
const { finalizarJogo } = require("./utils/finalizarJogo");
var app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

let pontuacaoComputador = 0;

let pontuacaoCliente = 0;

app.post("/messageWhatsapp", (req, res) => {
    
  try {
    const nomeCliente = req.body.ProfileName;

    const mensagemCliente = req.body.Body.toLowerCase();

    const { MessagingResponse } = twilio.twiml;

    const twiml = new MessagingResponse();

    const opcoes = ["pedra", "papel", "tesoura"];

    const opcoesQuandoPerde = {
      pedra: "papel",
      papel: "tesoura",
      tesoura: "pedra",
    };

    let respostaBot;

    switch (mensagemCliente) {
      case "r":
        respostaBot = criarMensagemResultado(twiml, pontuacaoComputador, pontuacaoCliente);
        break;
      case "f":
        respostaBot = finalizarJogo(twiml, pontuacaoComputador, pontuacaoCliente);
        pontuacaoCliente = 0;
        pontuacaoComputador = 0;
        break;

      case "pedra":
      case "papel":
      case "tesoura":
        const escolhaComputador = opcoes[Math.floor(Math.random() * opcoes.length)];

        if (escolhaComputador === mensagemCliente) {
          twiml.message(`Ops, deu empate!`);
        } else if (opcoesQuandoPerde[escolhaComputador] === mensagemCliente) {
          twiml.message(`Eu escolhi *${escolhaComputador}*`);
          twiml.message(`Você ganhou, parabéns 👏👏`);
          pontuacaoCliente++;
        } else {
          twiml.message(`Eu escolhi *${escolhaComputador}*`);
          twiml
            .message("Ganhei! Ganhei!!!")
            .media(
              "https://img.freepik.com/vetores-premium/robo-fofo-personagem-de-desenho-animado_138676-2915.jpg"
            );
          pontuacaoComputador++;
        }

        break;

      default:
        twiml.message(`Olá ${nomeCliente}. Escolha Pedra, Papel ou Tesoura!
          
        ❌Finalizar a partida - ( *f* )
        📝Mostrar o resultado - ( *r* )`);
        break;
    }
    if(respostaBot == null){
      respostaBot = twiml.toString();
    }

    res.status(200).send(respostaBot);
  } catch (error) {
    console.log("Erro na rota /messageWhatszap :", error);
    res.status(400).send("Erro no bot que envia mensagem: ",error)
  }
});

const port = process.env.PORT || 5450;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
