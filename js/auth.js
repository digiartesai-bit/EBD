const Auth = {
    fazerLogin: async function(email, senha) {
        try {
            const res = await fetch(`${CONFIG.API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });
            const data = await res.json();
            
            if (data.sucesso) {
                // Guarda o usuário e define expiração de 7 dias na sessão
                const sessao = {
                    usuario: data.usuario,
                    salaMatriculada: data.salaMatriculada,
                    expiraEm: new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
                };
                localStorage.setItem("edb_sessao", JSON.stringify(sessao));
                return { sucesso: true };
            }
            return { sucesso: false, erro: data.erro };
        } catch (err) {
            return { sucesso: false, erro: "Erro de conexão com o servidor." };
        }
    },

    obterSessao: function() {
        const sessaoStr = localStorage.getItem("edb_sessao");
        if (!sessaoStr) return null;

        const sessao = JSON.parse(sessaoStr);
        // Verifica se a sessão expirou
        if (new Date().getTime() > sessao.expiraEm) {
            this.sair();
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            return null;
        }
        return sessao;
    },

    fazerRegistro: async function(nome, email, senha, tipo) {
        const res = await fetch(`${CONFIG.API_URL}/api/registrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, tipo })
        });
        return await res.json();
    },

    sair: function() {
        localStorage.removeItem("edb_sessao");
        window.location.reload();
    }
};