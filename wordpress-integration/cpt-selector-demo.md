# Démo visuelle : Sélecteur de CPT pour Preview

## Interface principale

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    Headless Preview Settings                          ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  [Formulaire de configuration standard...]                           ║
║                                                                       ║
║  Frontend URL: https://lesetatsgenerauxcommunaux.org                 ║
║  Preview Secret: ********************************                     ║
║                                                                       ║
║  [Enregistrer les modifications]                                     ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  🎯 Sélection des types de contenu pour la preview                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  Choisissez quels types de contenu auront le bouton de preview       ║
║  headless. Les types non sélectionnés utiliseront la preview         ║
║  WordPress par défaut.                                                ║
║                                                                       ║
║  ┌─────────────────────┐  ┌─────────────────────┐                   ║
║  │ ☑ Articles          │  │ ☑ Pages             │                   ║
║  │ post (built-in)     │  │ page (built-in)     │                   ║
║  │ ✓ REST              │  │ ✓ REST              │                   ║
║  └─────────────────────┘  └─────────────────────┘                   ║
║                                                                       ║
║  ┌─────────────────────┐  ┌─────────────────────┐                   ║
║  │ ☑ Événements        │  │ ☑ Ressources        │                   ║
║  │ evenement           │  │ ressource           │                   ║
║  │ ✓ REST              │  │ ✓ REST              │                   ║
║  └─────────────────────┘  └─────────────────────┘                   ║
║                                                                       ║
║  ┌─────────────────────┐  ┌─────────────────────┐                   ║
║  │ ☑ Groupes Locaux    │  │ ☐ Newsletter        │                   ║
║  │ groupe-locaux       │  │ newsletter          │                   ║
║  │ ✓ REST              │  │ ✗ REST              │                   ║
║  └─────────────────────┘  └─────────────────────┘                   ║
║                              ⚠ Attention : REST API désactivé        ║
║                                                                       ║
║  💡 Conseil : Les types de contenu avec REST API désactivé ne        ║
║  fonctionneront pas en preview headless. Activez "show_in_rest"      ║
║  dans leur configuration.                                             ║
║                                                                       ║
║  [Enregistrer la sélection]                                          ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## Badges de statut

### ✓ REST (vert)
```
┌─────────────────────┐
│ ☑ Événements        │
│ evenement           │
│ ✓ REST              │  ← API REST activée (preview fonctionnera)
└─────────────────────┘
```

### ✗ REST (rouge)
```
┌─────────────────────┐
│ ☐ Newsletter        │
│ newsletter          │
│ ✗ REST              │  ← API REST désactivée (preview NE fonctionnera PAS)
└─────────────────────┘
    ↓
⚠ Attention : REST API désactivé
```

## Colonne dans la liste des posts

### Liste des événements

```
╔═══════════════════════════════════════════════════════════╗
║  Événements                                   [Ajouter]   ║
╠═════════════════════╤══════════════╤═══════════╤══════════╣
║ Titre               │ Auteur       │ Date      │ 🔗 Preview ║
╟─────────────────────┼──────────────┼───────────┼──────────╢
║ Conférence sur...  │ John Doe     │ 2026-02-10│ ✓ Headless║
║ Atelier de...      │ Jane Smith   │ 2026-02-09│ ✓ Headless║
║ Débat citoyen...   │ Bob Martin   │ 2026-02-08│ ✓ Headless║
╚═════════════════════╧══════════════╧═══════════╧══════════╝
```

### Liste des articles (si désactivé)

```
╔═══════════════════════════════════════════════════════════╗
║  Articles                                     [Ajouter]   ║
╠═════════════════════╤══════════════╤═══════════╤══════════╣
║ Titre               │ Auteur       │ Date      │ 🔗 Preview ║
╟─────────────────────┼──────────────┼───────────┼──────────╢
║ Mon article...     │ Admin        │ 2026-02-10│— WordPress║
║ Actualité...       │ Editor       │ 2026-02-09│— WordPress║
║ Communiqué...      │ Author       │ 2026-02-08│— WordPress║
╚═════════════════════╧══════════════╧═══════════╧══════════╝
```

**Légende :**
- **✓ Headless** (vert, gras) = Preview headless Next.js active
- **— WordPress** (gris) = Preview WordPress standard

## Scénarios d'utilisation

### Scénario 1 : Configuration complète

**Tous les CPT cochés, tous avec REST API :**

```
Configuration
├─ ☑ Articles (✓ REST)
├─ ☑ Pages (✓ REST)
├─ ☑ Événements (✓ REST)
├─ ☑ Ressources (✓ REST)
└─ ☑ Groupes Locaux (✓ REST)

Résultat
└─ 🟢 Tous utilisent preview headless
```

### Scénario 2 : Configuration partielle

**Seulement événements et ressources :**

```
Configuration
├─ ☐ Articles
├─ ☐ Pages
├─ ☑ Événements (✓ REST)
├─ ☑ Ressources (✓ REST)
└─ ☐ Groupes Locaux

Résultat
├─ Articles → 🔵 Preview WordPress
├─ Pages → 🔵 Preview WordPress
├─ Événements → 🟢 Preview headless
├─ Ressources → 🟢 Preview headless
└─ Groupes Locaux → 🔵 Preview WordPress
```

### Scénario 3 : CPT sans REST API

**Newsletter cochée mais sans REST API :**

