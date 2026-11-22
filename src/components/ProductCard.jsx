import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { categoryLabelFor, minPrice } from "../data/products";
import { money } from "../lib/format";

export default function ProductCard({ product: p }) {
  const to = `/produit/${p.id}`;
  return (
    <article className="product-card">
      <Link className="product-image" to={to} tabIndex={-1} aria-hidden="true">
        <img src={p.image} alt="" loading="lazy" style={p.fit ? { objectFit: p.fit } : undefined} />
        <span className="product-tag">{p.label}</span>
      </Link>
      <div className="product-info">
        <span className="product-category">{categoryLabelFor(p)}</span>
        <h3>
          <Link to={to}>{p.name}</Link>
        </h3>
        <p>{p.description}</p>
        <div className="product-bottom">
          <span className="product-price">
            {p.variants.length > 1 && <small>Dès </small>}
            {money(minPrice(p))}
          </span>
          <Link className="add-button" to={to} aria-label={`Voir les options de ${p.name}`}>
            <Plus size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <Link className="details-link" to={to}>
        Voir les détails <ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </article>
  );
}
