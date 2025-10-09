let userLocation = { city: 'São Paulo', state: 'SP' };

function getStateCode(stateName) {
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
        console.log(`📍 Localização exibida: ${city}, ${state}`);
    }
    if (locContainer) {
        locContainer.classList.remove('loc-loading');
    }
}

// APIs otimizadas para velocidade e precisão (Brasil)
const geoAPIs = [
    {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        timeout: 2000,
        parser: (data) => ({
            city: data.city,
            state: data.region_code || getStateCode(data.region)
        })
    },
    {
        name: 'ip-api.com',
        url: 'https://ip-api.com/json/?fields=city,regionName,region,country&lang=pt-BR',
        timeout: 3000,
        parser: (data) => ({
            city: data.city,
            state: getStateCode(data.regionName)
        })
    },
    {
        name: 'ipgeolocation.io',
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=',
        timeout: 2500,
        parser: (data) => ({
            city: data.city,
            state: data.state_code || getStateCode(data.state_prov)
        })
    },
    {
        name: 'ipinfo.io',
        url: 'https://ipinfo.io/json',
        timeout: 3000,
        parser: (data) => ({
            city: data.city,
            state: data.region
        })
    }
];

async function fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function detectUserLocation() {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    
    if (!locationElement) {
        console.warn('⚠️ Elemento de localização não encontrado');
        return;
    }

    console.log('📍 Detectando localização...');
    
    // Primeiro, mostrar localização padrão imediatamente
    updateLocationDisplay(userLocation.city, userLocation.state);
    
    // Depois tentar detectar a real
    for (const api of geoAPIs) {
        try {
            console.log(`🔍 Tentando ${api.name}...`);
            
            const response = await fetchWithTimeout(api.url, api.timeout);
            
            if (!response.ok) {
                console.warn(`⚠️ ${api.name}: HTTP ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            const location = api.parser(data);
            
            if (location.city && location.state && 
                location.city !== 'undefined' && location.state !== 'undefined') {
                
                userLocation = { 
                    city: location.city, 
                    state: location.state 
                };
                
                updateLocationDisplay(location.city, location.state);
                console.log(`✅ Localização detectada via ${api.name}: ${location.city}, ${location.state}`);
                return; // Sucesso, parar tentativas
            }
        } catch (error) {
            console.warn(`⚠️ ${api.name} falhou:`, error.message);
            continue;
        }
    }
    
    console.warn('⚠️ Todas as APIs falharam, mantendo localização padrão');
}

// Inicializar o mais rápido possível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserLocation);
} else {
    detectUserLocation();
}