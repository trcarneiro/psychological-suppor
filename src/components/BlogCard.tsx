import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, ArrowRight } from '@phosphor-icons/react'
import { BlogArticle } from '@/lib/blog-articles'

interface BlogCardProps {
  article: BlogArticle
  onReadMore: () => void
}

export function BlogCard({ article, onReadMore }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card border-border/50">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {article.category}
          </Badge>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{article.readTime} min</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReadMore}
            className="gap-2 text-primary hover:text-primary hover:gap-3 transition-all"
          >
            Ler mais
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
