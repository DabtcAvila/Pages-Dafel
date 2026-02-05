# 📧 CONFIGURACIÓN EMAILJS PARA DAFEL

## 🚀 **PASOS PARA ACTIVAR EMAILJS (5 minutos)**

### **1. Registrarse en EmailJS (Gratis)**
- Ve a: https://www.emailjs.com/
- Clic en "Sign Up" 
- **Plan gratuito: 200 emails/mes** (suficiente para tu volumen)

### **2. Conectar tu Gmail/Email**
- En el dashboard, ve a **"Email Services"**
- Clic **"Add New Service"**
- Selecciona **"Gmail"** (recomendado)
- Autoriza el acceso a tu cuenta `davidfernando@dafel.com.mx`
- Copia el **Service ID** (ej: `service_abc123`)

### **3. Crear Template de Email**
- Ve a **"Email Templates"** 
- Clic **"Create New Template"**
- Usa este template:

```
Subject: Nueva Cotización - {{company}}

Hola David,

Nueva solicitud de cotización desde dafel.com.mx:

{{message}}

---
Enviado automáticamente desde el sitio web.
```

- Copia el **Template ID** (ej: `template_xyz789`)

### **4. Obtener Public Key**
- Ve a **"Account" > "General"**
- Copia tu **Public Key** (ej: `abc123xyz`)

### **5. Actualizar Configuración**
Edita el archivo: `/src/config/contact.ts`

```typescript
emailjs: {
  enabled: true,
  serviceId: 'TU_SERVICE_ID',     // Del paso 2
  templateId: 'TU_TEMPLATE_ID',   // Del paso 3  
  publicKey: 'TU_PUBLIC_KEY'      // Del paso 4
}
```

### **6. Rebuild y Deploy**
```bash
npm run build
```

## ✅ **¡LISTO!**

**Ahora cuando alguien llene el formulario:**
- Se envía automáticamente a `davidfernando@dafel.com.mx`
- Sin que el usuario abra su cliente de correo
- Con todos los datos estructurados
- Experiencia profesional

## 🔄 **FALLBACK AUTOMÁTICO**
Si EmailJS falla por cualquier razón:
- Se abre automáticamente el cliente de correo (comportamiento actual)
- El usuario no ve ningún error
- Siempre funciona

## 📊 **VENTAJAS vs ESTADO ACTUAL**

| Característica | Actual (Mailto) | Con EmailJS |
|----------------|-----------------|-------------|
| **UX Usuario** | ❌ Abre cliente email | ✅ Envío transparente |
| **Tasa conversión** | ❌ Baja (users no envían) | ✅ Alta (automático) |
| **Notificaciones** | ❌ Depende del usuario | ✅ Inmediatas a tu email |
| **Datos perdidos** | ❌ Si user no envía | ✅ Nunca se pierden |
| **Professional** | ❌ Parece amateur | ✅ Parece enterprise |

## 🎯 **RECOMENDACIÓN**
**¡Hazlo ahora!** Son solo 5 minutos y mejorará muchísimo la conversión de tu sitio.