import { CaretRight, House } from '@phosphor-icons/react'

interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-2"
            >
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  itemProp="item"
                  className="flex items-center gap-2 hover:text-foreground transition-colors hover:underline"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {index === 0 && <House size={16} weight="fill" />}
                  <span itemProp="name">{item.label}</span>
                </button>
              ) : (
                <span
                  itemProp="item"
                  className={`flex items-center gap-2 ${
                    isLast ? 'text-foreground font-medium' : ''
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {index === 0 && <House size={16} weight="fill" />}
                  <span itemProp="name">{item.label}</span>
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />

              {!isLast && (
                <CaretRight
                  size={14}
                  weight="bold"
                  className="text-muted-foreground/50"
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
