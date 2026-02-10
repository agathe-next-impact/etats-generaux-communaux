# Configuration de la Preview pour les Custom Post Types (CPT)

## Problèmes résolus

1. ✅ **Bug dans fetchDraftPost** : Utilisation de `getPostTypeEndpointAsync` au lieu de `getPostTypeEndpoint`
2. ✅ **Endpoint WordPress manquant** : Création de `/wp-json/headless-preview/v1/post-types`

## Installation côté WordPress

### Étape 1 : Installer l'endpoint WordPress

**Option A : Via le thème (recommandé)**

1. Copier le fichier `headless-preview-endpoint.php` dans votre thème WordPress :
   ```
   wp-content/themes/votre-theme/headless-preview-endpoint.php
   ```

2. Ajouter dans `functions.php` de votre thème :
   ```php
   <?php
   // Activer le support de la preview headless
   require_once get_template_directory() . '/headless-preview-endpoint.php';
   ```

**Option B : Créer un plugin**

1. Créer un dossier : `wp-content/plugins/headless-preview/`
2. Créer `wp-content/plugins/headless-preview/headless-preview.php` :
   ```php
   <?php
   /**
    * Plugin Name: Headless Preview Support
    * Description: Expose custom post type information for Next.js preview
    * Version: 1.0
    */

   require_once plugin_dir_path(__FILE__) . '../../../wordpress-integration/headless-preview-endpoint.php';
   ```
3. Activer le plugin dans l'admin WordPress

### Étape 2 : Vérifier que les CPT sont exposés dans l'API REST

Pour que la preview fonctionne, vos Custom Post Types **DOIVENT** avoir `show_in_rest => true`.

**Si vous utilisez ACF :**

1. Aller dans ACF > Post Types
2. Pour chaque CPT (evenement, ressource, groupe-locaux), vérifier :
   - **Show In REST API** : Activé (✓)
   - **REST API base slug** : Définir si différent du nom du CPT
     - `evenement` → `evenement` (ou laissez vide pour auto)
     - `ressource` → `ressource`
     - `groupe-locaux` → `groupe-locaux`

**Si vous utilisez register_post_type() :**

```php
register_post_type('evenement', [
    'labels' => [...],
    'public' => true,
    'show_in_rest' => true,  // ← OBLIGATOIRE pour la preview !
    'rest_base' => 'evenement', // Optionnel, par défaut = nom du CPT
    // ... autres paramètres
]);
```

### Étape 3 : Tester l'endpoint

1. Visiter : `https://admin.lesetatsgenerauxcommunaux.org/wp-json/headless-preview/v1/post-types`
2. Vous devriez voir une réponse JSON comme :
   ```json
   {
     "post": {
       "rest_base": "posts",
       "label": "Articles",
       "name": "post",
       "public": true,
       "hierarchical": false
     },
     "page": {
       "rest_base": "pages",
       "label": "Pages",
       "name": "page",
       "public": true,
       "hierarchical": true
     },
     "evenement": {
       "rest_base": "evenement",
       "label": "Événements",
       "name": "evenement",
       "public": true,
       "hierarchical": false
     },
     "ressource": {
       "rest_base": "ressource",
       "label": "Ressources",
       "name": "ressource",
       "public": true,
       "hierarchical": false
     },
     "groupe-locaux": {
       "rest_base": "groupe-locaux",
       "label": "Groupes Locaux",
       "name": "groupe-locaux",
       "public": true,
       "hierarchical": false
     }
   }
   ```

## Configuration côté Next.js

### Étape 4 : Ajouter le secret de preview (optionnel mais recommandé)

1. Modifier `.env.local` :
   ```env
   NEXT_PUBLIC_WORDPRESS_API_URL=https://admin.lesetatsgenerauxcommunaux.org/wp-json/wp/v2
   SITE_DOMAIN=lesetatsgenerauxcommunaux.org
   GOOGLE_MAPS_API_KEY=AIzaSyAJDr0RO94oujxYDtqXZTL1HIMHEK6WBHo

   # Ajouter ces lignes :
   WP_PREVIEW_API=https://admin.lesetatsgenerauxcommunaux.org/wp-json
   WP_PREVIEW_SECRET=votre-secret-aleatoire-securise
   ```

