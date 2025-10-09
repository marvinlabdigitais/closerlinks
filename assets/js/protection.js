// Arquivo principal ofuscado com configurações sensíveis
(function() {
    'use strict';
    
    // Configurações ofuscadas
    const _0x2f4c = {
        'pixel': atob('MTkzMDY4NjEzMDc2MzIzOQ=='), // Facebook Pixel ID em base64
        'api_key': '', // Chaves de API removidas
        'endpoints': {
            'privacy': atob('aHR0cHM6Ly9zdGVsbGFiZWdoaW5pLmNvbS9wcml2YWN5'),
            'redirect': atob('aHR0cHM6Ly9zdGVsbGFiZWdoaW5pLmNvbS9yZWRpcmVjdA==')
        }
    };
    
    // Anti-debugging (muito suave para Instagram bio)
    setInterval(function() {
        // Detectar se está vindo do Instagram
        const isInstagramBrowser = navigator.userAgent.includes('Instagram') || 
                                  window.location.href.includes('instagram') ||
                                  document.referrer.includes('instagram');
        
        if (window.console && (console.firebug || (console.table && /firebug/i.test(console.table())))) {
            // Não fazer nada se for mobile ou Instagram
            if (!navigator.userAgent.match(/iPhone|iPad|Android|Mobile/i) && !isInstagramBrowser) {
                // Apenas log no console, não redirecionar
                console.warn('⚠️ DevTools detectado');
            }
        }
    }, 10000); // Intervalo bem maior
    
    // Detectar DevTools (apenas para desktop não-Instagram)
    let devtools = {open: false, orientation: null};
    const isMobile = navigator.userAgent.match(/iPhone|iPad|Android|Mobile/i);
    const isInstagramBrowser = navigator.userAgent.includes('Instagram');
    
    // Pular completamente se for mobile ou Instagram
    if (!isMobile && !isInstagramBrowser) {
        setInterval(function() {
            const threshold = 160;
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    // Apenas log, não bloquear completamente
                    console.warn('⚠️ DevTools detectado');
                }
            } else {
                devtools.open = false;
            }
        }, 2000); // Intervalo menor apenas para desktop
    }
    
    // Desabilitar clique direito (apenas desktop)
    if (!navigator.userAgent.match(/iPhone|iPad|Android|Mobile/i) && !navigator.userAgent.includes('Instagram')) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Desabilitar F12, Ctrl+Shift+I, Ctrl+U (apenas desktop)
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 123 || // F12
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                (e.ctrlKey && e.keyCode === 85)) { // Ctrl+U
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Exportar configurações para uso global
    window._config = _0x2f4c;
})();