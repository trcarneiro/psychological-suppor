import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BlogArticle } from '@/lib/blog-articles'
import { getArticleSEO } from '@/lib/article-seo-metadata'
import { updateDocumentMeta, generateStructuredData } from '@/lib/seo-helpers'
import { Clock, Calendar, ArrowLeft, Tag } from '@phosphor-icons/react'
import { marked } from 'marked'

interface BlogArticleViewProps {
  article: BlogArticle
  onBack: () => void
  onBackToHome: () => void
}

export function BlogArticleView({ article, onBack, onBackToHome }: BlogArticleViewProps) {
  const htmlContent = marked(article.content)

  useEffect(() => {
    const seoData = getArticleSEO(article.id)
    
    const articleWithSEO = {
      ...article,
      metaDescription: article.metaDescription || seoData?.metaDescription || article.excerpt,
      keywords: article.keywords || seoData?.keywords || article.tags,
      structuredData: article.structuredData || generateStructuredData({
        ...article,
        keywords: article.keywords || seoData?.keywords || article.tags,
      }),
    }
    
    updateDocumentMeta(articleWithSEO)
    
    return () => {
      document.title = 'Psicólogo BH - Atendimento Psicológico em Belo Horizonte | Terapia Online e Presencial'
      
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', 'https://psicologobelohorizonte.com.br/')
      }
      
      const articleSchema = document.querySelector('script[id="article-schema"]')
      if (articleSchema) {
        articleSchema.remove()
      }
    }
  }, [article])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} />
            Voltar para Blog
          </Button>
          <Button
            variant="ghost"
            onClick={onBackToHome}
            className="gap-2 hover:gap-3 transition-all"
          >
            Voltar para Home
          </Button>
        </div>

        <article className="space-y-8">
          <header className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                {article.category}
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{article.readTime} min de leitura</span>
              </div>
            </div>

            <Separator />
          </header>

          <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-6 prose-ul:space-y-2
                prose-li:text-foreground/90
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              "
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </Card>

          <footer className="space-y-6">
            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag size={16} />
                <span className="font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Precisa de Ajuda Profissional?
                </h3>
                <p className="text-muted-foreground">
                  Nossa plataforma conecta você com psicólogos qualificados em Belo Horizonte.
                  Comece uma conversa com nosso assistente virtual e encontre o profissional ideal para você.
                </p>
                <Button
                  onClick={onBackToHome}
                  className="w-full sm:w-auto"
                >
                  Conversar Agora
                </Button>
              </div>
            </Card>
          </footer>
        </article>
      </div>
    </div>
  )
}
