# Guide d'intégration : Sélecteur de CPT pour Preview

## Vue d'ensemble

Ce snippet ajoute une interface dans **Réglages > Headless Preview** permettant de choisir quels Custom Post Types auront le bouton de preview headless.

### Fonctionnalités

✅ **Interface de sélection** - Checkboxes pour activer/désactiver chaque CPT
✅ **Badges visuels** - Indication "REST API activé/désactivé" pour chaque CPT
✅ **Filtrage automatique** - Les CPT désactivés utilisent la preview WordPress par défaut
✅ **Colonne dans la liste** - Indicateur visuel dans la liste des posts
✅ **Avertissements** - Alerte si un CPT sélectionné n'a pas REST API activé

## Installation

### Option 1 : Intégration dans le plugin (recommandé)

**Étape 1 :** Ouvrir le fichier `headless-preview.php` ou `headless-preview-improved.php`

**Étape 2 :** Copier TOUT le contenu de `preview-cpt-selector-snippet.php`

**Étape 3 :** Coller à la fin du fichier, juste avant la dernière ligne `?>` (si elle existe)

**Étape 4 :** Sauvegarder le fichier

**Étape 5 :** Rafraîchir la page WordPress admin

✅ **C'est fait !** Allez dans Réglages > Headless Preview pour voir la nouvelle section

### Option 2 : Via functions.php du thème

**Étape 1 :** Ouvrir `wp-content/themes/votre-theme/functions.php`

**Étape 2 :** Copier TOUT le contenu de `preview-cpt-selector-snippet.php`

**Étape 3 :** Coller à la fin du fichier

**Étape 4 :** Sauvegarder

⚠️ **Attention :** Si vous changez de thème, vous devrez réinstaller le snippet

### Option 3 : Plugin séparé

**Étape 1 :** Créer un dossier :
```
wp-content/plugins/headless-preview-cpt-selector/
```

**Étape 2 :** Créer un fichier dans ce dossier :
```
wp-content/plugins/headless-preview-cpt-selector/headless-preview-cpt-selector.php
```

**Étape 3 :** Ajouter l'en-tête de plugin au début du fichier :
```php
<?php
/**
 * Plugin Name: Headless Preview - CPT Selector
 * Description: Ajoute un sélecteur de CPT à Headless Preview
 * Version: 1.0.0
 * Requires Plugins: headless-preview
 */
```

**Étape 4 :** Coller le reste du code du snippet

**Étape 5 :** Activer le plugin dans WordPress admin

## Utilisation

### 1. Configuration initiale

1. Aller dans **Réglages > Headless Preview**
2. Scroller jusqu'à la section **"🎯 Sélection des types de contenu pour la preview"**
3. Vous verrez tous vos post types avec des checkboxes

### 2. Sélectionner les CPT

**Interface :**

```
🎯 Sélection des types de contenu pour la preview

┌─────────────────────────────────────────────┐
│ ☑ Articles                                  │
│   post (built-in) ✓ REST                   │
├─────────────────────────────────────────────┤
│ ☑ Pages                                     │
│   page (built-in) ✓ REST                   │
├─────────────────────────────────────────────┤
│ ☑ Événements                                │
│   evenement ✓ REST                          │
├─────────────────────────────────────────────┤
│ ☐ Ressources                                │
│   ressource ✓ REST                          │
└─────────────────────────────────────────────┘

[Enregistrer la sélection]
```

**Badges :**
- **✓ REST** (vert) = API REST activée → Preview fonctionnera
- **✗ REST** (rouge) = API REST désactivée → Preview NE fonctionnera PAS

### 3. Comportement

**CPT avec checkbox COCHÉE :**
- ✅ Bouton de preview personnalisé (violet avec icône)
- ✅ Redirection vers Next.js
- ✅ Utilise le secret pour sécuriser

**CPT avec checkbox DÉCOCHÉE :**
- ⚪ Bouton de preview WordPress standard
- ⚪ Pas de redirection headless
- ⚪ Preview WordPress classique

### 4. Vérification dans la liste

Une nouvelle colonne **"🔗 Preview"** apparaît dans la liste des posts :

