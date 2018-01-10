var UiController = (function () {

    //Cria o objeto que contem todos os elementos HTML que iremos precisar para a aplicação funcionar
    let pegaElementos = {
        nomeJogo: '#nome-jogo',
        precoJogo: '#preco-jogo',
        empresaJogo: '#empresa-jogo',
        dataJogo: '#data-jogo',
        tipoJogo: '#tipo-jogo',
        btnEnviar: '#btn-enviar',
        acaoContainer: '.container-acao',
        rpgContainer: '.container-rpg',
        fpsContainer: '.container-fps',
        totalJogos: '.total-total',
        totalAcao:  '.total-acao',
        totalRpg:   '.total-rpg',
        totalFps:   '.total-fps',
        listasContainer: '.listas-container'

    };

    //Crio a função que formata os números
    let formataNumeros = function(num){

        //Declaro as váriavéis
        let numSplit, int, dec; 

        //Declaro a constante que será concatenada
        const cifrao = 'R$';

        //Pego o número absoluto do número e o transformo em uma String 
        num = Math.abs(num); 

        //coloco 2 números decimais nesse número
        num = num.toFixed(2);

        //Quebro a String apartir do . 
        numSplit = num.split('.');

        //A 1ª parte é são os inteiros
        int = numSplit[0]; 

        //Se os inteiros forem  maior que 3 números
        if(int.length > 3){

            //Colocamos uma SubString em alguns lugares 
            int = int.substr(0 , int.length -3 ) + ',' + int.substr(int.length -3 , 3);
        };

        //Colocamos os decimais em outra váriavel
        dec = numSplit[1];

        //Retornamos os números formatados
        return cifrao+' '+int +'.'+dec;


    };

    return {
        //Retorna um objeto com todos os inputs do usuário
        getInputs: function () {
            return {
                tipo: document.querySelector(pegaElementos.tipoJogo).value,
                nome: document.querySelector(pegaElementos.nomeJogo).value,
                preco: parseFloat(document.querySelector(pegaElementos.precoJogo).value),
                empresa: document.querySelector(pegaElementos.empresaJogo).value,
                data: document.querySelector(pegaElementos.dataJogo).value
            };
        },

        //Torna público o método que pega os elementos HTML
        pegaElementos: function () {
            return pegaElementos;
        },


        //Cria o método Público que coloca os elementos na lista 
        addItemLista: function (obj,type) {

            //Declara as váriaveis necessárias para isso
            let html, novoHtml, elemento;
           
            //Checa o tipo de jogo recebido, dependendo do tipo, cria o elemento HTML para ele e o acrescenta
            //na lista certa, selecionando o elemeto HTML do objeto pegaElementos
            if (type === 'acao') {

                elemento = pegaElementos.acaoContainer;
                html='<li class="collection-item avatar" id="acao-%id%"><img src="img/acao.png" alt="" class="circle"><span class="title">%Nome_do_jogo%</span><p>%Preço%</p>'+
                '<a class="secondary-content"><i class="material-icons"><img src="img/delete.svg"></i></a></li>';

            } else if (type === 'rpg') {
                elemento = pegaElementos.rpgContainer;

                html='<li class="collection-item avatar" id="rpg-%id%"><img src="img/rpg.jpeg" alt="" class="circle"><span class="title">%Nome_do_jogo%</span><p>%Preço%</p>'+
                '<a class="secondary-content"><i class="material-icons"><img src="img/delete.svg"></i></a></li>';
            
            } else if (type === 'fps') {

                elemento = pegaElementos.fpsContainer;

                html='<li class="collection-item avatar" id="fps-%id%"><img src="img/fps.png" alt="" class="circle"><span class="title">%Nome_do_jogo%</span><p>%Preço%</p>'+
                '<a class="secondary-content"><i class="material-icons"><img src="img/delete.svg"></i></a></li>';
            }

            //Coloca os valores recebidos no Input na String, gerando assim o elemento com os valores certos
            novoHtml = html.replace('%id%', obj.id);
            novoHtml = novoHtml.replace('%Nome_do_jogo%', obj.nome);
            novoHtml = novoHtml.replace('%Preço%', formataNumeros(obj.preco));

            //Coloca o documento na lista
            document.querySelector(elemento).insertAdjacentHTML('beforeend', novoHtml);
        },

        //Essa função recebe o Id do elemento que ela vai retirar da UI
        deletaItemLista: function(itemId){
            //No Js não podemos excluir um elemento como um todo o que podemos fazer é retirar um filho daquele elemento
            //aqui selecionamos o elemento pelo id que foi passado.
            el = document.getElementById(itemId);
            
            //Subimos ao pai do elemento e então excluimos seu filho que já foi selecionado anteriormente 
            el.parentNode.removeChild(el); 

        }, 
        //Função que mostra o total de cada gasto
        mostraTotais : function(obj){

        //Coloca os totais em seus lugares no HTML
        document.querySelector(pegaElementos.totalJogos).textContent = formataNumeros(obj.totalJogos); 
        document.querySelector(pegaElementos.totalAcao).textContent = formataNumeros(obj.totalAcao); 
        document.querySelector(pegaElementos.totalRpg).textContent = formataNumeros(obj.totalRpg); 
        document.querySelector(pegaElementos.totalFps).textContent = formataNumeros(obj.totalFps);
        }
    }

})();



