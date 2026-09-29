import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { products } from './data/products';
import './styles.css';

const CART_KEY = 'nightdrop-cart';
// Add the shop's number (country code + number, digits only) to direct WhatsApp orders.
const WHATSAPP_NUMBER = '';

const money = (value) => `${new Intl.NumberFormat('fr-FR').format(value)} F CFA`;

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((item) => products.some((product) => product.id === item.id))
      .map((item) => ({
        id: item.id,
        qty: Math.max(1, Math.min(Number(item.qty) || 1, products.find((product) => product.id === item.id).stock)),
      }));
  } catch {
    return [];
  }
}

function getDeadline() {
  const now = new Date();
  const halloween = new Date(now.getFullYear(), 9, 31, 23, 59, 59).getTime();
  return halloween > now.getTime() ? halloween : new Date(now.getFullYear() + 1, 9, 31, 23, 59, 59).getTime();
}

function ProductIllustration({ kind }) {
  if (kind === 'pumpkin') {
    return (
      <svg viewBox="0 0 240 220" role="img" aria-label="Illustration d’une citrouille lumineuse">
        <defs>
          <radialGradient id="pumpkin-glow"><stop stopColor="#ffb044" stopOpacity=".52"/><stop offset="1" stopColor="#ff7118" stopOpacity="0"/></radialGradient>
          <linearGradient id="pumpkin-body" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ff9a25"/><stop offset="1" stopColor="#cc3f12"/></linearGradient>
        </defs>
        <circle cx="120" cy="120" r="105" fill="url(#pumpkin-glow)"/>
        <path d="M119 52c-6-15 1-26 13-34 2 13 1 24-5 34" fill="#6a9b4d" stroke="#9dc56a" strokeWidth="5" strokeLinecap="round"/>
        <path d="M120 65c-22-20-54-3-61 29-8 34 9 83 61 88 52-5 69-54 61-88-7-32-39-49-61-29Z" fill="url(#pumpkin-body)"/>
        <path d="M120 69c-17 20-21 68 0 111M98 67c-13 24-15 65-4 101M142 67c13 24 15 65 4 101" fill="none" stroke="#b84117" strokeOpacity=".62" strokeWidth="5"/>
        <path d="m90 109 13 11-16 5Zm60 0-13 11 16 5Z" fill="#261321"/>
        <path d="m110 132 10-7 10 7-4 7h-12Z" fill="#261321"/>
        <path d="M94 144c15 14 37 14 52 0l-7 19h-38Z" fill="#261321"/>
        <path d="M109 145v10m11-11v12m11-12v10" stroke="#ffb044" strokeWidth="4"/>
        <path d="m43 68 3 9 9 3-9 3-3 9-3-9-9-3 9-3Zm154 58 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffe2a2"/>
      </svg>
    );
  }

  if (kind === 'candle') {
    return (
      <svg viewBox="0 0 240 220" role="img" aria-label="Illustration d’une bougie mystique">
        <defs>
          <radialGradient id="candle-glow"><stop stopColor="#ffb544" stopOpacity=".5"/><stop offset="1" stopColor="#f17b23" stopOpacity="0"/></radialGradient>
          <linearGradient id="wax" x1="0" x2="1"><stop stopColor="#f6d9bc"/><stop offset=".5" stopColor="#fff1d5"/><stop offset="1" stopColor="#d4a786"/></linearGradient>
        </defs>
        <circle cx="120" cy="120" r="104" fill="url(#candle-glow)"/>
        <path d="M121 39c-17 23-17 34 0 43 18-12 18-25 0-43Z" fill="#ff8b35"/>
        <path d="M121 51c-8 12-8 19 0 25 9-7 9-15 0-25Z" fill="#fff0aa"/>
        <path d="M118 81v14" stroke="#39202c" strokeWidth="5" strokeLinecap="round"/>
        <path d="M84 94c9 10 20 3 29 0 8 8 19 8 29 0 5 2 9 2 14 0v92H84Z" fill="url(#wax)"/>
        <path d="M84 96c7 7 14 8 22 2 9 8 19 8 28 0 7 7 15 7 22-1" fill="none" stroke="#fff3df" strokeWidth="9" strokeLinecap="round"/>
        <path d="M84 158h72" stroke="#c69678" strokeOpacity=".55" strokeWidth="3"/>
        <path d="M103 111v24m35-19v28" stroke="#fff9ec" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round"/>
        <path d="m54 62 3 8 8 3-8 3-3 8-3-8-8-3 8-3Zm137 89 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffdc93"/>
      </svg>
    );
  }

  if (kind === 'nightset') {
    return (
      <svg viewBox="0 0 240 220" role="img" aria-label="Illustration du coffret Night Set">
        <defs><linearGradient id="box" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#75355f"/><stop offset="1" stopColor="#321b42"/></linearGradient></defs>
        <circle cx="120" cy="116" r="96" fill="#ff7a18" fillOpacity=".1"/>
        <path d="M49 100h142v84H49z" rx="12" fill="url(#box)" stroke="#a65a83" strokeWidth="3"/>
        <path d="M42 88h156v24H42z" rx="9" fill="#a34143" stroke="#e17a4f" strokeWidth="3"/>
        <path d="M111 88c-40-42-70 1-12 14m30-14c40-42 70 1 12 14" fill="none" stroke="#f2a24b" strokeWidth="9" strokeLinecap="round"/>
        <path d="M116 100h10v84h-10z" fill="#eb9b4b"/>
        <path d="M85 132c7-7 16-7 23 0-9-2-14 0-18 6-3-4-7-6-13-5 2-5 5-9 8-11Zm66-39c7-7 16-7 23 0-9-2-14 0-18 6-3-4-7-6-13-5 2-5 5-9 8-11Z" fill="#25112a"/>
        <circle cx="65" cy="68" r="3" fill="#ffe4ac"/><circle cx="185" cy="62" r="3" fill="#ffe4ac"/>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 220" role="img" aria-label="Illustration d’un kit araignée et toile">
      <circle cx="120" cy="117" r="94" fill="#ff7a18" fillOpacity=".09"/>
      <g fill="none" stroke="#b77daf" strokeOpacity=".75" strokeWidth="3">
        <path d="M39 62 201 181M201 62 39 181M120 35v173M29 122h182"/>
        <path d="m58 76 124 0-22 22H80Zm-9 45 21-22 22 0-21 22 21 22H70Zm124 0-21-22h-22l21 22-21 22h23Z"/>
      </g>
      <g fill="#241229" stroke="#f0a5cb" strokeWidth="2">
        <ellipse cx="120" cy="111" rx="13" ry="17"/>
        <circle cx="120" cy="91" r="9"/>
        <path d="m111 104-18-11m17 20-22 1m23 7-17 14m35-31 18-11m-17 20 22 1m-23 7 17 14" fill="none" strokeLinecap="round" strokeWidth="5"/>
      </g>
      <circle cx="117" cy="89" r="2" fill="#fff"/><circle cx="123" cy="89" r="2" fill="#fff"/>
      <path d="m52 48 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#ffe2a2"/>
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 540 470" role="img" aria-label="Maison hantée sous la pleine lune">
      <defs>
        <radialGradient id="moonlight"><stop stopColor="#ffe4a9"/><stop offset=".7" stopColor="#eebd79"/><stop offset="1" stopColor="#dd8e47"/></radialGradient>
        <linearGradient id="house" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#2e1938"/><stop offset="1" stopColor="#140b1e"/></linearGradient>
      </defs>
      <circle cx="353" cy="144" r="94" fill="#ffac54" fillOpacity=".13"/>
      <circle cx="353" cy="144" r="72" fill="url(#moonlight)"/>
      <circle cx="327" cy="123" r="9" fill="#d89a64" fillOpacity=".27"/>
      <circle cx="377" cy="164" r="13" fill="#d89a64" fillOpacity=".22"/>
      <path d="M44 372 142 280l55 44 101-125 67 79 76-69 71 67v147H44Z" fill="#1b1025"/>
      <path d="m74 374 99-140 84 111 73-114 125 143H74Z" fill="url(#house)" stroke="#523157" strokeWidth="4"/>
      <path d="M105 354V246l68-61 68 61v108Z" fill="#21132d" stroke="#79517b" strokeWidth="4"/>
      <path d="m91 247 82-75 82 75" fill="none" stroke="#9c6385" strokeWidth="8" strokeLinejoin="round"/>
      <path d="M149 271h24v39h-24zm42 0h24v39h-24z" fill="#ffad4d"/>
      <path d="M158 346v-42a16 16 0 0 1 32 0v42Z" fill="#4a2a4c" stroke="#9c6385" strokeWidth="4"/>
      <path d="M318 351V256l44-38 44 38v95Z" fill="#21132d" stroke="#61406a" strokeWidth="4"/>
      <path d="m304 257 58-52 59 52" fill="none" stroke="#79517b" strokeWidth="7" strokeLinejoin="round"/>
      <path d="M343 274h18v28h-18zm25 0h18v28h-18z" fill="#ffad4d"/>
      <path d="M0 380c88-19 161 11 243 0 92-12 168-8 297 2v88H0Z" fill="#100a17"/>
      <path d="M57 379c19-10 43-10 62 0m316-2c21-13 48-12 68 1" fill="none" stroke="#553859" strokeWidth="4" strokeLinecap="round"/>
      <path d="M89 129c10-9 20-9 30 0 10-9 20-9 30 0-13-3-19 1-25 10-6-9-16-13-35-10Zm302 39c8-8 17-8 25 0 8-8 17-8 25 0-10-2-16 1-20 9-5-8-13-11-30-9Z" fill="#251630"/>
      <path d="m76 60 3 9 9 3-9 3-3 9-3-9-9-3 9-3Zm367 99 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#fff0bf"/>
    </svg>
  );
}

function App() {
  const [cart, setCart] = useState(readCart);
  const [drawer, setDrawer] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [deadline] = useState(getDeadline);
  const deadlineLabel = new Date(deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const [time, setTime] = useState({ days: 5, hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* Storage can be unavailable in private mode. */ }
  }, [cart]);

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, deadline - Date.now());
      const seconds = Math.floor(remaining / 1000);
      setTime({
        days: Math.floor(seconds / 86400),
        hours: Math.floor(seconds / 3600) % 24,
        minutes: Math.floor(seconds / 60) % 60,
        seconds: seconds % 60,
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [deadline]);

  useEffect(() => {
    if (!drawer && !checkout) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') { setDrawer(false); setCheckout(false); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [drawer, checkout]);

  const items = useMemo(() => cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.id),
  })).filter((item) => item.product), [cart]);
  const count = items.reduce((total, item) => total + item.qty, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.qty, 0);

  const add = (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setCart((current) => {
      const found = current.find((item) => item.id === id);
      if (found) return current.map((item) => item.id === id ? { ...item, qty: Math.min(item.qty + 1, product.stock) } : item);
      return [...current, { id, qty: 1 }];
    });
    setDrawer(true);
  };

  const addBundle = (ids) => {
    setCart((current) => {
      const next = [...current];
      ids.forEach((id) => {
        const product = products.find((item) => item.id === id);
        if (!product) return;
        const found = next.find((item) => item.id === id);
        if (found) found.qty = Math.min(found.qty + 1, product.stock);
        else next.push({ id, qty: 1 });
      });
      return next;
    });
    setDrawer(true);
  };

  const changeQty = (id, delta) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setCart((current) => current.map((item) => item.id === id
      ? { ...item, qty: Math.max(0, Math.min(item.qty + delta, product.stock)) }
      : item).filter((item) => item.qty > 0));
  };

  const whatsappUrl = () => {
    const message = encodeURIComponent(`Bonjour NightDrop, je souhaite commander : ${items.map((item) => `${item.product.name} x${item.qty}`).join(', ')}. Total : ${money(subtotal)}.`);
    const destination = WHATSAPP_NUMBER ? `${WHATSAPP_NUMBER}?text=${message}` : `?text=${message}`;
    return `https://wa.me/${destination}`;
  };

  const confirmOrder = (event) => {
    event.preventDefault();
    setCheckout(false);
    setConfirmation({ name: form.name.trim(), total: subtotal, reference: `ND-${Math.random().toString(36).slice(2, 7).toUpperCase()}` });
    setCart([]);
  };

  return (
    <div className="shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="NightDrop, accueil">
          <span className="mark" aria-hidden="true">N</span>
          <span><b>NIGHTDROP</b><small>LA NUIT PREND FORME</small></span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#ambiences">Ambiances</a>
          <a href="#products">La sélection</a>
          <a href="#reviews">Avis</a>
        </nav>
        <button className="cart" type="button" onClick={() => setDrawer(true)} aria-label={`Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`}>
          Panier <span>{count}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot"/> HALLOWEEN · ÉDITION NOCTURNE</span>
            <h1 id="hero-title">La nuit tombe.<br/><span>Votre décor s’allume.</span></h1>
            <p>Citrouilles lumineuses, bougies mystiques et kits qui transforment votre soirée. Faites entrer l’esprit d’Halloween chez vous avec <b>−50 % sur la sélection.</b></p>
            <div className="actions">
              <a className="primary" href="#products">Je profite de −50 % <span aria-hidden="true">↗</span></a>
              <a className="secondary" href="#ambiences">Trouver mon ambiance</a>
            </div>
            <div className="trust" aria-label="Avantages NightDrop">
              <span><b aria-hidden="true">✓</b> Prix réduits affichés</span>
              <span><b aria-hidden="true">✓</b> Stock en temps réel de la démo</span>
              <span><b aria-hidden="true">✓</b> Commande en quelques clics</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-caption"><span>LA MAISON</span><b>DES PETITS FRISSONS</b></div>
            <HeroIllustration/>
            <div className="sale-stamp"><small>UNE SÉLECTION</small><b>−50<span>%</span></b><span>JUSQU’AU {deadlineLabel.toUpperCase()}</span></div>
          </div>
        </section>

        <section className="countdown" aria-label="Compte à rebours de l’offre">
          <div><span className="kicker">OFFRE JUSQU’AU {deadlineLabel.toUpperCase()}</span><h2>Le frisson n’attend pas.</h2></div>
          <div className="timer" aria-live="off">
            {[[time.days, 'Jours'], [time.hours, 'Heures'], [time.minutes, 'Minutes'], [time.seconds, 'Secondes']].map(([value, label]) => (
              <div key={label}><b>{String(value).padStart(2, '0')}</b><small>{label}</small></div>
            ))}
          </div>
        </section>

        <section className="section mood-section" id="ambiences" aria-labelledby="mood-title">
          <div className="section-head">
            <div><span className="kicker">VOTRE SCÈNE, VOTRE HISTOIRE</span><h2 id="mood-title">Quelle nuit allez-vous créer ?</h2></div>
            <p>Choisissez une ambiance et ajoutez ses essentiels au panier.</p>
          </div>
          <div className="mood-grid">
            <article className="mood-card mood-warm">
              <span className="mood-number">01 / ACCUEIL</span><span className="mood-icon" aria-hidden="true">✦</span>
              <h3>Citrouille cosy</h3><p>Une lueur chaude à la porte, une bougie à la fenêtre.</p>
              <button type="button" onClick={() => addBundle([1, 2])}>Préparer cette ambiance <span aria-hidden="true">→</span></button>
            </article>
            <article className="mood-card mood-haunted">
              <span className="mood-number">02 / SOIRÉE</span><span className="mood-icon" aria-hidden="true">☾</span>
              <h3>Manoir hanté</h3><p>Un décor complet pour faire parler toute la soirée.</p>
              <button type="button" onClick={() => addBundle([3, 4])}>Préparer cette ambiance <span aria-hidden="true">→</span></button>
            </article>
            <article className="mood-card mood-moon">
              <span className="mood-number">03 / DERNIÈRE HEURE</span><span className="mood-icon" aria-hidden="true">✧</span>
              <h3>Minuit mystérieux</h3><p>Les détails qui changent toute la pièce, sans effort.</p>
              <button type="button" onClick={() => addBundle([2, 3, 4])}>Préparer cette ambiance <span aria-hidden="true">→</span></button>
            </article>
          </div>
        </section>

        <section className="section" id="products" aria-labelledby="products-title">
          <div className="section-head">
            <div><span className="kicker">OBJETS CHOISIS POUR LA NUIT</span><h2 id="products-title">Les offres qui font leur effet</h2></div>
            <p>Les quantités affichées sont celles de cette démo.</p>
          </div>
          <div className="grid">
            {products.map((product) => (
              <article className="card" key={product.id}>
                <div className={`product-art product-art-${product.kind}`}>
                  <span className="badge">{product.badge}</span>
                  <ProductIllustration kind={product.kind}/>
                  <span className="art-tag">NIGHTDROP OBJECTS · 0{product.id}</span>
                </div>
                <div className="content">
                  <div className="rating" aria-label={`Note de démonstration ${product.rating} sur 5`}><span aria-hidden="true">★★★★★</span> <b>{product.rating}</b></div>
                  <small className="cat">{product.category}</small>
                  <h3>{product.name}</h3>
                  <div className="prices"><s>{money(product.oldPrice)}</s><b>{money(product.price)}</b></div>
                  <small className="stock"><span aria-hidden="true">●</span> Plus que {product.stock} en stock</small>
                  <button className="buy" type="button" onClick={() => add(product.id)}>Ajouter au panier <span aria-hidden="true">↗</span></button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="benefits" aria-label="Les engagements NightDrop">
          <article><span>01</span><h3>Le bon décor, sans chercher</h3><p>Trois ambiances prêtes à composer pour choisir en un instant.</p></article>
          <article><span>02</span><h3>Les prix sans surprise</h3><p>Prix avant remise, prix réduit et quantités restent visibles.</p></article>
          <article><span>03</span><h3>Un parcours tout simple</h3><p>Ajoutez, vérifiez le total et confirmez votre commande de démonstration.</p></article>
        </section>

        <section className="section" id="reviews" aria-labelledby="reviews-title">
          <div className="section-head">
            <div><span className="kicker">ILS AIMENT L’AMBIANCE</span><h2 id="reviews-title">Une soirée qui se prépare bien.</h2></div>
            <p className="demo-note">Avis d’exemple, à remplacer par les retours réels de la boutique.</p>
          </div>
          <div className="reviews">
            <article><div className="stars" aria-label="5 étoiles">★★★★★</div><p>« La remise et les prix sont faciles à repérer. »</p><b>Une sélection claire</b><small>Exemple de retour</small></article>
            <article><div className="stars" aria-label="5 étoiles">★★★★★</div><p>« J’ai trouvé une idée pour décorer toute l’entrée en quelques minutes. »</p><b>Une ambiance prête</b><small>Exemple de retour</small></article>
            <article><div className="stars" aria-label="5 étoiles">★★★★★</div><p>« Le panier affiche le total avant la confirmation. »</p><b>Une commande lisible</b><small>Exemple de retour</small></article>
          </div>
        </section>

        <section className="final">
          <div><span className="kicker">LA NUIT EST À VOUS</span><h2>Prêt à faire entrer Halloween ?</h2><p>Composez votre décor pendant que les offres sont encore là.</p></div>
          <a className="primary" href="#products">Découvrir la sélection <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer>
        <div><a className="footer-brand" href="#top">NIGHTDROP</a><p>Des objets choisis pour les nuits d’Halloween.</p><small>Démo front-end · Commandes et paiement non transmis.</small></div>
        <div className="footer-links"><a href="#ambiences">Ambiances</a><a href="#products">Produits</a><a href="#top">Retour en haut ↑</a></div>
        <p className="copyright">© 2026 NightDrop. Tous droits réservés.</p>
      </footer>

      {drawer && (
        <div className="overlay" onMouseDown={() => setDrawer(false)}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><span className="kicker">VOTRE SÉLECTION</span><h2 id="cart-title">Panier <span className="cart-total-count">({count})</span></h2></div><button className="close" type="button" onClick={() => setDrawer(false)} aria-label="Fermer le panier">×</button></div>
            {!items.length ? (
              <div className="empty"><div aria-hidden="true">✧</div><h3>La nuit est encore vide.</h3><p>Choisissez une ambiance ou ajoutez un objet pour commencer.</p><a className="primary" href="#products" onClick={() => setDrawer(false)}>Découvrir les offres</a></div>
            ) : (
              <>
                <div className="cart-list">
                  {items.map(({ product, qty }) => (
                    <div className="cart-item" key={product.id}>
                      <div className={`mini mini-${product.kind}`}><ProductIllustration kind={product.kind}/></div>
                      <div className="cart-item-info"><b>{product.name}</b><span>{money(product.price)}</span><div className="qty"><button type="button" onClick={() => changeQty(product.id, -1)} aria-label={`Retirer un ${product.name}`}>−</button><em aria-live="polite">{qty}</em><button type="button" onClick={() => changeQty(product.id, 1)} aria-label={`Ajouter un ${product.name}`}>+</button></div></div>
                      <button className="remove" type="button" onClick={() => setCart((current) => current.filter((item) => item.id !== product.id))}>Supprimer</button>
                    </div>
                  ))}
                </div>
                <div className="summary"><div><span>Sous-total</span><b>{money(subtotal)}</b></div><small>Démo uniquement : aucun paiement réel n’est effectué.</small></div>
                <button className="primary full" type="button" onClick={() => { setDrawer(false); setCheckout(true); }}>Continuer ma commande</button>
                <a className="secondary full whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer">Partager le récapitulatif sur WhatsApp</a>
              </>
            )}
          </aside>
        </div>
      )}

      {checkout && (
        <div className="overlay overlay-center" onMouseDown={() => setCheckout(false)}>
          <section className="checkout" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><span className="kicker">DERNIÈRE ÉTAPE · DÉMO</span><h2 id="checkout-title">Finaliser la commande</h2></div><button className="close" type="button" onClick={() => setCheckout(false)} aria-label="Fermer la commande">×</button></div>
            <form onSubmit={confirmOrder}>
              <label htmlFor="customer-name">Nom complet<input id="customer-name" autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex. Samah Joevanix"/></label>
              <label htmlFor="customer-phone">Téléphone<input id="customer-phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Ex. +229 97 00 00 00"/></label>
              <label htmlFor="customer-address">Adresse<textarea id="customer-address" autoComplete="street-address" required rows="3" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Ville, quartier…"/></label>
              <div className="payment"><b>Paiement non activé</b><span>Cette page confirme une commande de démonstration, sans transmettre vos informations.</span></div>
              <button className="primary full" type="submit">Confirmer la démo · {money(subtotal)}</button>
            </form>
          </section>
        </div>
      )}

      {confirmation && (
        <div className="success" role="status" aria-live="polite">
          <div><span aria-hidden="true">✓</span><div><b>Merci{confirmation.name ? `, ${confirmation.name.split(' ')[0]}` : ''} !</b><p>Confirmation de démonstration · {confirmation.reference} · {money(confirmation.total)}</p></div></div>
          <button className="close" type="button" onClick={() => setConfirmation(null)} aria-label="Fermer la confirmation">×</button>
        </div>
      )}

      {!drawer && !checkout && (
        <div className="mobile-buybar" aria-label="Produit vedette">
          <div><small>LE COUP DE CŒUR</small><b>Pumpkin Glow · {money(products[0].price)}</b></div>
          <button type="button" onClick={() => add(products[0].id)}>Acheter <span aria-hidden="true">↗</span></button>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
