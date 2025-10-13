let userLocation = { city: '', state: '' };

function getStateCode(stateName) {
    if (!stateName) return 'SP';
    if (stateName.length === 2) return stateName.toUpperCase();
    
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
    }
    if (locContainer) {
        locContainer.classList.remove('loc-loading');
    }
}

function tryMaxMindGeoIP2() {
    return new Promise((resolve, reject) => {
        if (typeof geoip2 === 'undefined') {
            reject(new Error('MaxMind GeoIP2 script não carregado'));
            return;
        }
        
        const onSuccess = (geoipResponse) => {
            try {
                const city = geoipResponse.city.names.pt || geoipResponse.city.names.en || 'Não disponível';
                const state = geoipResponse.subdivisions && geoipResponse.subdivisions[0] 
                    ? (geoipResponse.subdivisions[0].names.pt || geoipResponse.subdivisions[0].names.en || geoipResponse.subdivisions[0].iso_code)
                    : 'SP';
                
                if (city && city !== 'Não disponível') {
                    resolve({
                        city: city,
                        state: getStateCode(state)
                    });
                } else {
                    reject(new Error('Dados inválidos da MaxMind'));
                }
            } catch (error) {
                reject(error);
            }
        };
        
        const onError = (error) => {
            reject(new Error(`MaxMind: ${error.code} - ${error.error}`));
        };
        
        try {
            geoip2.city(onSuccess, onError);
        } catch (error) {
            reject(error);
        }
    });
}

async function detectUserLocation() {
    const locationElement = document.getElementById('location-text');
    const locContainer = document.querySelector('.loc');
    
    if (!locationElement) return;

    if (locContainer) {
        locContainer.classList.add('loc-loading');
    }
    
    try {
        const location = await tryMaxMindGeoIP2();
        if (location && location.city && location.state) {
            userLocation = { city: location.city, state: location.state };
            updateLocationDisplay(location.city, location.state);
            return;
        }
    } catch (error) {
        // Fallback para APIs gratuitas
    }
    
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
    
    for (const api of apis) {
        try {
            const response = await fetch(api.url, {
                headers: { 
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; LocationService/1.0)'
                },
                signal: AbortSignal.timeout(api.timeout)
            });
            
            if (response.ok) {
                const data = await response.json();
                const location = api.parse(data);
                
                if (location.city && location.state && 
                    location.city !== 'undefined' && location.state !== 'undefined' &&
                    location.city.trim() !== '' && location.state.trim() !== '') {
                    
                    userLocation = { city: location.city, state: location.state };
                    updateLocationDisplay(location.city, location.state);
                    return;
                }
            }
        } catch (error) {
            continue;
        }
    }
    
    updateLocationDisplay('Localização', 'não detectada');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserLocation);
} else {
    detectUserLocation();
}