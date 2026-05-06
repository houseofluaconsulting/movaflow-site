# Mova Flow — base domain site

These files convert the **lifejacketleads** project into the marketing/portfolio site for the Mova Flow base domain (`movaflow.io`). Same stack, same styling system (Minimals UI kit / Vite + React 19 + MUI 7 / Emotion / Framer Motion), same logo, same primary palette.

## What changed

```
src/
├── global-config.js                     [modified] appName → "Mova Flow"
├── pages/
│   └── home.jsx                         [modified] new metadata
└── sections/
    └── home/
        ├── home-hero.jsx                [modified] "Lead distribution, powered by mova flow"
        ├── home-features.jsx            [new]      Two portals: Admin + Customer
        ├── home-how-it-works.jsx        [new]      4-step lead lifecycle
        ├── home-cta.jsx                 [new]      Portfolio CTA → lifejacketleads
        └── view/
            └── home-view.jsx            [modified] composes the four sections
```

Nothing else needs to change. Layouts, theme, fonts, logo, routes, and the dashboard portion are all reused as-is.

## How to apply

1. **Fork or duplicate** the lifejacketleads repo into a new repo (e.g. `movaflow-site`).
2. **Copy these files** into the new repo, preserving the paths above. They will overwrite the originals where needed.
3. `yarn install && yarn dev` — should run on `localhost:3030` with the new home page.
4. **Optional cleanup** — the original home section files you no longer reference can be deleted to keep the bundle lean:
   - `src/sections/home/home-advertisement.jsx`
   - `src/sections/home/home-faqs.jsx`
   - `src/sections/home/home-for-designer.jsx`
   - `src/sections/home/home-highlight-features.jsx`
   - `src/sections/home/home-hugepack-elements.jsx`
   - `src/sections/home/home-integrations.jsx`
   - `src/sections/home/home-minimal.jsx`
   - `src/sections/home/home-pricing.jsx`
   - `src/sections/home/home-testimonials.jsx`
   - `src/sections/home/home-zone-ui.jsx`
   - `src/sections/home/components/hero-background.jsx` and `hero-svg.jsx` if not used elsewhere

   Leave `src/sections/home/components/section-title.jsx` and `svg-elements.jsx` — the new sections depend on them.

5. **Deploy** — same Vite build, same Vercel config (`vercel.json`). Point `movaflow.io` (apex) at the new deployment in your DNS / hosting provider.

## Hero copy

The hero mirrors the lifejacketleads layout exactly (3-line stack, animated text gradient on the brand word):

```
Lead distribution,
   powered by
   mova flow          ← animated primary→warning gradient, like the original
```

Subtitle: "Connect lead generators with buyers, track every metric, and distribute rewards — all in one platform."

## Sections at a glance

- **Hero** — tagline + brand, scroll-fade behavior identical to lifejacketleads.
- **Features** — two side-by-side portal blocks. Admin Portal (left, primary-green accent) lists Customer/Lead Management, Lead Metrics, Financial Dashboard. Customer Portal (right, warning-orange accent) lists CRM Integration, Lead Marketplace, Lead Management, Rewards Program.
- **How it works** — 4-step lifecycle (Aggregate → Distribute → Integrate → Measure & Reward) on a `background.neutral` band so it visually separates from the surrounding sections.
- **CTA** — soft portfolio prompt linking out to `https://lifejacketleads.movaflow.io` as a real-world example.

## Things you may want to tweak

- **Copy** — feature descriptions are first-pass. Adjust to your actual product positioning.
- **Icons** — all `solar:*-bold-duotone` icons matching the kit. Browse alternatives at https://icon-sets.iconify.design/solar/.
- **Hero word** — currently `mova flow` in the gradient. If you'd rather have just `mova` highlighted (matching the logo brand mark exactly), change line ~71 of `home-hero.jsx`.
- **Nav links** — the existing `MainLayout` nav config (`src/layouts/nav-config-main.jsx`) still points at lifejacketleads-flavored pages. Audit it for the new domain.
- **Footer** — same — check `src/layouts/main/footer.jsx` for any hard-coded LifeJacket Leads references.
