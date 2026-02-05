#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_FILE = path.join(__dirname, '../src/config/technologies.ts');

function toggleTechSections(enable = true) {
  try {
    // Leer configuración actual
    let configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    
    // Actualizar valores
    configContent = configContent.replace(
      /showDafelSection:\s*(true|false)/,
      `showDafelSection: ${enable}`
    );
    
    configContent = configContent.replace(
      /showFrameworkSection:\s*(true|false)/,
      `showFrameworkSection: ${enable}`
    );
    
    // Actualizar version para cache busting
    const currentTime = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '');
    configContent = configContent.replace(
      /configVersion:\s*'[^']*'/,
      `configVersion: '${currentTime}'`
    );
    
    // Escribir configuración actualizada
    fs.writeFileSync(CONFIG_FILE, configContent);
    
    console.log(`🔧 Secciones Technologies ${enable ? 'HABILITADAS' : 'DESHABILITADAS'}`);
    console.log(`📦 Construyendo proyecto...`);
    
    // Build automático
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log(`🚀 Desplegando a Cloudflare Pages...`);
    
    // Deploy automático
    execSync('wrangler pages deploy out --project-name=pages-dafel', { stdio: 'inherit' });
    
    console.log(`✅ ¡Completado! Las secciones Technologies están ${enable ? 'HABILITADAS' : 'DESHABILITADAS'} en producción.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Parse argumentos de línea de comandos
const command = process.argv[2];

if (command === 'enable' || command === 'habilitar') {
  toggleTechSections(true);
} else if (command === 'disable' || command === 'deshabilitar') {
  toggleTechSections(false);
} else {
  console.log(`
🔧 Uso del comando:

  npm run tech enable      # Habilitar secciones Technologies
  npm run tech disable     # Deshabilitar secciones Technologies
  
  node scripts/toggle-tech.js habilitar    # Alternativamente
  node scripts/toggle-tech.js deshabilitar
  
📦 El comando automaticamente:
  ✓ Actualiza la configuración
  ✓ Construye el proyecto  
  ✓ Despliega a producción
`);
}