var JogosController = (function () {

    //Função que cria os objetos jogos.
    let Jogo = function (id, nome, empresa, preco, data, tipo) {
        this.id = id,
            this.nome = nome,
            this.empresa = empresa,
            this.preco = preco,
            this.data = data,
            this.tipo = tipo,
            this.porcentagem = 0
    };
    //Objeto que Tem todas as informações sobre os jogos, quanto de cada existem, total gasto com cada um
    //e quanto foi gasto em jogos no total
    let dados = {
        todosJogos: {
            acao: [],
            rpg: [],
            fps: []
        },
        totals: {
            acao: 0,
            rpg: 0,
            fps: 0,
        },
        porcentagens: {
            acao : 0,
            rpg: 0,
            fps: 0, 
        },
        totalDeTodosOsJogos: 0
    };

        //Crio a função que calcula o total gasto com cada jogo
        let calculaPrecos = function(type){
            let sum = 0; 
    
            //Dado o tipo de jogo que eu receber itero sobre o objeto e pego o valor de 
            //cada propriedade, após isso somo os valores 
            dados.todosJogos[type].forEach(function(element){
                sum += element.preco; 
    
            });
    
            //Depois acrescento isso ao objeto, dado o tipo de jogo
            dados.totals[type] = sum;
    
        };

    return {

        //Cria a função que cria o jogo, e o adiciona no objeto. 
        //No final da função retornamos o objeto criado
        addItem: function (tipo, nome, data, preco, empresa) {

            let novoJogo, Id;

            //Se o array não estiver vazio pega o ultimo ID e soma +1
            if (dados.todosJogos[tipo].length > 0) {

                Id = dados.todosJogos[tipo][dados.todosJogos[tipo].length - 1].id + 1;

            } else {
                //Caso o array esteja vazio o 1º id é 0
                Id = 0;
            }

            //Cria o objeto
            novoJogo = new Jogo(Id, nome, empresa, preco, data, tipo);

            //Adiciona o objeto em sua respectica lista
            dados.todosJogos[tipo].push(novoJogo);

            //retorna o objeto criado
            return novoJogo;

        },

        //Método que será responsável por deletar o item da estrutura de dados
        deleteItem : function(type, id){

            //declaro as váriaveis que serão usadas no método
            var ids, index

            //Uso o método dos array chamado map, esse método intera sobre o array selecionado, 
            //pegando o id de cada item, esse método nos retorna um outro array apenas com os ids dos objetos
            //guardamos esses ids em uma váriavel
            ids = dados.todosJogos[type].map(function(item){
                return item.id
            });

            //pegamos a posição desse id no Array, NOTE: AQUI PEGAMOS A POSIÇÃO DO ELEMENTO NO ARRAY E GUARDAMOS A MESMA  
            index = ids.indexOf(id); 

            //Se esse elemento existir então teremos a posição desse elemento no array, caso contrário esse array nos
            //retornará -1, e caso o número seja diferente de -1
            if(index !== -1){
                //Selecionamos o array que o objeto se encontra, e excluimos, o objeto daquela posição. 
                //para isso usamos o método splice.
                dados.todosJogos[type].splice(index, 1);
            }
        },

        //Função que calcula o total de cada jogo, e total 
        //gasto com jogos como um todo
        calculaTotal : function(){
            //Calculo quanto foi gasto com cada TIPO de jogo
            calculaPrecos('acao');
            calculaPrecos('rpg');
            calculaPrecos('fps');

        //Calculo o total gasto com todos os jogos dado o quanto foi gasto com cada um
        dados.totalDeTodosOsJogos = dados.totals.acao + dados.totals.fps + dados.totals.rpg; 
            
        }, 

        //Função que retorna o resultado dos calculos
        retornaTotal: function(){
            //Retorno de um objeto com todas as informações dos calculos
            return{
                totalJogos : dados.totalDeTodosOsJogos,
                totalAcao : dados.totals.acao,
                totalRpg : dados.totals.rpg,
                totalFps : dados.totals.fps, 
                porcentagemAcao : dados.porcentagens.acao, 
                porcentagemRpg : dados.porcentagens.rpg, 
                porcentagemFps : dados.porcentagens.fps
            }
        },

        teste: function () {
            return dados;
        }

    }

})();



