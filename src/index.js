const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const serverConfig = require('./config/serverConfig');

const app = express();
const PORT = serverConfig.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  '/css',
  express.static(path.join(__dirname, '..', 'frontend', 'css'))
);


const pagesPath = path.join(__dirname, '..', 'frontend', 'pages');

app.get('/', (req, res) => {
  res.sendFile(path.join(pagesPath, 'index.html'));
});

app.get('/connect', (req, res) => {
  res.sendFile(path.join(pagesPath, 'connect.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(pagesPath, 'success.html'));
});

app.get('/error', (req, res) => {
  res.sendFile(path.join(pagesPath, 'error.html'));
});



/* -------- INSTAGRAM OAUTH START -------- */
app.get('/auth/instagram', (req, res) => {
  const authUrl =
    `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=2778227255861888&redirect_uri=https://autodm-1.onrender.com/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`

  res.redirect(authUrl);
});

app.get('/auth/instagram/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send('No authorization code');
    }

    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      new URLSearchParams({
        client_id: serverConfig.INSTAGRAM_APP_ID,
        client_secret: serverConfig.INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: serverConfig.REDIRECT_URI,
        code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, user_id } = response.data;

    console.log('Access Token:', access_token);
    console.log('Instagram User ID:', user_id);

    res.redirect('/success');
  } catch (error) {
    console.error('Auth Error:', error.response?.data || error);
    res.redirect('/error');
  }
});

/* -------------- WEBHOOK VERIFY ------------- */
app.get('/webhook/instagram', (req, res) => {
  try {
    const verify_token = serverConfig.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verify_token) {
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  } catch (error) {
    console.log('error in webhook instagram', error);
    return res.status(500).send('internal server error');
  }
});

/* -------------- WEBHOOK EVENTS -------------- */
app.post('/webhooks/instagram', (req, res) => {
  console.log('Webhook Event:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
