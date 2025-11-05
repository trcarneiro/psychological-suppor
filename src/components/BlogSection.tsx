import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BlogCard } from '@/components/BlogCard'
import { BlogArticleView } from '@/components/BlogArticleView'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import {
  BLOG_ARTICLES,
  getAllCategories,
  getArticlesByCategory,
  searchArticles,
  BlogArticle,
} from '@/lib/blog-articles'
import { MagnifyingGlass, Article } from '@phosphor-icons/react'

interface BlogSectionProps {
  onBack: () => void
}

export function BlogSection({ onBack }: BlogSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = getAllCategories()

  const getFilteredArticles = () => {
    if (searchQuery) {
      return searchArticles(searchQuery)
    }
    if (selectedCategory === 'all') {
      return BLOG_ARTICLES
    }
    return getArticlesByCategory(selectedCategory)
  }

  const filteredArticles = getFilteredArticles()

  if (selectedArticle) {
    return (
      <BlogArticleView
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        onBackToHome={onBack}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4 py-12 space-y-12">
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: onBack },
              { label: 'Blog' },
            ]}
          />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Article size={32} weight="duotone" />
              <h1 className="text-5xl font-bold">Blog</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Artigos, guias e conteúdos sobre psicologia, saúde mental e bem-estar
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Buscar artigos por título, conteúdo ou tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Article size={64} className="mx-auto text-muted-foreground mb-4" weight="duotone" />
            <h3 className="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground">
              Tente buscar com outros termos ou categorias
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  onReadMore={() => setSelectedArticle(article)}
                />
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground pt-8">
              Mostrando {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo' : 'artigos'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
