import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '../../../../data/articles'

export const metadata: Metadata = {
  title: 'Futuro de la Profesión Actuarial México 2025: Nuevos Requerimientos | DAFEL',
  description: 'La profesión actuarial evoluciona con nuevos requerimientos CNSF y CONSAR. Analizamos certificaciones, competencias digitales y el futuro del actuario mexicano.',
}

export default function ArticlePage() {
  const article = getArticleBySlug('futuro-profesion-actuarial-diciembre-2025')
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-4">
            <span className="text-blue-600 text-sm font-medium">
              {new Date(article.date).toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-gray-500 text-sm">{article.readTime}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          <div className="flex items-center">
            <span className="text-gray-700 font-medium">{article.author}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/\n/g, '<br/>').replace(/#{1,3}\s/g, '<h3>').replace(/<h3>/g, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">') 
            }} />
          </div>
          
          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}