| Titre | ... | 🔗 Preview |
|-------|-----|-----------|
| Mon événement | ... | **✓ Headless** |
| Ma ressource | ... | — WordPress |

- **✓ Headless** (vert) = Preview headless active pour ce type
- **— WordPress** (gris) = Preview WordPress standard

## Exemples d'utilisation

### Cas 1 : Activer preview seulement pour événements et ressources

**Contexte :** Vous voulez tester la preview headless uniquement sur certains CPT

**Configuration :**
```
☑ Événements
☑ Ressources
☐ Articles (reste en preview WordPress)
☐ Pages (reste en preview WordPress)
```

**Résultat :**
- Événements → Preview headless Next.js
- Ressources → Preview headless Next.js
- Articles → Preview WordPress standard
- Pages → Preview WordPress standard

### Cas 2 : Désactiver temporairement la preview pour un CPT

**Contexte :** La preview d'un CPT ne fonctionne pas, vous voulez le désactiver temporairement

**Configuration :**
```
☑ Événements (fonctionne)
☑ Ressources (fonctionne)
☐ Groupe Locaux (problème temporaire)
```

**Avantage :** Les éditeurs peuvent continuer à travailler avec la preview WordPress en attendant la correction

### Cas 3 : Activer tous les CPT publics

**Contexte :** Vous voulez la preview headless partout

**Configuration :**
```
☑ Tous les types cochés
```

**Résultat :** Tous les post types publics utilisent la preview headless

## FAQ

### Q1 : Que se passe-t-il si je décoche tout ?

**R :** Tous les types de contenu utiliseront la preview WordPress par défaut. Le plugin headless-preview reste actif mais n'intervient pas.

### Q2 : Dois-je redémarrer Next.js après modification ?

**R :** Non, c'est côté WordPress uniquement. Pas besoin de toucher à Next.js.

### Q3 : Un CPT a "✗ REST" (rouge), puis-je quand même l'activer ?

**R :** Vous pouvez cocher la case, mais **la preview ne fonctionnera pas** tant que vous n'avez pas activé `show_in_rest => true` pour ce CPT.

**Solution :**
1. Aller dans ACF > Post Types (si ACF)
2. Activer "Show In REST API"
3. Ou ajouter `'show_in_rest' => true` dans `register_post_type()`

### Q4 : La colonne "🔗 Preview" n'apparaît pas

**Cause :** Le snippet n'est pas correctement installé ou le post type ne supporte pas les colonnes personnalisées.

**Solution :**
1. Vérifier que le snippet est bien chargé
2. Vider le cache WordPress
3. Rafraîchir la page avec Ctrl+F5

### Q5 : Comment revenir à la configuration par défaut ?

**Option 1 :** Cocher tous les CPT manuellement

**Option 2 :** Supprimer l'option en base de données :
```sql
DELETE FROM wp_options WHERE option_name = 'headless_preview_enabled_post_types';
```

**Option 3 :** Via WordPress admin :
```php
delete_option('headless_preview_enabled_post_types');
```

## Personnalisation

### Changer les CPT activés par défaut

Par défaut, **tous** les CPT publics sont activés. Pour changer :

**Éditer la fonction `headless_preview_get_enabled_post_types()` :**

```php
function headless_preview_get_enabled_post_types() {
    // AVANT (tous activés par défaut)
    $default_enabled = array_keys(get_post_types(['public' => true], 'names'));

    // APRÈS (seulement post, page et evenement par défaut)
    $default_enabled = ['post', 'page', 'evenement'];

    $enabled = get_option('headless_preview_enabled_post_types', $default_enabled);
    return is_array($enabled) ? $enabled : $default_enabled;
}
```

### Cacher certains CPT du sélecteur

Pour ne pas afficher certains CPT dans la liste :

**Éditer `headless_preview_get_cpt_selector_html()` :**

```php
<?php foreach ($all_post_types as $post_type): ?>
    <?php
    // Ignorer attachment et vos CPT cachés
    $hidden_types = ['attachment', 'acf-field-group', 'wp_block'];
    if (in_array($post_type->name, $hidden_types)) {
        continue;
    }
    ?>
```

### Changer le style des checkboxes

**Éditer la section `<style>` dans `headless_preview_add_cpt_selector_to_settings()` :**

