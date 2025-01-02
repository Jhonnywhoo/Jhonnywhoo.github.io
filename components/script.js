document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nomeInput = document.getElementById('nome');
    const tabelaCorpo = document.querySelector('table tbody');
    const page = document.body.dataset.page;
    const papeisLobisomens = ['lobo solitário', 'filhote de lobisomem', 'lobo alfa'];
    const carregarJogadores = () => {
        const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
        tabelaCorpo.innerHTML = ''; // Limpa a tabela antes de popular novamente
    
        jogadores.forEach((jogador, index) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${index + 1}</td>
                <td>${jogador}</td>
            `;
            tabelaCorpo.appendChild(linha);
        });
    
        return jogadores;
    };

    const salvarJogadores = (jogadores) => {
        localStorage.setItem('jogadores', JSON.stringify(jogadores));
    };

    const carregarPapeis = () => JSON.parse(localStorage.getItem('papeisSessao')) || [];

    const salvarSorteados = (sorteados) => {
        localStorage.setItem('resultadoSorteio', JSON.stringify(sorteados));
    };

    const carregarSorteados = () => JSON.parse(localStorage.getItem('resultadoSorteio')) || [];

    const deletarJogadores = () => {
        localStorage.removeItem('jogadores');
    };

    const calcularSorteio = (chances, excluir = []) => {
        const chancesFiltradas = Object.entries(chances).filter(([papel]) => !excluir.includes(papel));
        const total = chancesFiltradas.reduce((sum, [, chance]) => sum + chance, 0);
        const random = Math.random() * total;
        let acumulado = 0;
        for (const [papel, chance] of chancesFiltradas) {
            acumulado += chance;
            if (random <= acumulado) {
                return papel;
            }
        }
    };

    const calcularSorteioLobisomem = (chances) => {
        const total = Object.values(chances).reduce((sum, chance) => sum + chance, 0);
        const random = Math.random() * total;
        let acumulado = 0;
        for (const [papel, chance] of Object.entries(chances)) {
            acumulado += chance;
            if (random <= acumulado) {
                return papel;
            }
        }
    };

    const chancesPapeisConfig = {
        'aldeão': 10,
        'vidente': 2,
        'médico': 2,
        'caçador': 2,
        'bruxa': 2,
        'aprendiz de vidente': 1,
        'pacifista': 2,
        'sacerdote': 1,
        'prefeito': 1,
        'guarda-costas': 2,
        'detetive': 3,
        'portador do amuleto': 1,
        'vidente de aura': 1,
        'príncipe bonitão': 2,
        'maçom': 3,
        'menininha': 1,
        'cientista maluco': 1,
        'caçador de cabeças': 1,
        'humano leproso': 2,
        'valentão': 2,
        'menino travesso': 1,
        'prostituta': 1,
        'vovó zangada': 1,
        'bêbado': 1,
        'idiota': 2,
        'pistoleiro': 1,
        'humano amaldiçoado': 1,
        'feiticeira': 1,
        'assassino em série': 1,
        'inquisidor': 1,
        'sósia': 1,
        'líder de seita': 1,
        'cupido': 1,
        'depressivo': 1,
        'necromante': 1,
        'piromaníaco': 1,
        'presidente': 1,
    };

    const chancesEspeciais = {
        'lobo alfa': 4,
        'lobo solitário': 8,
        'filhote de lobisomem': 8,
    };

    const processarLobisomens = () => {
        const sorteados = carregarSorteados();
        const jogadoresLobisomem = sorteados.filter(({ papel }) => papel === 'lobisomem');
    
        if (jogadoresLobisomem.length === 0) {
            alert('Nenhum jogador com papel de lobisomem encontrado.');
            return;
        }
    
        let resultadoEspeciais = [];
        if (jogadoresLobisomem.length >= 2) {
            jogadoresLobisomem.forEach(jogador => {
                if (Math.random() < 0.3) {
                    const papelEspecial = calcularSorteioLobisomem(chancesEspeciais);
                    resultadoEspeciais.push({ ...jogador, papel: papelEspecial });
                } else {
                    resultadoEspeciais.push(jogador);
                }
            });
    
            const lobisomemComum = jogadoresLobisomem.find(j => resultadoEspeciais.every(r => r.jogador !== j.jogador));
            if (!lobisomemComum) {
                resultadoEspeciais[0].papel = 'lobisomem';
            }
        } else {
            resultadoEspeciais = jogadoresLobisomem;
        }
        const novosSorteados = sorteados.filter(({ jogador }) => 
            !jogadoresLobisomem.some(lobisomem => lobisomem.jogador === jogador)
        );
    
        const atualizados = [...novosSorteados, ...resultadoEspeciais];
        salvarSorteados(atualizados);
    };
    
    const calcularLobisomens = (numJogadores) => {
        if (numJogadores <= 6) return 1;
        const maxLobisomens = Math.floor(numJogadores / 3.5);
        const extraLobisomens = Math.floor((numJogadores - 6) / 2);
        return Math.min(maxLobisomens, 1 + extraLobisomens);
    };

    //--------------------------------------

if (page === 'cadastro') {
    document.getElementById('salvar-sessao-ut').addEventListener('click', (event) => {
        const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
        if (jogadores.length < 2) {
            event.preventDefault();
            alert('Adicione ao menos 2 jogadores na sessão.')
        };
    });

    carregarJogadores();

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = nomeInput.value.trim();

    if (nome) {
        const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
        jogadores.push(nome);
        localStorage.setItem('jogadores', JSON.stringify(jogadores));

        carregarJogadores();
        nomeInput.value = '';
    } else {
        alert('Por favor, insira um nome.');
    }
    });

    document.getElementById('deletar-todos').addEventListener('click', () => {
        if (confirm('Tem certeza de que deseja excluir todos os jogadores?')) {
            deletarJogadores();
        }
    });
}

    //--------------------------------------

if (page === 'mestre') {
    
    const carregarJogadores = () => JSON.parse(localStorage.getItem('jogadores')) || [];
    const carregarPapeis = () => JSON.parse(localStorage.getItem('papeisSessao')) || [];

    const calcularSorteio = (chances, excluir = []) => {
        const chancesFiltradas = Object.entries(chances).filter(([papel]) => !excluir.includes(papel));
        const total = chancesFiltradas.reduce((sum, [, chance]) => sum + chance, 0);
        const random = Math.random() * total;
        let acumulado = 0;
        for (const [papel, chance] of chancesFiltradas) {
            acumulado += chance;
            if (random <= acumulado) {
                return papel;
            }
        }
    };

    const carregarSorteados = () => JSON.parse(localStorage.getItem('resultadoSorteio')) || [];
    const salvarSorteados = (sorteados) => localStorage.setItem('resultadoSorteio', JSON.stringify(sorteados));

    const calcularSorteioLobisomem = (chances) => {
        const total = Object.values(chances).reduce((sum, chance) => sum + chance, 0);
        const random = Math.random() * total;
        let acumulado = 0;
        for (const [papel, chance] of Object.entries(chances)) {
            acumulado += chance;
            if (random <= acumulado) {
                return papel;
            }
        }
    };

    const chancesEspeciais = {
        'lobo alfa': 4,
        'lobo solitário': 8,
        'filhote de lobisomem': 8,
    };

    const processarLobisomens = () => {
        const sorteados = carregarSorteados();
        const jogadoresLobisomem = sorteados.filter(({ papel }) => papel === 'lobisomem');

        if (jogadoresLobisomem.length === 0) {
            alert('Nenhum jogador com papel de lobisomem encontrado.');
            return;
        }

        let resultadoEspeciais = [];
        if (jogadoresLobisomem.length >= 2) {
            jogadoresLobisomem.forEach(jogador => {
                if (Math.random() < 0.3) {
                    const papelEspecial = calcularSorteioLobisomem(chancesEspeciais);
                    resultadoEspeciais.push({ ...jogador, papel: papelEspecial });
                } else {
                    resultadoEspeciais.push(jogador);
                }
            });

            const lobisomemComum = jogadoresLobisomem.find(j => resultadoEspeciais.every(r => r.jogador !== j.jogador));
            if (!lobisomemComum) {
                resultadoEspeciais[0].papel = 'lobisomem';
            }
        } else {
            resultadoEspeciais = jogadoresLobisomem;
        }
        const novosSorteados = sorteados.filter(({ jogador }) => 
            !jogadoresLobisomem.some(lobisomem => lobisomem.jogador === jogador)
        );

        const atualizados = [...novosSorteados, ...resultadoEspeciais];
        salvarSorteados(atualizados);

    };

    const calcularLobisomens = (numJogadores) => {
        if (numJogadores <= 6) return 1;
        const maxLobisomens = Math.floor(numJogadores / 3);
        const extraLobisomens = Math.floor((numJogadores - 6) / 2);
        return Math.min(maxLobisomens, 1 + extraLobisomens);
    };

    document.getElementById('sortear').addEventListener('click', () => {
        const jogadores = carregarJogadores();
        const papeisSelecionados = carregarPapeis();

        if (jogadores.length < 2 || papeisSelecionados.length < 2) {
            alert('Certifique-se de que há ao menos 2 jogadores e 2 papéis salvos.');
            return;
        }

        if (!papeisSelecionados.includes('lobisomem')) {
            alert('O papel "lobisomem" deve estar entre os papéis selecionados.');
            return;
        }

        const chancesPapeis = Object.fromEntries(
            Object.entries(chancesPapeisConfig).filter(([papel]) =>
                papeisSelecionados.includes(papel)
            )
        );

        const numLobisomens = calcularLobisomens(jogadores.length);

        const resultados = [];
        const restanteJogadores = [...jogadores];

        const lobisomensGarantidos = [];
        for (let i = 0; i < numLobisomens; i++) {
            const index = Math.floor(Math.random() * restanteJogadores.length);
            const lobisomemJogador = restanteJogadores.splice(index, 1)[0];

            resultados.push({ jogador: lobisomemJogador, papel: 'lobisomem' });
        }

        const lobisomensRestantes = lobisomensGarantidos.slice();
        lobisomensRestantes.forEach(lobisomem => {
            if (Math.random() < 0.5) { 
                const papelEspecial = calcularSorteio(chancesPapeis, ['lobisomem']);
                resultados.push({ jogador: lobisomemJogador, papel: papelEspecial });
            }
        
        });

        restanteJogadores.forEach(jogador => {
            const papelSorteado = calcularSorteio(chancesPapeis);
            resultados.push({ jogador, papel: papelSorteado });
        });

        localStorage.setItem('resultadoSorteio', JSON.stringify(resultados));
        processarLobisomens();

        window.location.href = 'noite.html';
    });
}

});
