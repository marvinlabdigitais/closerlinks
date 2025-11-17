const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const envFilePath = path.join(projectRoot, '.env');
const outputPath = path.join(projectRoot, 'assets', 'js', 'runtime-config.js');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return acc;
    }

    const delimiterIndex = trimmed.indexOf('=');
    if (delimiterIndex === -1) {
      return acc;
    }

    const key = trimmed.slice(0, delimiterIndex).trim();
    const value = trimmed.slice(delimiterIndex + 1).trim().replace(/^"|"$/g, '');
    if (key) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function resolveValue(key, localEnv = {}) {
  if (process.env[key]) {
    return process.env[key];
  }
  return localEnv[key] || '';
}

function generateRuntimeConfig() {
  const localEnv = parseEnvFile(envFilePath);
  const pixelId = resolveValue('FB_PIXEL_ID', localEnv);
  const apiToken = resolveValue('FB_API_TOKEN', localEnv);

  const configObject = {
    pixelId,
    apiToken
  };

  const fileContent = `window.__RUNTIME_CONFIG__ = ${JSON.stringify(configObject, null, 2)};\n`;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, fileContent, 'utf8');

  console.log('✅ runtime-config gerado em', outputPath);
  if (!pixelId) {
    console.warn('⚠️ FB_PIXEL_ID não definido. Defina em .env ou nas variáveis do Render.');
  }
  if (!apiToken) {
    console.warn('⚠️ FB_API_TOKEN não definido. Defina em .env ou nas variáveis do Render.');
  }
}

generateRuntimeConfig();
