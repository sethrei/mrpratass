const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
const PORT = 3000;

// Configuração do Mercado Pago
const client = new mercadopago.MercadoPagoConfig({
  accessToken: 'APP_USR-4780303099338932-042613-8ed932b2525aef768bcc3dc041094027-1612905007', // Coloque sua chave de API aqui
});

const payment = new mercadopago.Payment(client);

app.use(cors());
app.use(express.json());

// Rota para criar pagamento com PIX
app.post('/criar-pix', async (req, res) => {
  try {
    // Dados do pagamento
    const payment_data = {
      transaction_amount: Number(req.body.valor),  // O valor recebido do frontend
      description: "Pagamento via Pix",
      payment_method_id: "pix",
      payer: {
        email: "email@teste.com",
        first_name: "Fulano",
        last_name: "da Silva",
        identification: {
          type: "CPF",
          number: "12345678909"
        },
        address: {
          zip_code: "06233200",
          street_name: "Av. das Nações Unidas",
          street_number: "3003",
          neighborhood: "Bonfim",
          city: "Osasco",
          federal_unit: "SP"
        }
      }
    };

    // Criação do pagamento
    const payment_response = await payment.create({ body: payment_data });

    // Retorna o QR Code e o código PIX
    res.json({
      qr_code_base64: payment_response.point_of_interaction.transaction_data.qr_code_base64,
      qr_code: payment_response.point_of_interaction.transaction_data.qr_code,
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
