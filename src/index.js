const express=require('express');

const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());
const PORT =3000;
app.get('/webhook/instagram',(req,res)=>{
    try {
        const verify_token="my_verify_token";
        const mode=req.query['hub.mode'];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if(mode==='subscribe' && token===verify_token){
            return res.status(200).send(challenge);
        }
    } catch (error) {
        console.log("error in webhook instagram",error);
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

app.listen(PORT,()=>{
    console.log(`servers started`);
})