```
Configuration
└─ ☑ Newsletter (✗ REST)  ⚠️

Résultat
└─ 🔴 Preview ne fonctionnera PAS
    │
    └─ Action requise :
       1. ACF > Post Types > Newsletter
       2. Activer "Show In REST API"
       3. Sauvegarder
```

## Messages et alertes

### Succès après sauvegarde

```
╔═══════════════════════════════════════════════════════════╗
║ ✓ Sélection des types de contenu enregistrée avec succès!║
╚═══════════════════════════════════════════════════════════╝
```

### Avertissement REST API désactivé

```
╔═══════════════════════════════════════════════════════════╗
║ ⚠ Attention : REST API désactivé                         ║
║                                                           ║
║ Le type de contenu "Newsletter" a été sélectionné mais   ║
║ son API REST est désactivée. La preview ne fonctionnera  ║
║ pas.                                                      ║
║                                                           ║
║ Solution : Activer "show_in_rest" dans la configuration  ║
║ du Custom Post Type.                                     ║
╚═══════════════════════════════════════════════════════════╝
```

## Interaction avec l'éditeur

### Gutenberg - Événement (activé)

```
┌─────────────────────────────────────────────────────────┐
│  Modifier l'événement                              [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [👁 Prévisualiser] ← Bouton violet headless           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Titre de l'événement                              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [Contenu de l'événement...]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

Clic sur Prévisualiser
        ↓
Ouverture de : https://lesetatsgenerauxcommunaux.org/api/preview
                ?secret=xxx&id=123&postType=evenement
        ↓
Redirection vers : https://lesetatsgenerauxcommunaux.org/evenements/titre-evenement
        ↓
🟢 Preview headless Next.js
```

### Gutenberg - Article (désactivé)

```
┌─────────────────────────────────────────────────────────┐
│  Modifier l'article                                [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [👁 Aperçu] ← Bouton standard WordPress               │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Titre de l'article                                │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [Contenu de l'article...]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘

Clic sur Aperçu
        ↓
Ouverture de : https://admin.lesetatsgenerauxcommunaux.org/?p=123&preview=true
        ↓
🔵 Preview WordPress standard
```

## Cas d'usage réels

### Cas 1 : Développement progressif

**Contexte :** Vous développez la preview headless progressivement

**Phase 1 - Test initial :**
```
☑ Événements uniquement
☐ Tous les autres
```

**Phase 2 - Ajout ressources :**
```
☑ Événements
☑ Ressources
☐ Tous les autres
```

**Phase 3 - Production :**
```
☑ Tous les types
```

### Cas 2 : Debug d'un CPT

**Contexte :** La preview d'un CPT ne fonctionne pas

**Configuration de debug :**
```
☑ Événements (fonctionne)
☑ Ressources (fonctionne)
☐ Groupe Locaux (en debug)  ← Désactivé temporairement
```

**Avantage :** Les éditeurs peuvent continuer à travailler sur les groupes locaux avec la preview WordPress pendant que vous corrigez le problème headless.

### Cas 3 : Types de contenu backend uniquement

**Contexte :** Certains CPT sont utilisés uniquement en backend (configurations, paramètres, etc.)

**Configuration :**
```
☑ Événements (public)
☑ Ressources (public)
☑ Groupes Locaux (public)
☐ Configuration Site (backend)
☐ Paramètres Theme (backend)
```

**Résultat :** Pas de bouton preview headless pour les types backend, ils n'ont pas besoin d'être prévisualisés côté frontend.

## Codes couleur

### Dans l'interface de sélection

| Badge | Couleur | Signification |
|-------|---------|---------------|
| **✓ REST** | 🟢 Vert | API REST activée - Preview OK |
| **✗ REST** | 🔴 Rouge | API REST désactivée - Preview KO |

### Dans la colonne de liste

| Indicateur | Couleur | Signification |
|------------|---------|---------------|
| **✓ Headless** | 🟢 Vert gras | Preview headless active |
| **— WordPress** | ⚪ Gris | Preview WordPress standard |

### Dans les notices

| Notice | Couleur | Type |
|--------|---------|------|
| Succès sauvegarde | 🟢 Vert | Success |
| REST désactivé | 🔴 Rouge | Error |
| Configuration incomplète | 🟡 Jaune | Warning |

## Résumé visuel

```
┌─────────────────────────────────────────────────────────┐
│                    WORKFLOW COMPLET                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. CONFIGURATION                                       │
│     ↓                                                   │
│     Réglages > Headless Preview                         │
│     ↓                                                   │
│     Cocher les CPT désirés                              │
│     ↓                                                   │
│     [Enregistrer]                                       │
│                                                         │
│  2. VÉRIFICATION                                        │
│     ↓                                                   │
│     Consulter la colonne "🔗 Preview"                   │
│     ↓                                                   │
│     ✓ = Headless / — = WordPress                        │
│                                                         │
│  3. UTILISATION                                         │
│     ↓                                                   │
│     Éditer un post                                      │
│     ↓                                                   │
│     Cliquer "Prévisualiser"                             │
│     ↓                                                   │
│     ┌─────────────┐     ┌─────────────┐               │
│     │ Si activé:  │     │ Si désactivé:│               │
│     │ Next.js     │     │ WordPress   │               │
│     └─────────────┘     └─────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Note :** Cette démo visuelle utilise des caractères ASCII pour représenter l'interface. L'interface réelle utilise HTML/CSS avec de vrais boutons, couleurs et interactions.
