const axios=require('axios');

const serverConfig = require('../config/serverConfig');
// todo refresh token
async function getLongLiveToken(shortToken){
    try {
        const url=`https://graph.instagram.com/access_token`;
        const response=axios.get(url,{
            params:{
                grant_type: "ig_exchange_token",
                client_secret:serverConfig.INSTAGRAM_APP_SECRET,
                access_token:shortToken
            }
        })
        return (await response).data
    } catch (error) {
        
    }
}
module.exports=getLongLiveToken;