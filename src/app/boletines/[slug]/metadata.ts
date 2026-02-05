import type { Metadata } from 'next';
import { getArticleBySlug } from '@/data/articles';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado | DAFEL',
      description: 'El artículo solicitado no fue encontrado.',
    };
  }

  const title = `${article.title} | DAFEL`;
  const description = article.excerpt;
  const url = `https://dafel.com.mx/boletines/${article.slug}`;

  return {
    title,
    description,
    keywords: [...article.tags, 'DAFEL', 'consultoría actuarial', 'México'],
    authors: [{ name: article.author }],
    creator: 'DAFEL Technologies',
    publisher: 'DAFEL Technologies',
    openGraph: {
      type: 'article',
      locale: 'es_MX',
      url,
      siteName: 'DAFEL Technologies',
      title,
      description,
      images: [
        {
          url: article.image || '/dafel-og-image.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.image || '/dafel-og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
    other: {
      'article:published_time': article.date,
      'article:author': article.author,
      'article:section': 'Boletines',
      'article:tag': article.tags.join(', '),
    },
  };
}