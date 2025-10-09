let userLocation = { city: 'São Paulo', state: 'SP' };

function getStateCode(stateName) {
    if (!stateName) return 'SP';
    
    // Se já é sigla (2 caracteres), retornar
    if (stateName.length === 2) {
        return stateName.toUpperCase();
    }
    
    const stateMap = {
        'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
        'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
        'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
        'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
        'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
        'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC',
        'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO'
    };
    return stateMap[stateName] || stateName;
}

function updateLocationDisplay(city, state) {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    
    if (locationElement) {
        locationElement.textContent = `${city}, ${state}`;
        console.log(`📍 ${city}, ${state}`);
    }
    if (locContainer) {
        locContainer.classList.remove('loc-loading');
    }
}

// API super rápida - apenas 1 tentativa
async function detectUserLocation() {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    
    if (!locationElement) return;

    // Mostrar padrão imediatamente
    updateLocationDisplay(userLocation.city, userLocation.state);
    
    try {
        // API mais rápida com timeout de 1 segundo
        const response = await fetch('https://freeipapi.com/api/json', {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(1000)
        });
        
        if (response.ok) {
            const data = await response.json();
            
            let city = data.cityName || data.city;
            let state = getStateCode(data.regionName || data.region);
            
            if (city && state && city !== 'undefined' && state !== 'undefined') {
                userLocation = { city, state };
                
                // Atualizar após um delay pequeno para suavizar
                setTimeout(() => {
                    updateLocationDisplay(city, state);
                }, 300);
                return;
            }
        }
    } catch (error) {
        console.log('📍 Usando localização padrão');
    }
    
    // Fallback rápido apenas se necessário
    try {
        const response = await fetch('https://ipapi.co/json/', {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(800)
        });
        
        if (response.ok) {
            const data = await response.json();
            
            let city = data.city;
            let state = getStateCode(data.region_code || data.region);
            
            if (city && state && city !== 'undefined' && state !== 'undefined') {
                userLocation = { city, state };
                setTimeout(() => {
                    updateLocationDisplay(city, state);
                }, 300);
            }
        }
    } catch (error) {
        console.log('📍 Mantendo São Paulo, SP');
    }
}

// Inicializar após carregamento do DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserLocation);
} else {
    detectUserLocation();
}