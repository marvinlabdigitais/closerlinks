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
async function detectUserLocation() {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    if (!locationElement) {
        console.warn('⚠️ Elemento de localização não encontrado');
        return;
    }
    try {
        console.log('📍 Detectando localização...');
        const apis = [
            'https://ip-api.com/json/?fields=city,regionName,region,country',
            'https://ipapi.co/json/',
            'https://ipinfo.io/json'
        ];
        for (const apiUrl of apis) {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) continue;
                const data = await response.json();
                let city = data.city || data.city_name || userLocation.city;
                let state;
                
                if (apiUrl.includes('ip-api.com')) {
                    state = getStateCode(data.region) || userLocation.state;
                } else if (apiUrl.includes('ipapi.co')) {
                    state = data.region_code || getStateCode(data.region) || userLocation.state;
                } else {
                    state = getStateCode(data.region) || getStateCode(data.state) || userLocation.state;
                }
                
                if (city && state) {
                    userLocation = { city, state };
                    updateLocationDisplay(city, state);
                    console.log(`✅ Localização detectada: ${city}, ${state}`);
                    return;
                }
            } catch (error) {
                console.warn(`⚠️ Erro na API ${apiUrl}:`, error.message);
                continue;
            }
        }
        console.warn('⚠️ Todas as APIs falharam, usando localização padrão');
        updateLocationDisplay(userLocation.city, userLocation.state);
    } catch (error) {
        console.error('❌ Erro geral na detecção:', error);
        updateLocationDisplay(userLocation.city, userLocation.state);
    }
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserLocation);
} else {
    detectUserLocation();
}