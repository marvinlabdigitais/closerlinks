// Configuração ofuscada
const config = (function() {
    const _0x1a2b = atob('MTkzMDY4NjEzMDc2MzIzOQ=='); // Facebook Pixel ID ofuscado
    return {
        pixelId: _0x1a2b,
        sendPageView: !0,
        sendViewContent: !0,
        sendScrollTracking: !0,
        sendTimeOnPage: !0,
        engagementTimer: 0xea60 // 60000 em hex
    };
})();
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function initializeFacebookPixel() {
    !function(f,b,e,v,n,t,s) {
        if(f.fbq) return;
        n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
        };
        if(!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
    }(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
    const userData = collectUserData();
    fbq('init', config.pixelId, userData);
    console.log('✅ Facebook Pixel inicializado');
}
function collectUserData() {
    const fbc = getCookie('_fbc');
    const fbp = getCookie('_fbp');
    const userData = {};
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;
    let userId = getCookie('user_id');
    if (!userId) {
        userId = generateUUID();
        document.cookie = `user_id=${userId}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    }
    userData.external_id = userId;
    return userData;
}
const eventsTracked = {};
function trackEvent(eventName, parameters = {}) {
    if (eventsTracked[eventName]) return;
    eventsTracked[eventName] = true;
    try {
        fbq('track', eventName, parameters);
        console.log(`📊 Evento rastreado: ${eventName}`, parameters);
    } catch (error) {
        console.warn('❌ Erro ao rastrear evento:', error);
    }
}
function trackCustomEvent(eventName, parameters = {}) {
    try {
        fbq('trackCustom', eventName, parameters);
        console.log(`📊 Evento customizado: ${eventName}`, parameters);
    } catch (error) {
        console.warn('❌ Erro ao rastrear evento customizado:', error);
    }
}
function setupScrollTracking() {
    if (!config.sendScrollTracking) return;
    const scrollMilestones = [25, 50, 75, 90];
    const trackedScrolls = {};
    function handleScroll() {
        const scrollPercent = Math.round(
            (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
        );
        scrollMilestones.forEach(milestone => {
            if (scrollPercent >= milestone && !trackedScrolls[milestone]) {
                trackedScrolls[milestone] = true;
                trackCustomEvent(`Scroll_${milestone}`);
            }
        });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
}
function setupTimeTracking() {
    if (!config.sendTimeOnPage) return;
    setTimeout(() => {
        trackCustomEvent('TimeEngagement_1min');
    }, config.engagementTimer);
}
function setupLinkTracking() {
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (!link) return;
        const href = link.href;
        if (!href) return;
        if (!href.includes(window.location.hostname)) {
            trackCustomEvent('ExternalLink', {
                link_url: href,
                link_text: link.textContent.trim()
            });
        }
        if (href.includes('wa.me') || href.includes('whatsapp')) {
            trackEvent('Contact', { contact_method: 'whatsapp' });
        }
        if (href.includes('t.me') || href.includes('telegram')) {
            trackEvent('Contact', { contact_method: 'telegram' });
        }
    });
}
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    function init() {
        console.log('🚀 Inicializando tracking...');
        initializeFacebookPixel();
        setTimeout(() => {
            if (config.sendPageView) {
                trackEvent('PageView');
            }
            if (config.sendViewContent) {
                trackEvent('ViewContent');
            }
        }, 100);
        setupScrollTracking();
        setupTimeTracking();
        setupLinkTracking();
        console.log('✅ Tracking configurado com sucesso!');
    }
})();