const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const serverConfig = require('./config/serverConfig');
const axios=require('axios');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());
const PORT = serverConfig.PORT || 3000;



app.get('/webhook/instagram', (req, res) => {
  try {
    const verify_token = serverConfig.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === 'subscribe' && token === verify_token) {
      return res.status(200).send(challenge);
    }
  } catch (error) {
    console.log("error in webhook instagram", error);
    return res.status(500).send("internal server error");
  }
})
app.post("/webhooks/instagram", (req, res) => {
  console.log("Webhook Event:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});
app.get("/privacy-policy", (req, res) => {
  res.send(`
    <h1>Privacy Policy</h1>
    <p>This app collects Instagram data only to automate replies.</p>
    <p>No data is shared with third parties.</p>
    <p>Contact: kushagra16.kapoor@gmail.com</p>
  `);
});
app.get("/auth/instagram/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send("no code");
    }
    //exchange code for access token
    const response = await axios.post("https://api.instagram.com/oauth/access_token", new URLSearchParams({
      client_id: serverConfig.INSTAGRAM_APP_ID,
      client_secret: serverConfig.INSTAGRAM_APP_SECRET,
      grant_type: "authorization_code",
      redirect_uri: "https://autodm-1.onrender.com/auth/instagram/callback",
      code: code,
    }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const { access_token, user_id } = response.data;

    console.log("Access Token:", access_token);
    console.log("Instagram User ID:", user_id);

    res.send("Instagram connected successfully ✅");


  } catch (error) {
    console.error("Auth Error:", error.response?.data || error);
    res.status(500).send("Authentication failed");
  }
})

app.listen(PORT, () => {
  console.log(`servers started`);
})