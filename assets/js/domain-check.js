// Sistema de verificação de domínio
(function() {
    'use strict';
    
    // Domínios permitidos (ofuscados)
    const allowedDomains = [
        atob('Y2xvc2VybGlua3MubWU='), // closerlinks.me
        atob('bG9jYWxob3N0'), // localhost
        atob('MTI3LjAuMC4x'), // 127.0.0.1
        'onrender.com' // Para deploy no Render
    ];
    
    // Verificar se está rodando no domínio correto
    function checkDomain() {
        const currentDomain = window.location.hostname;
        
        // Sempre permitir se estiver vindo do Instagram ou mobile
        const isInstagramBrowser = navigator.userAgent.includes('Instagram') || 
                                  document.referrer.includes('instagram') ||
                                  window.location.href.includes('instagram');
        const isMobile = navigator.userAgent.match(/iPhone|iPad|Android|Mobile/i);
        
        if (isInstagramBrowser || isMobile) {
            console.log('📱 Acesso via Instagram/Mobile - Permitido');
            return true;
        }
        
        // Permitir desenvolvimento e produção
        const isDev = currentDomain.includes('localhost') || 
                     currentDomain.includes('127.0.0.1') || 
                     currentDomain.includes('192.168.') ||
                     window.location.protocol === 'file:';
        
        // Permitir domínios de produção
        const isProd = allowedDomains.some(domain => 
            currentDomain.includes(domain) || 
            currentDomain.includes('closerlinks') ||
            currentDomain.includes('onrender')
        );
        
        // Sempre permitir - bio do Instagram precisa funcionar sempre
        if (isDev || isProd) {
            return true;
        }
        
        // Para outros casos, apenas avisar mas permitir (bio do Instagram)
        console.warn('⚠️ Domínio não reconhecido:', currentDomain);
        return true; // Sempre permitir para bio do Instagram
    }
    
    // Executar verificação
    checkDomain();
    
    // Verificação contínua mais suave
    setInterval(checkDomain, 30000); // A cada 30 segundos apenas
    
})();