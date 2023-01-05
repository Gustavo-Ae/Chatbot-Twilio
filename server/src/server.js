require("dotenv").config();

const bodyParser = require("body-parser");
const twilio = require("twilio");
var express = require("express");
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

    const perde = {
      pedra: "papel",
      papel: "tesoura",
      tesoura: "pedra",
    };

    switch (mensagemCliente) {
      case "r":
        twiml.message(`Resultado: 
        💻Computador: ${pontuacaoComputador}
        🧑Você: ${pontuacaoCliente}`);
        break;
      case "f":
        if (pontuacaoCliente > pontuacaoComputador) {
          twiml.message("Você ganhou, parabéns 👏👏👏👏");
          twiml.message(`Resultado: 
          💻Computador: ${pontuacaoComputador}
          🧑Você: ${pontuacaoCliente}`);
        } else if (pontuacaoComputador > pontuacaoCliente) {
          twiml
            .message("Ganhei! Ganhei!!!")
            .media(
              "https://img.freepik.com/vetores-premium/robo-fofo-personagem-de-desenho-animado_138676-2915.jpg"
            );
          twiml.message(`Resultado: 
          💻Computador: ${pontuacaoComputador}
          🧑Você: ${pontuacaoCliente}`);
        } else {
          twiml.message("Deu Empate, vamos jogar novamente ?");
        }

        pontuacaoCliente = 0;
        pontuacaoComputador = 0;
        break;

      case "pedra":
      case "papel":
      case "tesoura":
        const computador = opcoes[Math.floor(Math.random() * opcoes.length)];

        if (computador === mensagemCliente) {
          twiml.message(`Ops, deu empate!`);
        } else if (perde[computador] === mensagemCliente) {
          twiml.message(`Eu escolhi *${computador}*`);
          twiml.message(`Você ganhou, parabéns 👏👏`);
          pontuacaoCliente++;
        } else {
          twiml.message(`Eu escolhi *${computador}*`);
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

    const respostaBot = twiml.toString();

    return res.status(200).send(respostaBot);
  } catch (error) {
    console.log("Erro na rota /messageWhatszap :", error);
  }
});

const port = process.env.PORT || 5450;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
