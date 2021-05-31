const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const hbs = require('hbs');
const app=express();
var requests = require("requests");
const wbm = require('wbm');

var d=new Date();
var day=d.getDate();
var month=d.getMonth();
var year=d.getFullYear();

const port=process.env.PORT||8000;    //used when you want to host  
//routing 

var jsonParser = bodyParser.json()

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'./templates/views'))
var urlencodedParser = bodyParser.urlencoded({ extended: false })
hbs.registerPartials(path.join(__dirname,'./templates/partials'))

app.use(express.static(path.join(__dirname,'../public')))

app.use(express.urlencoded({extended:false}))

app.post('/sendMessage', urlencodedParser,(req, res) =>{
    res.status(204).send();
    requests(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${req.body.city}&date=${day}-${month+1}-${year}`)
    .on("data", (chunk) => {
        var message="Details of vaccination in requested area are: \n";
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        var size=arrData[0].sessions.length;
        for(var i=0;i<size;i++){
            if(arrData[0].sessions[i].available_capacity>0){
                message=message+`${i+1}: There are ${arrData[0].sessions[i].available_capacity} doses available of ${arrData[0].sessions[i].vaccine} for people above ${arrData[0].sessions[i].min_age_limit} years in ${arrData[0].sessions[i].name} out of which ${arrData[0].sessions[i].available_capacity_dose1} are dose 1 and ${arrData[0].sessions[i].available_capacity_dose2} are dose 2 type\n`
            }
        }
        if(message==="Details of vaccination in requested area are: \n"){
            message="Either the pin you entered was not valid or there are no vaccination centers currently available in your area"
        }
        console.log(message);
        wbm.start().then(async () => {
            const phones = [`91${req.body.num}`];
            const msg = message;
            await wbm.send(phones, msg);
            await wbm.end();
        }).catch(err => console.log(err));
    }).on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });

})

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.get('/vaccination',(req,res)=>{
    res.render('vaccine');
})

app.get('*',(req,res)=>{
    res.render("404error");
})



app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})