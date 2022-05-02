const btn = document.querySelector('button')
const divElemento = document.querySelector('div')
const input = document.querySelector('input')

function esconde(){
    const pagHome = document.getElementById("pagHome");
    pagHome.style.display = "none";
}

btn.addEventListener('click', (e) => {
    const nome = input.value
    acessaApi(nome)
    esconde();
})

async function acessaApi(nome) {

     await fetch('https://backend54.herokuapp.com/produtos', {
        method: "GET"
    }).then(res => res.json()).then(data => trabalhaApi(data, nome))
}

function trabalhaApi(data, nome) {
   
    const novoArray = data.filter((produto) => {

        const nomeProduto = produto.nome.toUpperCase()  
        return nomeProduto.includes(nome.toUpperCase()) ? produto : ''
    })

    criaElemento(novoArray)
}

const divResultados = document.querySelector("#cards")

async function criaElemento(produtos) {   
    const ul = document.createElement("ul")    
    const arrayItem = []



    produtos.forEach(produto => {

        const li = document.createElement('li')
        li.classList.add('titulo')      
        const conteudoLI = document.createTextNode(produto.nome)        
        li.appendChild(conteudoLI)
        const criandoFoto = criaFoto(produto.foto, li)
        const infos = [produto.nomeEmpresa, produto.valor, produto.descricao, produto.etiquetas]
        const criandoInfo = criaInfo(infos, li)

        arrayItem.push(li)
    })    
   
    arrayItem.forEach(item => {
       
        ul.appendChild(item)
    })

  
    divResultados.appendChild(ul)
}

function criaInfo(arrayInfos, li) {
        arrayInfos.forEach((el) => {
        const span = document.createElement('span')
        span.classList.add('info')
        span.textContent = el
        li.appendChild(span)
    })
}


function criaFoto(url, li) {
    const img = document.createElement('img')
    img.classList.add('card-img')
    img.src = url
    li.appendChild(img)
    
}
