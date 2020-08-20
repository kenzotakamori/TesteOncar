$(document).ready(function(){
    const url = 'http://127.0.0.1:3000/';
    console.log(url)
    $.get(url + 'api/veiculos',function(response){
        console.log(response);
    })
})