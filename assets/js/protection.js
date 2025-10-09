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
    
    // Anti-debugging
    setInterval(function() {
        if (window.console && (console.firebug || console.table && /firebug/i.test(console.table()))) {
            window.location.href = 'about:blank';
        }
    }, 1000);
    
    // Detectar DevTools
    let devtools = {open: false, orientation: null};
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // Redirecionar ou limpar página quando DevTools abrir
                document.body.style.display = 'none';
                setTimeout(() => {
                    document.body.innerHTML = '<h1>Acesso Negado</h1>';
                }, 500);
            }
        } else {
            devtools.open = false;
            document.body.style.display = 'block';
        }
    }, 500);
    
    // Desabilitar clique direito
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Desabilitar F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
            (e.ctrlKey && e.keyCode === 85)) { // Ctrl+U
            e.preventDefault();
            return false;
        }
    });
    
    // Exportar configurações para uso global
    window._config = _0x2f4c;
})();