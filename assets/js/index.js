const btn = document.querySelector('.input--button')
const divElemento = document.querySelector('.secao--resultados')
const input = document.querySelector('#input-busca')
const modalTitle = document.querySelector('.modal-title')
const modalBody = document.querySelector('.modal-body')
const secoesPrincipais = document.querySelector('main')
const btnTopo = document.querySelector('#button--subir')

document.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        btnTopo.style.opacity = 1
    } else {
        btnTopo.style.opacity = 0
    }
})

btn.addEventListener('click', async (e) => {
    secoesPrincipais.style.display = 'none'
    divElemento.innerHTML = ''
    
    const nome = input.value
    await acessaApi(nome)
})

async function acessaApi(nome) {
     await fetch('https://backend54.herokuapp.com/produtos', {
        method: "GET"
    }).then(res => res.json()).then(data => trabalhaApi(data, nome))
}

function trabalhaApi(data, nome) {
   
    const novoArray = data.filter((produto) => {

        const nomeProduto = produto.nome.toUpperCase()  
        return nomeProduto.includes(nome.toUpperCase()) ? produto : null
    })

    novoArray.length > 0 ? criaCard(novoArray) : criaTelaDeErro()
}

function criaTelaDeErro() {
    const titulo = criaElemento('h2', 'titulo-erro')
    titulo.textContent = 'Ops! Infelizmente não possuimos este produto.'
    divElemento.appendChild(titulo)
}

function criaCard (arrayProdutos) {
    arrayProdutos.forEach(produto => {
        const divPrincipal = criaElemento('div', 'card-eco')

        const divImagem = criaElemento('div', 'card-img-eco')
        
        const img = criaElemento('img', 'card-img-top-eco', produto.foto)
        
        const divBody = criaElemento('div', 'card-body-eco')

        const nome = produto.nome.replace(/\(|\)/gi, "").split('')
        const primeiraLetra = nome.splice(0,1)
        const nomeProdutoView = primeiraLetra.toString().toUpperCase() + nome.join('')
    
        const nomeProduto = criaElemento('h5', 'card-title-eco', nomeProdutoView)

        const descricaoProduto = criaElemento('p', 'card-text-eco', produto.descricao)
        
        const botaoProduto = criaElemento('a', 'button-produto-eco', 'Ver mais')
            botaoProduto.classList.add('button-produto-eco__card')
            botaoProduto.setAttribute('data-bs-toggle', 'modal')
            botaoProduto.setAttribute('data-bs-target', '#exampleModal')

        escutadorModal(botaoProduto, produto)

        divImagem.appendChild(img)
        divPrincipal.appendChild(divImagem)

        divBody.append(nomeProduto, descricaoProduto, botaoProduto)

        divPrincipal.appendChild(divBody)
        divElemento.appendChild(divPrincipal)
        
    })

}

function escutadorModal (elemento, produto) {
    elemento.addEventListener('click', () => {
        populaModal(produto)
    })
}

function populaModal(produto) {
    modalBody.innerHTML = ''
    const titulo = produto.nome
    const informacoes = [produto.nomeEmpresa, produto.descricao, produto.valor]
    const referencias = ['Empresa: ', 'Descrição: ', 'Valor: R$ ']
    modalTitle.textContent = titulo
    const ul = criaElemento('ul', 'ul-eco')
    for (let i = 0; i < informacoes.length; i++) {
        const div = criaElemento('div', 'div-eco')
        const span = criaElemento('span', 'span-eco')
        const infoConteudo = referencias[i] + informacoes[i]
        const info = criaElemento('li', 'li-eco', infoConteudo)

        div.append(span, info)

        ul.appendChild(div)
    } 

    const icons = obtemIcones(produto.etiquetas.split(','))
    modalBody.append(ul, icons)
}

function obtemIcones (etiquetas){
    const icones = comparaEtiquetas(etiquetas)

    const ul = criaElemento('ul', 'ul-icons')
    
    icones.forEach(objeto => {
        const li = criaElemento('li', 'li-icons')
      
        const img = criaElemento('img', 'img-icons', objeto.imagem)
        
        const span = criaElemento('span', 'span-icons', objeto.texto)

        li.append(img, span)

        ul.appendChild(li)
    })

    return ul   
}

function comparaEtiquetas (array) {
    
    const refIcones = [
        {   
            "nome": "animal",
            "regex": /anima/gi,
            "texto": 'Este produto é de origem animal',
            "imagem": './assets/img/animal.svg'
        },
        {
            "nome": "bio-degradavel",
            "regex": /biodegrad/gi,
            "texto": 'Este produto é bio-degradável',
            "imagem": './assets/img/bio-degradavel.svg'
        },
        {
            "nome": "sem-plastico",
            "regex": /pla?á?sti/gi,
            "texto": 'Este produto não contém plástico',
            "imagem": './assets/img/sem-plastico.svg'
        },
        {
            "nome": "recycle",
            "regex": /recicl/gi,
            "texto": 'Este produto é reciclado',
            "imagem": './assets/img/recycle.svg'
        },
        {
            "nome": "vegano",
            "regex": /vega?e?/gi,
            "texto": 'Este produto possui selo verde',
            "imagem": './assets/img/selo-verde.svg'
        }, 
        {
            "nome": "planta",
            "regex": /plan/gi,
            "texto": 'Este produto possui selo verde',
            "imagem": './assets/img/selo-verde.svg'
        },
        {
            "nome": "natural",
            "regex": /natura/gi,
            "texto": 'Este produto possui selo verde',
            "imagem": './assets/img/selo-verde.svg'
        },
        {
            "nome": "nacional",
            "regex": /naciona/gi,
            "texto": 'Este produto é nacional',
            "imagem": './assets/img/nacional.svg'
        }
        
    ]

    const arrayPopulado = array
    for (let i = 0; i < refIcones.length; i++) {
        if (arrayPopulado[i] == undefined) {
            arrayPopulado.push('')
        }
    }

    const arrayEtiquetas = []

    for (let i in refIcones) {
        const regex = refIcones[i].regex
        for (let j = 0; j  < 8; j++) {
            if (arrayPopulado[j].match(regex)) {
                arrayEtiquetas.push(refIcones[i])
            }
        }
    }

    return ([... new Set(arrayEtiquetas)])
}

function criaElemento(elemento, classe, conteudo) {
    const el = document.createElement(elemento)
    el.classList.add(classe)
    if (conteudo) {
        el.tagName == 'IMG' ? el.src = conteudo : el.textContent = conteudo
    }
    return el
}