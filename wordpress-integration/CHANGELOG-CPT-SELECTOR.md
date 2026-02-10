# Changelog : Sélecteur de CPT pour Preview

## Version 2 vs Version 1

### Version 1 (preview-cpt-selector-snippet.php)

**Comportement :**
- ✅ CPT coché → Preview headless Next.js
- 🔵 CPT décoché → Preview WordPress native

**Cas d'usage :**
- Vous voulez tester progressivement la preview headless
- Vous voulez garder la preview WordPress comme fallback
- Certains CPT doivent utiliser la preview WordPress

### Version 2 (preview-cpt-selector-snippet-v2.php) ⭐ NOUVEAU

**Comportement :**
- ✅ CPT coché → Preview headless Next.js
- 🚫 CPT décoché → **AUCUN bouton de preview** (ni natif, ni plugin)

**Cas d'usage :**
- Vous ne voulez pas de preview du tout pour certains CPT
- CPT utilisés uniquement en backend (configurations, paramètres)
- Vous voulez forcer la publication sans preview

## Comparaison détaillée

### Interface de sélection

#### Version 1
```
☑ Événements → Preview headless
☐ Articles → Preview WordPress native
```

#### Version 2
```
☑ Événements → Preview headless
☐ Articles 🚫 Preview OFF → AUCUNE preview
```

### Badges visuels

#### Version 1
| Badge | Signification |
|-------|---------------|
| ✓ REST | API REST activée |
| ✗ REST | API REST désactivée |

#### Version 2
| Badge | Signification |
|-------|---------------|
| ✓ REST | API REST activée |
| ✗ REST | API REST désactivée |
| 🚫 Preview OFF | Aucun bouton de preview |

### Colonne dans la liste

#### Version 1
| Indicateur | Signification |
|------------|---------------|
| ✓ Headless | Preview headless |
| — WordPress | Preview WordPress |

#### Version 2
| Indicateur | Signification |
|------------|---------------|
| ✓ Headless | Preview headless |
| 🚫 OFF | Pas de preview du tout |

### Éditeur Gutenberg

#### Version 1 - CPT décoché
```
┌────────────────────────────┐
│ [👁 Aperçu] ← WordPress   │
│                            │
│ Titre de l'article...      │
└────────────────────────────┘
```

#### Version 2 - CPT décoché
```
┌────────────────────────────┐
│ (Pas de bouton)            │
│                            │
│ Titre de l'article...      │
└────────────────────────────┘
```

### Actions dans la liste

#### Version 1 - CPT décoché
```
Modifier | Aperçu | Corbeille
         ↑
    Preview WP
```

#### Version 2 - CPT décoché
```
Modifier | Corbeille
(Pas de lien aperçu)
```

## Nouvelles fonctionnalités V2

### 1. Suppression complète des boutons

**Gutenberg :**
- ✅ CSS pour cacher tous les boutons de preview
- ✅ JavaScript pour supprimer les boutons du DOM
- ✅ Bloque même les boutons ajoutés dynamiquement

**Classic Editor :**
- ✅ CSS pour cacher le bouton natif
- ✅ jQuery pour supprimer tous les liens de preview
- ✅ Retire "Aperçu des modifications"

### 2. Blocage de la preview par URL

Si quelqu'un essaie d'accéder directement :
```
/?p=123&preview=true
```

**V1 :** Affiche la preview WordPress
**V2 :** Redirige vers l'éditeur avec message d'erreur

### 3. Notice admin explicite

**Message affiché :**
```
╔═══════════════════════════════════════════════════════╗
║ ⚠ Preview désactivée                                 ║
║                                                       ║
║ La fonctionnalité de preview est désactivée pour ce  ║
║ type de contenu. Publiez ou enregistrez en brouillon ║
║ pour voir le résultat.                                ║
╚═══════════════════════════════════════════════════════╝
```

### 4. Encadré d'avertissement

Dans l'interface de sélection :
```
╔═══════════════════════════════════════════════════════╗
║ ⚠️ Comportement :                                     ║
║                                                       ║
║ • ✓ Coché : Bouton de preview headless               ║
║ • ☐ Décoché : AUCUN bouton de preview                ║
╚═══════════════════════════════════════════════════════╝
```

## Code différentiel

### Changement 1 : Retour null au lieu du lien

**V1 :**
```php
if (!headless_preview_is_post_type_enabled($post->post_type)) {
    return $preview_link; // Garde le lien WordPress
}
```

**V2 :**
```php
if (!headless_preview_is_post_type_enabled($post->post_type)) {
    return null; // Supprime complètement le lien
}
```

### Changement 2 : Fonctions de suppression ajoutées

**V2 ajoute :**
- `headless_preview_hide_button_for_disabled_cpt()` - Cache boutons Gutenberg
- `headless_preview_hide_classic_preview()` - Cache boutons Classic Editor
- `headless_preview_disable_direct_preview()` - Bloque accès URL directe
- `headless_preview_disabled_notice()` - Affiche message d'erreur

### Changement 3 : Actions de la liste

**V1 :**
```php
if (!headless_preview_is_post_type_enabled($post->post_type)) {
    unset($actions['headless_preview']); // Retire seulement notre action
}
```