```css
.cpt-checkbox-item {
    display: flex;
    align-items: flex-start;
    padding: 15px;  /* Plus d'espace */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* Fond dégradé */
    border-radius: 8px;  /* Coins plus arrondis */
    /* ... */
}
```

## Dépannage

### Problème : La section ne s'affiche pas

**Causes possibles :**
1. Le snippet n'est pas chargé
2. Conflit JavaScript avec un autre plugin
3. jQuery n'est pas chargé

**Solutions :**
1. Vérifier que le code est bien dans le plugin ou functions.php
2. Ouvrir la console du navigateur (F12) pour voir les erreurs
3. Désactiver temporairement d'autres plugins

### Problème : Les paramètres ne se sauvegardent pas

**Causes possibles :**
1. Permissions insuffisantes
2. Nonce invalide
3. Conflit avec un plugin de cache

**Solutions :**
1. Vérifier que vous êtes administrateur
2. Vider le cache WordPress
3. Désactiver temporairement le cache

### Problème : Tous les CPT sont toujours en preview headless

**Cause :** Le filtre ne s'applique pas correctement

**Solution :**
1. Vérifier la priorité des hooks (5 pour ce snippet)
2. Vérifier que le plugin headless-preview charge après ce snippet
3. Ajouter des logs pour debug :

```php
function headless_preview_selective_link($preview_link, $post) {
    error_log('Testing post type: ' . $post->post_type);
    error_log('Is enabled: ' . (headless_preview_is_post_type_enabled($post->post_type) ? 'yes' : 'no'));
    // ... reste du code
}
```

## Code technique

### Hooks utilisés

| Hook | Priorité | Usage |
|------|----------|-------|
| `preview_post_link` | 5 | Filtre le lien de preview |
| `post_row_actions` | 5 | Filtre les actions de la liste |
| `manage_posts_columns` | 10 | Ajoute la colonne Preview |
| `admin_footer` | 10 | Injecte l'interface de sélection |
| `admin_init` | 10 | Enregistre les paramètres |

**Priorité 5 = AVANT** le plugin headless-preview (qui utilise 10)

### Options WordPress

| Option | Type | Description |
|--------|------|-------------|
| `headless_preview_enabled_post_types` | array | Liste des CPT avec preview activée |

**Exemple de valeur :**
```php
['post', 'page', 'evenement', 'ressource']
```

### Fonctions principales

| Fonction | Usage |
|----------|-------|
| `headless_preview_get_enabled_post_types()` | Récupère la liste des CPT activés |
| `headless_preview_is_post_type_enabled($type)` | Vérifie si un CPT est activé |
| `headless_preview_selective_link($link, $post)` | Filtre le lien de preview |
| `headless_preview_get_cpt_selector_html()` | Génère l'interface de sélection |

## Checklist d'installation

- [ ] Snippet copié dans le plugin ou functions.php
- [ ] Page WordPress admin rafraîchie (Ctrl+F5)
- [ ] Section visible dans Réglages > Headless Preview
- [ ] Checkboxes fonctionnelles
- [ ] Badges ✓ REST / ✗ REST affichés
- [ ] Bouton "Enregistrer" présent
- [ ] Test : Décocher un CPT et tester la preview
- [ ] Colonne "🔗 Preview" visible dans la liste
- [ ] Indicateurs ✓ Headless / — WordPress affichés

## Support

Si vous rencontrez des problèmes :

1. **Vérifier les logs WordPress** (si WP_DEBUG activé)
2. **Ouvrir la console navigateur** (F12) pour voir les erreurs JS
3. **Tester avec tous les autres plugins désactivés** (conflit possible)
4. **Vérifier les permissions** (doit être administrateur)

## Résumé

✅ **Installation simple** : Copier-coller dans le plugin
✅ **Interface intuitive** : Checkboxes avec badges visuels
✅ **Flexible** : Activer/désactiver par CPT
✅ **Indicateurs visuels** : Colonne dans la liste
✅ **Compatible** : Fonctionne avec headless-preview existant

---

**Fichier source :** `preview-cpt-selector-snippet.php`
**Compatibilité :** WordPress 5.0+, headless-preview 1.0+
**Testé avec :** Gutenberg, Classic Editor, ACF
