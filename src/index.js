// Cloudflare Workers handler para servir sitio estático Next.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Redireccionar root a index.html
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    // Agregar .html si no tiene extensión
    if (!pathname.includes('.') && pathname !== '/') {
      pathname = pathname + '.html';
    }
    
    try {
      // Intentar servir desde assets
      const asset = await getAssetFromKV(
        {
          request: new Request(url.origin + pathname, request),
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
        }
      );
      
      // Headers de respuesta
      const response = new Response(asset.body, asset);
      response.headers.set('Cache-Control', 'max-age=86400');
      
      return response;
    } catch (e) {
      // Si no encuentra el archivo, servir index.html (SPA fallback)
      try {
        const asset = await getAssetFromKV(
          {
            request: new Request(url.origin + '/index.html', request),
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          }
        );
        
        return new Response(asset.body, asset);
      } catch (e) {
        return new Response('Archivo no encontrado', { status: 404 });
      }
    }
  },
};

// Función helper para getAssetFromKV
async function getAssetFromKV(event, options) {
  // Implementación básica para manejar assets
  const url = new URL(event.request.url);
  let assetPath = url.pathname;
  
  if (assetPath === '/') assetPath = '/index.html';
  
  const asset = await options.ASSET_NAMESPACE.get(assetPath);
  if (!asset) {
    throw new Error('Asset not found');
  }
  
  return new Response(asset, {
    headers: {
      'Content-Type': getContentType(assetPath),
    },
  });
}

// Función para determinar Content-Type
function getContentType(path) {
  const extension = path.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'woff2': 'font/woff2',
    'woff': 'font/woff',
    'ttf': 'font/ttf',
  };
  
  return types[extension] || 'application/octet-stream';
}