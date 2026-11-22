import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE } from "../lib/format";
import { trackOrder } from "../lib/orders";
import { usePageMeta } from "../lib/usePageMeta";
import { normalizeMoroccanPhone } from "../lib/validation";

export default function OrderTracking() {
  usePageMeta({ title: "Suivre ma commande — MIROTECH", robots: "noindex, follow" });
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const orderId = String(form.get("orderId")).trim().toUpperCase();
    const phone = normalizeMoroccanPhone(form.get("phone"));
    if (!/^MT-\d{6}-\d{4}$/.test(orderId) || !phone) {
      setResult({ error: "Vérifiez le numéro de commande et le téléphone." });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { status } = await trackOrder(orderId, phone);
      setResult({ orderId, status });
    } catch (error) {
      setResult({ error: error.message === "Action inconnue." ? "Le suivi est momentanément indisponible." : error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section tracking-page">
      <h1>Suivre ma commande</h1>
      <p>Indiquez le numéro reçu à la confirmation et le téléphone utilisé pour commander.</p>
      <form className="tracking-form" onSubmit={handleSubmit}>
        <label>
          Numéro de commande
          <input name="orderId" placeholder="MT-261122-0001" defaultValue={state?.orderId || ""} required maxLength={14} disabled={loading} />
        </label>
        <label>
          Téléphone
          <input name="phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" required maxLength={18} disabled={loading} />
        </label>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? "Recherche…" : "Voir le statut"}
        </button>
      </form>
      {result?.error && <p className="form-status form-error" role="alert">{result.error}</p>}
      {result?.status && (
        <p className="tracking-result" role="status">
          Commande {result.orderId} <strong>{result.status}</strong>
        </p>
      )}
      <div className="tracking-contact">
        <Link to="/#contact">Contact</Link>
        <a href={"https://wa.me/" + SITE.whatsappNumber} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
      </div>
    </section>
  );
}
