export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-visual">
        <div className="skeleton-img skeleton-shimmer" />
      </div>
      <div className="skeleton-body">
        <div className="skeleton-tag skeleton-shimmer" />
        <div className="skeleton-titulo skeleton-shimmer" />
        <div className="skeleton-desc skeleton-shimmer" />
        <div className="skeleton-desc skeleton-shimmer" style={{ width: '65%' }} />
        <div className="skeleton-pie">
          <div className="skeleton-precio skeleton-shimmer" />
          <div className="skeleton-btn skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ cantidad = 6 }) {
  return (
    <section className="producto-grid" aria-label="Cargando productos..." aria-busy="true">
      {Array.from({ length: cantidad }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </section>
  );
}
