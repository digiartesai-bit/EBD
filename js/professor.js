const Professor = {
    inicializarPainel: function(usuario) {
        document.getElementById("prof-nome").innerText = usuario.nome;
    },

    criarSala: async function() {
        const sessao = Auth.obterSessao();
        const nome_igreja = document.getElementById("sala-igreja").value;
        const nome_materia = document.getElementById("sala-materia").value;

        if (!nome_igreja || !nome_materia) {
            alert("Preencha todos os campos da sala.");
            return;
        }

        const res = await fetch(`${CONFIG.API_URL}/api/salas/criar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nome_igreja, 
                nome_materia, 
                professor_id: sessao.usuario.id 
            })
        });
        const data = await res.json();
        
        if (data.sucesso) {
            alert("Sala criada com sucesso!");
            document.getElementById("sala-igreja").value = "";
            document.getElementById("sala-materia").value = "";
        } else {
            alert("Erro: " + data.erro);
        }
    }
};