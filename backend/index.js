const express=require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors')

require('./dbconnect');
app.use(express.json());
app.use(cors());

app.use('/api/user',require('./routes/user_route'));
app.use('/api/mentee',require('./routes/mentee_route'));
app.use('/api/mentor',require('./routes/mentor_route'));

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on PORT: ${process.env.PORT}`);
});