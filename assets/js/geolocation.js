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
    
    return stateMap[stateName] || stateMap[stateName.trim()] || 'SP';
}

function updateLocationDisplay(city, state) {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    
    if (locationElement) {
        locationElement.textContent = `${city}, ${state}`;
        console.log(`📍 Localização exibida: ${city}, ${state}`);
    }
    if (locContainer) {
        locContainer.classList.remove('loc-loading');
    }
}

// Função para validar se dados são confiáveis
function isValidLocation(city, state) {
    if (!city || !state) return false;
    if (city === 'undefined' || state === 'undefined') return false;
    if (city.length < 2 || state.length < 2) return false;
    
    // Lista de cidades problemáticas conhecidas de IP (região metropolitana)
    const problematicCities = [
        'diadema', 'osasco', 'guarulhos', 'são bernardo do campo', 
        'santo andré', 'mauá', 'ribeirão pires', 'são caetano do sul'
    ];
    
    if (problematicCities.includes(city.toLowerCase())) {
        console.warn(`⚠️ Cidade ${city} pode ser imprecisa via IP`);
        return false;
    }
    
    return true;
}

async function detectUserLocation() {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    
    if (!locationElement) {
        console.warn('⚠️ Elemento de localização não encontrado');
        return;
    }

    console.log('📍 Detectando localização...');
    
    // Mostrar localização padrão imediatamente (por 1 segundo)
    updateLocationDisplay(userLocation.city, userLocation.state);
    
    // Aguardar um pouco antes de tentar detectar (mais natural)
    setTimeout(async () => {
        // Tentar uma API confiável apenas
        try {
            console.log('🔍 Detectando localização real...');
            
            const response = await fetch('https://ipapi.co/json/', {
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(3000)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('📡 Dados recebidos:', data);
                
                let city = data.city;
                let state = getStateCode(data.region_code || data.region);
                
                // Validar se os dados são confiáveis
                if (isValidLocation(city, state)) {
                    // Só atualizar se for diferente do padrão
                    if (city !== userLocation.city || state !== userLocation.state) {
                        userLocation = { city, state };
                        // Transição suave para nova localização
                        setTimeout(() => {
                            updateLocationDisplay(city, state);
                            console.log(`✅ Localização atualizada: ${city}, ${state}`);
                        }, 500);
                    }
                    return;
                } else {
                    console.warn(`⚠️ Dados não confiáveis, mantendo padrão`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro na detecção, mantendo padrão:', error.message);
        }
        
        console.log('📍 Mantendo São Paulo, SP (padrão)');
    }, 1500); // Aguardar 1.5 segundos antes de tentar detectar
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserLocation);
} else {
    detectUserLocation();
}