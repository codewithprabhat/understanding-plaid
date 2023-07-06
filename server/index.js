const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_CLIENT_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

app.post("/api/create_link_token", async function (request, response) {
  const plaidRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: "testuser101",
    },
    client_name: "Plaid Test App",
    products: ["auth", "identity"],
    language: "en",
    redirect_uri: "http://localhost:3000/",
    country_codes: ["US"],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    response.status(500).json(error);
  }
});

// Create a one-time use link_token for the Item.
// This link_token can be used to initialize Link
// in update mode for the user

app.post("/api/update_link_token", async (request, response, next) => {
  const accessToken = request.body.accessToken;
  const configs = {
    user: {
      client_user_id: "testuser101",
    },
    client_name: "Plaid Test App",
    country_codes: ["US"],
    language: "en",
    access_token: accessToken,
    update: { account_selection_enabled: true },
  };

  const linkTokenResponse = await plaidClient.linkTokenCreate(configs);
  // Use the link_token to initialize Link
  response.json({ link_token: linkTokenResponse.data.link_token });
});

app.post(
  "/api/exchange_public_token",
  async function (request, response, next) {
    const publicToken = request.body.public_token;
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      const accessToken = plaidResponse.data.access_token;
      const itemID = plaidResponse.data.item_id;
      response.json({
        public_token_exchange: "complete",
        accessToken,
        itemID,
      });
    } catch (error) {
      // handle error
      console.log(error);
      response.status(500).json(error);
    }
  }
);

app.post("/api/auth", async (req, res) => {
  const accessToken = req.body.accessToken;
  const plaidRequest = {
    access_token: accessToken,
  };
  try {
    const response = await plaidClient.authGet(plaidRequest);
    const accountData = response.data.accounts;
    const numbers = response.data.numbers;
    res.json({ accountData, numbers });
  } catch (error) {
    // handle error
    res.status(500).json(error);
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