var AppController = (function (UIctrl, jogosCtrl) {

    //Pega o retorno do método dos elementos HTML
    let elementos = UIctrl.pegaElementos();

    //Coloca os 'ouvidores'
    let setaEventos = function () {
        document.querySelector(elementos.btnEnviar).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {

            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        //Escuto o evento e caso o botão seja clicado chamo a função que exclui o elemento
        document.querySelector(elementos.listasContainer).addEventListener('click', ctrlDeleteItem);

    };

    let atualizaTotal = function(){

    //Chama método que calcula o total dos jogos
    jogosCtrl.calculaTotal();

    //Chama o método que retorna os totais e armazeno o resultado
    //em um objeto
    let totais_totais = jogosCtrl.retornaTotal();
    
    //Coloco os resultados na tela
    UIctrl.mostraTotais(totais_totais);


    };

    //Função que gerencia as chamadas 
    let ctrlAddItem = function () {
        let inputs, novoJogo;
        //1 - Pegar os inputs do usuário
        inputs = UIctrl.getInputs();
        //2 - Adicionar o elemento na Estrutura de dados
        novoJogo = jogosCtrl.addItem(inputs.tipo, inputs.nome, inputs.data, inputs.preco, inputs.empresa);
        //3 - Adicionar o elemento na Interface do Usuário
       UIctrl.addItemLista(novoJogo,inputs.tipo);
       //3.5 Limpa os Campos
       document.getElementById('form-envio').reset();
        //4 - Calcular o total 
        atualizaTotal();
    };

    //Defino a função que exclui o elemento da Estrutura de dados e da UI
    let ctrlDeleteItem = function(event){

        //defino as váriaveis
        let jogoId,splitId, type, ID;

        //Pega o ID do elemento
        jogoId = event.target.parentNode.parentNode.parentNode.id;

        //Se o ID existir parte ele e passa os argumentos para as funções
        if(jogoId){

            splitId = jogoId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            //Excluo o item do objeto com os jogos 
            jogosCtrl.deleteItem(type,ID);

            //Excluo o item da UI 
            UIctrl.deletaItemLista(jogoId);

            //recalculo o total
            atualizaTotal();


        }

    }

    //Função que inicia a aplicação
    return {
        init: function () {
            setaEventos();
            atualizaTotal({
                totalJogos : 0, 
                totalAcao : 0,
                totalFps : 0,
                totalRpg : 0,
                porcentagemAcao : '------',
                porcentagemFps : '------',
                porcentagemRpg : '------'
            });
        }


    };

})(UiController, JogosController);

//Chama o inicio da aplicação
AppController.init();