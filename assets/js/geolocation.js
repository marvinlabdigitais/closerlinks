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
        console.log(`📍 Localização atualizada: ${city}, ${state}`);
    }
    if (locContainer) {
        locContainer.classList.remove('loc-loading');
    }
}

// Múltiplas APIs para garantir precisão
async function detectUserLocation() {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    
    if (!locationElement) return;

    // Mostrar loading inicialmente
    if (locContainer) {
        locContainer.classList.add('loc-loading');
    }
    updateLocationDisplay('Localizando...', '');
    
    // Lista de APIs para testar (ordem de preferência - apenas as que funcionam)
    const apis = [
        {
            name: 'ipinfo.io',
            url: 'https://ipinfo.io/json',
            timeout: 2000,
            parse: (data) => ({
                city: data.city,
                state: getStateCode(data.region)
            })
        },
        {
            name: 'ipapi.com',
            url: 'https://ipapi.com/api/v1?access_key=0e8f6c6e5b3d4b7f8c9e0f1a2b3c4d5e',
            timeout: 2500,
            parse: (data) => ({
                city: data.city,
                state: getStateCode(data.region_name)
            })
        },
        {
            name: 'geolocation-db.com',
            url: 'https://geolocation-db.com/json/',
            timeout: 2000,
            parse: (data) => ({
                city: data.city,
                state: getStateCode(data.state)
            })
        },
        {
            name: 'ip.nf',
            url: 'https://ip.nf/me.json',
            timeout: 1500,
            parse: (data) => ({
                city: data.ip.city,
                state: getStateCode(data.ip.region)
            })
        }
    ];
    
    // Tentar cada API até conseguir uma localização válida
    for (const api of apis) {
        try {
            console.log(`🔍 Testando API: ${api.name}`);
            
            const response = await fetch(api.url, {
                headers: { 
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; LocationService/1.0)'
                },
                signal: AbortSignal.timeout(api.timeout)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`📡 Resposta da ${api.name}:`, data);
                
                const location = api.parse(data);
                
                if (location.city && location.state && 
                    location.city !== 'undefined' && location.state !== 'undefined' &&
                    location.city.trim() !== '' && location.state.trim() !== '') {
                    
                    userLocation = { city: location.city, state: location.state };
                    
                    console.log(`✅ Localização encontrada via ${api.name}: ${location.city}, ${location.state}`);
                    
                    // Atualizar display
                    setTimeout(() => {
                        updateLocationDisplay(location.city, location.state);
                    }, 200);
                    
                    return; // Sucesso! Parar de tentar outras APIs
                } else {
                    console.log(`❌ ${api.name} retornou dados inválidos:`, location);
                }
            } else {
                console.log(`❌ ${api.name} retornou status ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Erro na ${api.name}:`, error.message);
        }
    }
    
    // Se chegou aqui, nenhuma API funcionou
    console.log('🚨 Todas as APIs falharam, usando localização padrão');
    updateLocationDisplay(userLocation.city, userLocation.state);
}

// Inicializar após carregamento do DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserLocation);
} else {
    detectUserLocation();
}