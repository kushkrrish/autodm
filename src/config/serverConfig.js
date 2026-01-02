const dotenv=require('dotenv');
dotenv.config();
module.exports={
    PORT:process.env.PORT ,
    VERIFY_TOKEN:process.env.VERIFY_TOKEN,
    INSTAGRAM_APP_ID:process.env.INSTAGRAM_APP_ID,
    INSTAGRAM_APP_SECRET:process.env.INSTAGRAM_APP_SECRET
}