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
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${serverConfig.INSTAGRAM_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(serverConfig.REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=` +
    [
      'instagram_basic',
      'pages_show_list',
      'pages_read_engagement'
    ].join(',');

  res.redirect(authUrl);
});



app.get('/auth/instagram/callback', async (req, res) => {
  try {
    console.log("CALLBACK QUERY:", req.query);

    const code = req.query.code;
    if (!code) return res.redirect('/error');

    const tokenRes = await axios.get(
      'https://graph.facebook.com/v19.0/oauth/access_token',
      {
        params: {
          client_id: serverConfig.INSTAGRAM_APP_ID,
          client_secret: serverConfig.INSTAGRAM_APP_SECRET,
          redirect_uri: serverConfig.REDIRECT_URI,
          code
        }
      }
    );

    const userAccessToken = tokenRes.data.access_token;
    console.log('USER ACCESS TOKEN:', userAccessToken);

    res.redirect('/success');
  } catch (err) {
    console.error('TOKEN ERROR:', err.response?.data || err);
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
