// Sistema de verificação de domínio
(function() {
    'use strict';
    
    // Domínios permitidos (ofuscados)
    const allowedDomains = [
        atob('Y2xvc2VybGlua3MubWU='), // closerlinks.me
        atob('bG9jYWxob3N0'), // localhost
        atob('MTI3LjAuMC4x') // 127.0.0.1
    ];
    
    // Verificar se está rodando no domínio correto
    function checkDomain() {
        const currentDomain = window.location.hostname;
        
        if (!allowedDomains.includes(currentDomain) && 
            !currentDomain.includes('localhost') && 
            !currentDomain.includes('127.0.0.1')) {
            
            // Se não for domínio permitido, redirecionar ou bloquear
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: #000;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Arial, sans-serif;
                    z-index: 99999;
                ">
                    <div style="text-align: center;">
                        <h1>🚫 Acesso Negado</h1>
                        <p>Este conteúdo só pode ser acessado no domínio oficial.</p>
                        <p style="opacity: 0.7; font-size: 12px;">Domain: ${currentDomain}</p>
                    </div>
                </div>
            `;
            
            // Bloquear scripts
            Array.from(document.scripts).forEach(script => {
                script.remove();
            });
            
            return false;
        }
        return true;
    }
    
    // Executar verificação
    if (!checkDomain()) {
        return;
    }
    
    // Verificação contínua (caso alguém mude o domínio via console)
    setInterval(checkDomain, 5000);
    
})();