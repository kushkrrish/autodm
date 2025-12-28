const express=require('express');

const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());

app.get('/webHook/instagram',(req,res)=>{
    try {
        const verify_token="my_veryify_token";
        const mode=req.query['hub.mode'];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if(mode==='subscibe' && token===verify_token){
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
app.listen(3000,()=>{
    console.log(`servers started`);
})