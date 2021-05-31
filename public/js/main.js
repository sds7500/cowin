const submitBtn=document.getElementById('submitBtn');
const cityName=document.getElementById('cityname');
const number=document.getElementById('number');
const city_name=document.getElementById('city_name');
const msg_status=document.getElementById('msgstatus');
const todays_date=document.getElementById('todays_date');

var d=new Date();
var day=d.getDate();
var month=d.getMonth();
var year=d.getFullYear();

todays_date.innerText=`${day}/${month+1}/${year}`
const datahide=document.querySelector('.data_hide');

const getInfo= async() => {
    let cityVal=cityName.value;
    let numVal=number.value;
    var pat1=/^\d{6}$/;
    var pattern=/^\d{10}$/;
    if(!pat1.test(cityVal)){
        city_name.innerText=`enter valid pincode`;
        datahide.classList.add('data_hide')
    }else if(!pattern.test(numVal)){
        city_name.innerText=`enter valid number`;
        datahide.classList.add('data_hide')
    }
    else{
        city_name.innerText=`Vaccination detials will be texted on ${numVal} shortly`
        datahide.classList.remove('data_hide')
    }
}