**V2 :**
```php
if (!headless_preview_is_post_type_enabled($post->post_type)) {
    unset($actions['view']);           // Retire view
    unset($actions['preview']);        // Retire preview
    unset($actions['headless_preview']); // Retire notre action
}
```

## Quelle version choisir ?

### Utilisez Version 1 si :

- ✅ Vous testez progressivement la preview headless
- ✅ Vous voulez garder la preview WordPress comme option
- ✅ Vous avez besoin d'une période de transition
- ✅ Vos éditeurs utilisent encore beaucoup la preview WordPress

**Exemple :**
```
Phase 1 : ☑ Événements (headless), ☐ Articles (WordPress)
Phase 2 : ☑ Événements, ☑ Ressources (headless), ☐ Articles (WordPress)
Phase 3 : ☑ Tous (headless)
```

### Utilisez Version 2 si :

- ✅ Vous ne voulez PAS de preview pour certains CPT
- ✅ Certains CPT sont backend-only (configurations, paramètres)
- ✅ Vous voulez forcer vos éditeurs à publier sans preview
- ✅ Vous voulez une séparation nette : preview headless ou rien

**Exemple :**
```
☑ Événements (headless)
☑ Ressources (headless)
☐ Configuration Site (pas de preview - backend only)
☐ Paramètres Theme (pas de preview - backend only)
```

## Migration V1 → V2

### Étape 1 : Backup

Sauvegarder votre fichier actuel (V1) :
```
wp-content/plugins/headless-preview/headless-preview-v1-backup.php
```

### Étape 2 : Remplacer le code

1. Ouvrir le fichier avec V1
2. Supprimer tout le code du snippet V1
3. Copier tout le code du snippet V2
4. Coller à la place

### Étape 3 : Tester

**Test 1 : CPT coché**
1. Éditer un événement (coché)
2. Vérifier que le bouton violet "Prévisualiser" apparaît
3. Cliquer et vérifier la redirection vers Next.js

**Test 2 : CPT décoché**
1. Décocher "Articles" dans les paramètres
2. Sauvegarder
3. Éditer un article
4. Vérifier qu'**AUCUN** bouton de preview n'apparaît
5. Essayer d'accéder à `/?p=123&preview=true`
6. Vérifier la redirection vers l'éditeur

### Étape 4 : Vérifier la liste

Aller dans la liste des posts/pages et vérifier la colonne "Preview" :
- ✓ Headless = OK
- 🚫 OFF = OK (au lieu de "— WordPress" en V1)

## Compatibilité

| Fonctionnalité | V1 | V2 |
|----------------|----|----|
| WordPress 5.0+ | ✅ | ✅ |
| Gutenberg | ✅ | ✅ |
| Classic Editor | ✅ | ✅ |
| ACF | ✅ | ✅ |
| Page Builders | ⚠️ Partiel | ⚠️ Partiel |

**Note sur les Page Builders :**
Elementor, Divi, etc. peuvent avoir leurs propres boutons de preview. Le snippet essaie de les cacher mais ce n'est pas garanti à 100%.

## FAQ

### Q1 : Puis-je avoir les deux versions en même temps ?

**R :** Non, choisissez une seule version. Elles modifient les mêmes hooks.

### Q2 : Si je décoche tout, que se passe-t-il ?

**V1 :** Tous les CPT utilisent la preview WordPress
**V2 :** Aucun CPT n'a de bouton de preview

### Q3 : Comment revenir à V1 depuis V2 ?

**R :** Remplacer le code V2 par le code V1 dans le plugin.

### Q4 : La V2 empêche-t-elle vraiment TOUTE preview ?

**R :** Oui, elle :
- Cache les boutons via CSS
- Supprime les boutons via JavaScript
- Bloque l'accès par URL directe
- Retire les liens dans les listes

Il reste théoriquement possible de contourner en manipulant directement la base de données, mais c'est bloqué pour un usage normal.

### Q5 : Mes éditeurs sont perdus sans preview, que faire ?

**R :** Options :
1. Revenir à V1 temporairement
2. Former les éditeurs à publier sans preview
3. Activer la preview headless pour tous les CPT
4. Utiliser "Enregistrer en brouillon" puis voir sur le site

## Support

### Problèmes V1

- Preview WordPress ne fonctionne pas pour CPT décoché
- Le bouton WordPress n'apparaît pas

**Solution :** Vérifier que WordPress supporte la preview pour ce CPT

### Problèmes V2

- Des boutons de preview apparaissent encore
- La preview fonctionne encore via URL

**Solution :**
1. Vider le cache du navigateur (Ctrl+Shift+Del)
2. Vérifier que le code V2 est bien chargé
3. Tester en navigation privée
4. Vérifier qu'un autre plugin ne réactive pas la preview

## Résumé

| Aspect | V1 | V2 |
|--------|----|----|
| **CPT coché** | Preview headless | Preview headless |
| **CPT décoché** | Preview WordPress | **AUCUNE preview** |
| **Use case** | Migration progressive | Contrôle strict |
| **Complexité** | Simple | Avancé |
| **Blocage** | Partiel | Complet |

---

**Version actuelle :** V2 (2026-02-10)
**Compatibilité :** Backward compatible (peut remplacer V1)
**Breaking changes :** Comportement différent pour CPT décochés
