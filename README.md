# NightDrop — boutique Halloween

Projet front-end React + Vite préparé à partir du code fourni. Le site comprend une page boutique responsive, un panier conservé dans le navigateur, une sélection d’ambiances, un compte à rebours jusqu’au 31 octobre, un formulaire de confirmation de démonstration et un partage de récapitulatif via WhatsApp.

## Démarrer

```bash
npm install
npm run dev
```

Pour générer la version de production :

```bash
npm run build
npm run preview
```

## À personnaliser avant une mise en ligne

- Les produits, prix et quantités se trouvent dans `src/data/products.js`.
- Le numéro WhatsApp se configure dans `src/main.jsx`, dans `WHATSAPP_NUMBER` (indicatif pays + numéro, chiffres seulement).
- Les notes et avis sont des exemples signalés comme tels; remplacez-les par des avis vérifiés.
- Le formulaire, le paiement et la confirmation sont une démonstration locale. Aucune commande ni donnée n’est envoyée à un serveur.

Le projet utilise React, React DOM et Vite. Les illustrations sont des SVG intégrés au code, sans images distantes.
