export type MarqueeCarouselItem = {
  label: string
  flagSrc?: string
  logoSrc?: string
  featured?: boolean
}

type MarqueeCarouselProps = {
  items: readonly MarqueeCarouselItem[]
  label: string
  variant: 'countries' | 'platforms'
}

function MarqueeCarousel({ items, label, variant }: MarqueeCarouselProps) {
  return (
    <div className={`marquee-carousel marquee-carousel--${variant}`} aria-label={label}>
      <div className="marquee-carousel__track">
        <CarouselList items={items} variant={variant} />
        <CarouselList items={items} variant={variant} isDuplicate />
      </div>
    </div>
  )
}

type CarouselListProps = {
  items: readonly MarqueeCarouselItem[]
  variant: MarqueeCarouselProps['variant']
  isDuplicate?: boolean
}

function CarouselList({ items, variant, isDuplicate = false }: CarouselListProps) {
  return (
    <ul aria-hidden={isDuplicate || undefined} className="marquee-carousel__list">
      {items.map((item) => (
        <li
          className={`marquee-carousel__item${item.featured ? ' is-featured' : ''}`}
          key={item.label}
        >
          {variant === 'platforms' && item.logoSrc ? (
            <img alt={isDuplicate ? '' : item.label} src={item.logoSrc} />
          ) : (
            <>
              {item.flagSrc ? <img alt="" aria-hidden="true" src={item.flagSrc} /> : null}
              {item.label}
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default MarqueeCarousel
