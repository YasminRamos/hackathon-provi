
const btn = document.querySelector('button')
const divElemento = document.querySelector('div')
const input = document.querySelector('input')

// Repara que o botão no html tem o type = "button", para nao atualizar a página.
btn.addEventListener('click', (e) => {
    divElemento.innerHTML = ''
    //Passamos para uma função que acessa a API o nome que contem no input
    const nome = input.value
    acessaApi(nome)
})

async function acessaApi(nome) {
    // Realizamos o fetch, o primeiro then pra retornar no formato JSON
    // Segundo then chama a funcao que trabalha com a API passando o valor do input e o objeto de retorno do fetch
     await fetch('https://backend54.herokuapp.com/produtos', {
        method: "GET"
    }).then(res => res.json()).then(data => trabalhaApi(data, nome))
}

function trabalhaApi(data, nome) {
    // filter criará um novo array apenas com os produtos corretos
    const novoArray = data.filter((produto) => {
        // criamos uma variavel que recebe o nome do produto tudo em maiusculo
        const nomeProduto = produto.nome.toUpperCase()
        // Se o nome do produto incluir o nome que ta no input, ele retorna o produto.
        // Se não incluir, retorna vazio.
        // usamos nome.toUpperCase pq precisamos que sejam iguais 
        // tipo, sem isso ele considera Sabao diferente de sabao
        // Usando o toUpperCase, garantimos que no fim os dois sejam SABAO    
        return nomeProduto.includes(nome.toUpperCase()) ? produto : ''
    })

    // Agora trabalhamos com o novo array
    // Passaremos o array para uma outra função que cria elementos
    criaElemento(novoArray)
}

async function criaElemento(produtos) {
    // Ao ser executada, essa função cria um elemento do tipo UL
    const ul = document.createElement("ul")
    // Criamos um array que vai receber todos os itens da UL certinhos
    const arrayItem = []
    // para cada produto do array...
    produtos.forEach(produto => {
        // Criamos uma LI
        const li = document.createElement('li')
        // Colocando uma classe
        li.classList.add('titulo')
        // o conteudo da li vai ser o nome do produto
        
        const conteudoLI = document.createTextNode(produto.nome)
        
        // a li vai "receber" dentro dela o conteudo
        // Se o entendimento ficar meio dificil, é pq o conteudo (texto) de uma tag é considerado filho dessa tag,
        // Então aqui a gente meio que tá garantindo que cada tag li vai ter seu proprio conteudo 
        
        li.appendChild(conteudoLI)
        
        // Uma função somente para foto
        const criandoFoto = criaFoto(produto.foto, li)
        
        // Uma função com todas as outras info
        const infos = [produto.nomeEmpresa, produto.valor, produto.descricao, produto.etiquetas]
        const criandoInfo = criaInfo(infos, li)

        // O array vai dar um push em todo esse HTML
        arrayItem.push(li)
    })
    
    // Dei um console.log pra tu entender como fica o array final.
    // Para cada um desse array..
    arrayItem.forEach(item => {
        //Mandamos a UL inserir esse elemento do array como seu filho
        ul.appendChild(item)
    })

    // Por fim, mandamos a div que recebe os elementos receber toda essa ul como sua filha
    divElemento.appendChild(ul)
}

function criaInfo(arrayInfos, li) {
    // Para cada item, criamos uma span, add a classe damos o texto. Mandamos a LI pegar como filho esse span
    // ATENÇÃO: ESSE ELMENTO QUE COLOQUEI SPAN, ACHO Q NA VDD DEVERIA SER LI
        arrayInfos.forEach((el) => {
        const span = document.createElement('span')
        span.classList.add('info')
        span.textContent = el
        li.appendChild(span)
    })
}


// pelo tipo foto ser diferente, fiz uma função especifica
function criaFoto(url, li) {
    const img = document.createElement('img')
    img.classList.add('card-img')
    img.src = url
    li.appendChild(img)
    
}
// acessaApi('https://backend54.herokuapp.com/produtos')