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
      >
          const isLast = index === items.length - 1
       
              key={index}
              itemScope

              {ite
               
                  classNa
                >
                  <span
              ) : (
                  itemProp="item"
             
                  aria-current=
                  {inde
                </span>
              <meta itemProp="pos
              {!isLast && (
                  size={14}
                 
                />
            </li>
        })}
    </nav>
}






















        })}
      </ol>
    </nav>
  )
}
