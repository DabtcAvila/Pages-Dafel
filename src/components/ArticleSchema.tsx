import { Article } from '@/data/articles';

interface ArticleSchemaProps {
  article: Article;
}

export default function ArticleSchema({ article }: ArticleSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "articleBody": article.content,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": "https://dafel.com.mx"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DAFEL Technologies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dafel.com.mx/dafel-logo-optimized.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://dafel.com.mx/boletines/${article.slug}`
    },
    "image": {
      "@type": "ImageObject",
      "url": article.image || "https://dafel.com.mx/dafel-og-image.png",
      "width": 1200,
      "height": 630
    },
    "keywords": article.tags.join(", "),
    "articleSection": "Consultoría Actuarial",
    "inLanguage": "es-MX",
    "about": {
      "@type": "Thing",
      "name": "Consultoría Actuarial",
      "description": "Servicios especializados en NIF D-3, IAS-19, US GAAP y beneficios a empleados"
    },
    "genre": "Business",
    "audience": {
      "@type": "Audience",
      "audienceType": "Business Professional"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}