const Aluno = {
    carregarSalasDisponiveis: async function() {
        const res = await fetch(`${CONFIG.API_URL}/api/salas/listar`);
        const data = await res.json();
        const container = document.getElementById("lista-salas");
        
        if (!data.sucesso || data.salas.length === 0) {
            container.innerHTML = "<p>Nenhuma sala encontrada no momento.</p>";
            return;
        }

        container.innerHTML = data.salas.map(sala => `
            <div class="card">
                <strong>Igreja:</strong> ${sala.nome_igreja} <br>
                <strong>Matéria:</strong> ${sala.nome_materia} <br>
                <strong>Professor:</strong> ${sala.professor_nome} <br>
                <button onclick="Aluno.entrarNaSala('${sala.id}')">Selecionar esta Sala</button>
            </div>
        `).join('');
    },

    entrarNaSala: async function(sala_id) {
        const sessao = Auth.obterSessao();
        const res = await fetch(`${CONFIG.API_URL}/api/salas/entrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ aluno_id: sessao.usuario.id, sala_id })
        });
        const data = await res.json();
        
        if (data.sucesso) {
            // Atualiza a sessão local com a sala escolhida
            sessao.salaMatriculada = sala_id;
            localStorage.setItem("edb_sessao", JSON.stringify(sessao));
            alert("Matriculado na sala com sucesso!");
            window.location.reload();
        } else {
            alert("Erro: " + data.erro);
        }
    }
};