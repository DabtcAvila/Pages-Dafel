# Dafel Technologies - Static Marketing Site

Este es el sitio web estático optimizado para **Cloudflare Pages** de Dafel Technologies, una consultora especializada en actuaría y beneficios corporativos.

## 🚀 Características

- ✅ **Next.js 14** con static export
- ✅ **Optimización SEO/AEO máxima**
- ✅ **Performance 95-100/100** PageSpeed
- ✅ **Schema.org markup** completo
- ✅ **Cloudflare Pages** ready
- ✅ **Responsive design**
- ✅ **TypeScript**
- ✅ **TailwindCSS**
- ✅ **Framer Motion**

## 🔧 Configuración para Cloudflare Pages

### Build Settings:
- **Framework preset:** Next.js (Static HTML Export)
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Root directory:** `/` (default)
- **Node.js version:** `20.x`

### Environment Variables:
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://dafel.com.mx
```

### Dominios:
- **Producción:** `dafel.com.mx`
- **Preview:** `*.pages.dev`

## 🏗️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Verificar output estático
cd out && npx serve .
```

## 📁 Estructura

```
src/
├── app/
│   ├── layout.tsx          # Layout principal con SEO
│   └── page.tsx            # Página principal
├── components/             # Componentes React
├── contexts/              # Contextos (LanguageContext)
├── styles/
│   └── globals.css        # Estilos globales
public/
├── robots.txt             # SEO robots
├── sitemap.xml           # Sitemap XML
├── _headers              # Headers Cloudflare
├── _redirects           # Redirects Cloudflare
└── ...                  # Assets estáticos
```

## 🎯 SEO/AEO Optimizado

### Palabras Clave Target:
- Consultoría actuarial
- Beneficios corporativos
- NIF D-3, IFRS-19, US GAAP
- Pasivos laborales
- Prima de antigüedad
- Planes de pensiones

### Schema.org Markup:
- Organization
- ProfessionalService
- LocalBusiness

### Performance:
- Static export para máximo rendimiento
- Lazy loading de imágenes
- Code splitting automático
- Compresión Cloudflare

## 🚀 Deploy a Cloudflare Pages

1. **Conectar repositorio** en Cloudflare Pages
2. **Configurar build settings** según arriba
3. **Agregar variables de entorno**
4. **Deploy automático** en push a `main`

## 🔗 URLs Importantes

- **Sitio:** https://dafel.com.mx
- **Sitemap:** https://dafel.com.mx/sitemap.xml
- **Robots:** https://dafel.com.mx/robots.txt

---

**Desarrollado para Dafel Technologies**  
Consultoría Actuarial y Beneficios Corporativos