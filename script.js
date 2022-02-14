let nome;
setInterval(manterConexao, 5000);
function manterConexao() {
    if (nome != undefined) {
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: nome});
    }
}
let participantes = [];
let selecao = [];


function fazerLogin() {
    nome = document.querySelector(".nome").value;
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: nome});

    promise.catch(error);
    promise.then(loginOK); 
    promise.then(buscarMensagens); 
}

function seleciona(posicao) {

}
function loginOK(){ 
    document.querySelector(".login").classList.add("remove");
    document.querySelector(".conteudo").classList.remove("remove");
}
function error(erro){
    const codigo = erro.response.status; 
    if (codigo == 400) {
        alert("este usúario já existe!");
        passado = false;
    }    
}
setInterval(buscarMensagens, 500);
function buscarMensagens() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(printarMensagens);
}
function printarMensagens(mensagens) {
    let data = mensagens.data;
    const blocoMsg = document.querySelector("main");
    blocoMsg.innerHTML =``
    for (let i = 0; i < data.length; i++) {
        // blocoMsg.innerHTML += `<div id="${i}"><p2><span>(${data[i].time})</span>${data[i].from} <span>${data[i].text}</span> </p2></div></main>`
        
        if(data[i].type === "status"){
            blocoMsg.innerHTML += `<div id="${i}" class="msgStatus" data-identifier="message"><p2><span>(${data[i].time})</span>${data[i].from}  <span class="font-bold">${data[i].text} </span></p2></div>`
            
        }else if(data[i].type === "private_message" && (data[i].to === nome || data[i].from === nome)){
            blocoMsg.innerHTML += `<div id="${i}" class="msgPrivada" data-identifier="message">
                    <p2><span>(${data[i].time})</span> ${data[i].from}  reservadamente para ${data[i].to}: <span class="font-bold">${data[i].text}</span></p2>
            </div>`
            
        }else if(data[i].type === "message"){
            blocoMsg.innerHTML += `<div id="${i}" class="msgPublica" data-identifier="message"><p2><span>(${data[i].time})</span> ${data[i].from}  para ${data[i].to}: <span class="font-bold">${data[i].text} </span></p2></div>`;        
        }
    }
    document.getElementById(`${data.length - 1}`).scrollIntoView({block: "end", behavior: "smooth"});
}

function enviarMensagens() {
    let text = document.querySelector(".barraConversa input").value;
    console.log(text);
    let object= {};
    object.from = nome;
    object.to= 'Todos';
	object.text= text;
	object.type= 'message';    
    postData("https://mock-api.driven.com.br/api/v4/uol/messages", object);
    document.querySelector(".barraConversa input").value = '';
}
function postData(url, object){
    const promise= axios.post(url, object);
    buscarMensagens();
}