export function generateStructuredData(article: {
  title: string
  slug: string
  excerpt: string
  category: string
  keywords: string[]
  publishedAt: string
  content: string
  author: string
}) {
  const wordCount = article.content.split(/\s+/).length
  const canonicalUrl = `https://psicologobelohorizonte.com.br/blog/${article.slug}`
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "Psicólogo BH",
    },
    articleSection: article.category,
    keywords: article.keywords,
    wordCount: wordCount,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  }
}

export function updateDocumentMeta(article: {
  title: string
  slug: string
  excerpt: string
  metaDescription?: string
  keywords?: string[]
  structuredData?: any
}) {
  const description = article.metaDescription || article.excerpt
  const keywords = article.keywords || []
  
  document.title = `${article.title} | Psicólogo BH`
  
  let metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  } else {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    metaDescription.setAttribute('content', description)
    document.head.appendChild(metaDescription)
  }
  
  if (keywords.length > 0) {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords.join(', '))
    } else {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      metaKeywords.setAttribute('content', keywords.join(', '))
      document.head.appendChild(metaKeywords)
    }
  }
  
  let canonical = document.querySelector('link[rel="canonical"]')
  const canonicalUrl = `https://psicologobelohorizonte.com.br/blog/${article.slug}`
  if (canonical) {
    canonical.setAttribute('href', canonicalUrl)
  } else {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', canonicalUrl)
    document.head.appendChild(canonical)
  }
  
  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute('content', article.title)
  }
  
  let ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription) {
    ogDescription.setAttribute('content', description)
  }
  
  let ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) {
    ogUrl.setAttribute('content', canonicalUrl)
  } else {
    ogUrl = document.createElement('meta')
    ogUrl.setAttribute('property', 'og:url')
    ogUrl.setAttribute('content', canonicalUrl)
    document.head.appendChild(ogUrl)
  }
  
  let twitterTitle = document.querySelector('meta[name="twitter:title"]')
  if (twitterTitle) {
    twitterTitle.setAttribute('content', article.title)
  }
  
  let twitterDescription = document.querySelector('meta[name="twitter:description"]')
  if (twitterDescription) {
    twitterDescription.setAttribute('content', description)
  }
  
  if (article.structuredData) {
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]#article-schema')
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(article.structuredData, null, 2)
    } else {
      structuredDataScript = document.createElement('script')
      structuredDataScript.setAttribute('type', 'application/ld+json')
      structuredDataScript.setAttribute('id', 'article-schema')
      structuredDataScript.textContent = JSON.stringify(article.structuredData, null, 2)
      document.head.appendChild(structuredDataScript)
    }
  }
}
