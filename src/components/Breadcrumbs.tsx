import { CaretRight } from '@phosphor-icons/react'
import { useEffect } from 'react'

interface BreadcrumbItem {
  label: string
  onClick?: () => void
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Inject JSON-LD structured data
  useEffect(() => {
    const script = document.createElement('script')
    script.id = 'breadcrumb-schema'
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.href || (typeof window !== 'undefined' ? window.location.href : ''),
      })),
    })
    document.head.appendChild(script)
    
    return () => {
      const existing = document.getElementById('breadcrumb-schema')
      if (existing) existing.remove()
    }
  }, [items])

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center gap-2 text-sm"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li
              key={index}
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-2"
            >
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  itemProp="item"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span itemProp="name">{item.label}</span>
                </button>
              ) : (
                <span
                  itemProp="item"
                  className={isLast ? "text-foreground font-medium" : "text-muted-foreground"}
                  aria-current={isLast ? "page" : undefined}
                >
                  <span itemProp="name">{item.label}</span>
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <CaretRight
                  size={14}
                  className="text-muted-foreground"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