2. Générer un secret sécurisé :
   ```bash
   # Option 1 : Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Option 2 : PowerShell (Windows)
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

3. Ajouter le même secret dans WordPress (dans `wp-config.php` ou via plugin) :
   ```php
   define('WP_PREVIEW_SECRET', 'votre-secret-aleatoire-securise');
   ```

## Test de la preview

### Tester avec un événement

1. Dans WordPress, créer ou modifier un événement
2. Cliquer sur "Aperçu" ou "Preview"
3. L'URL devrait être :
   ```
   https://lesetatsgenerauxcommunaux.org/api/preview?secret=VOTRE_SECRET&id=123&postType=evenement
   ```
4. Vous devriez être redirigé vers :
   ```
   https://lesetatsgenerauxcommunaux.org/evenement/slug-de-levenement?preview=true&id=123&postType=evenement
   ```

### Vérifier les logs

Si la preview ne fonctionne pas, vérifier :

1. **Console navigateur** : Ouvrir les DevTools et vérifier les erreurs
2. **Logs Next.js** : Dans votre terminal où Next.js tourne
3. **Logs WordPress** : Si `WP_DEBUG` est activé, vérifier `wp-content/debug.log`

## Dépannage

### La preview retourne 404

**Causes possibles :**

1. Le CPT n'est pas exposé dans l'API REST
   - **Solution** : Activer `show_in_rest => true` (voir Étape 2)

2. Le `rest_base` est différent du nom du CPT
   - **Solution** : Vérifier l'endpoint `/wp-json/headless-preview/v1/post-types`

3. L'endpoint n'existe pas
   - **Solution** : Installer le fichier `headless-preview-endpoint.php` (voir Étape 1)

### La preview affiche une ancienne version

**Cause** : Le cache Next.js n'est pas invalidé

**Solution** :
```bash
# Forcer le rebuild du cache
npm run build
npm run dev
```

### "Invalid preview secret"

**Causes possibles :**

1. Le secret n'est pas défini dans `.env.local`
   - **Solution** : Ajouter `WP_PREVIEW_SECRET` (voir Étape 4)

2. Le secret ne correspond pas entre WordPress et Next.js
   - **Solution** : Vérifier que les deux utilisent le même secret

## URLs de preview WordPress

Pour configurer la preview dans WordPress, vous devez modifier les URLs de preview.

### Méthode 1 : Plugin WordPress (recommandé)

Installer un plugin comme "Headless Mode" ou "WPGraphQL" qui gère automatiquement les URLs de preview.

### Méthode 2 : Filtre WordPress

Ajouter dans `functions.php` ou dans un plugin :

```php
<?php
/**
 * Change preview link for headless frontend
 */
add_filter('preview_post_link', 'set_headless_preview_link', 10, 2);

function set_headless_preview_link($preview_link, $post) {
    $frontend_url = 'https://lesetatsgenerauxcommunaux.org';
    $preview_secret = defined('WP_PREVIEW_SECRET') ? WP_PREVIEW_SECRET : '';

    $preview_url = add_query_arg([
        'secret' => $preview_secret,
        'id' => $post->ID,
        'postType' => $post->post_type,
    ], $frontend_url . '/api/preview');

    return $preview_url;
}
```

## Checklist de vérification

- [ ] Le fichier `headless-preview-endpoint.php` est installé dans WordPress
- [ ] L'endpoint `/wp-json/headless-preview/v1/post-types` fonctionne
- [ ] Tous les CPT ont `show_in_rest => true`
- [ ] `WP_PREVIEW_SECRET` est défini dans `.env.local` (optionnel)
- [ ] Le filtre `preview_post_link` est configuré dans WordPress
- [ ] Le bug `fetchDraftPost` est corrigé dans Next.js
- [ ] La preview fonctionne pour les articles et pages standard
- [ ] La preview fonctionne pour les CPT (evenement, ressource, groupe-locaux)

## Support

Si la preview ne fonctionne toujours pas après avoir suivi ces étapes :

1. Vérifier la console du navigateur pour les erreurs JavaScript
2. Vérifier les logs Next.js pour les erreurs d'API
3. Tester l'endpoint REST directement : `https://admin.lesetatsgenerauxcommunaux.org/wp-json/wp/v2/evenement/ID`
4. Vérifier que l'utilisateur WordPress a les permissions de voir les brouillons
