# WordPress Integration - Files d'intégration

Ce dossier contient tous les fichiers nécessaires pour intégrer la preview headless avec WordPress.

## 📁 Fichiers disponibles

### Plugins WordPress

| Fichier | Description | Usage |
|---------|-------------|-------|
| **headless-preview-plugin.php** | Plugin WordPress complet avec interface admin | Plugin autonome avec page de paramètres |
| **headless-preview-endpoint.php** | Endpoint REST API uniquement | À intégrer dans functions.php ou un plugin existant |
| **preview-cpt-selector-snippet.php** | ⭐ Sélecteur de CPT pour choisir quels types ont la preview | À ajouter au plugin ou functions.php |

### Documentation

| Fichier | Description |
|---------|-------------|
| **README-PREVIEW.md** | Guide complet de configuration de la preview |
| **INTEGRATION-CPT-SELECTOR.md** | Guide d'intégration du sélecteur de CPT |
| **cpt-selector-demo.md** | Démo visuelle du sélecteur de CPT |
| **README.md** | Ce fichier |

### Autres fichiers

| Fichier | Description |
|---------|-------------|
| **functions-egc.php** | Fonctions spécifiques EGC (page Les EGC) |
| **newsletter-endpoint.php** | Endpoint pour l'inscription newsletter |
| **page-les-egc.php** | Template page Les EGC |
| **titres-pages-darchives-endpoint.php** | Endpoint pour les titres des pages d'archives |
| **cors-headers.php** | Configuration CORS pour l'API REST |

## 🚀 Installation rapide

### Option 1 : Plugin complet (recommandé)

**Pour :** Configuration complète avec interface admin

1. Créer le dossier : `wp-content/plugins/headless-preview/`
2. Copier `headless-preview-plugin.php` dans ce dossier
3. Activer le plugin dans WordPress admin
4. Aller dans Réglages > Headless Preview pour configurer

### Option 2 : Endpoint uniquement

**Pour :** Intégration minimale dans un thème ou plugin existant

1. Copier `headless-preview-endpoint.php` dans votre thème
2. Ajouter dans `functions.php` :
   ```php
   require_once get_template_directory() . '/headless-preview-endpoint.php';
   ```

### Option 3 : Plugin + Sélecteur CPT (recommandé avancé)

**Pour :** Configuration complète avec contrôle granulaire par CPT

1. Installer le plugin (Option 1)
2. Ouvrir `headless-preview-plugin.php`
3. Copier le contenu de `preview-cpt-selector-snippet.php`
4. Coller à la fin du fichier (avant `?>`)
5. Sauvegarder et recharger l'admin WordPress

## 📋 Checklist d'installation

### Étape 1 : WordPress

- [ ] Plugin installé et activé
- [ ] Endpoint `/wp-json/headless-preview/v1/post-types` accessible
- [ ] Frontend URL configurée dans les paramètres
- [ ] Preview Secret généré et configuré

### Étape 2 : Vérification des CPT

- [ ] Tous les CPT ont `show_in_rest => true`
- [ ] Test de l'endpoint avec navigateur
- [ ] Vérification dans Réglages > Headless Preview
- [ ] Tableau de diagnostic tout en vert

### Étape 3 : Next.js

- [ ] Fichier `.env.local` configuré
- [ ] Variables `WP_PREVIEW_API` et `WP_PREVIEW_SECRET` définies
- [ ] Correction de `fetchDraftPost` appliquée (utilise `getPostTypeEndpointAsync`)
- [ ] Serveur Next.js redémarré

### Étape 4 : Tests

- [ ] Test de preview sur un article standard
- [ ] Test de preview sur un événement
- [ ] Test de preview sur une ressource
- [ ] Test de preview sur un groupe local
- [ ] Vérification que le secret est requis (test sans secret = erreur)

## 🎯 Fichiers par cas d'usage

### Je veux : Preview headless basique

**Fichiers nécessaires :**
- ✅ `headless-preview-endpoint.php` OU `headless-preview-plugin.php`

**Configuration :**
1. Installer le fichier
2. Configurer URL frontend et secret
3. Tester

### Je veux : Preview headless avec interface admin

**Fichiers nécessaires :**
- ✅ `headless-preview-plugin.php`

**Configuration :**
1. Installer le plugin
2. Configurer dans Réglages > Headless Preview
3. Tester

### Je veux : Choisir quels CPT ont la preview

**Fichiers nécessaires :**
- ✅ `headless-preview-plugin.php`
- ✅ `preview-cpt-selector-snippet.php`

**Configuration :**
1. Installer le plugin
2. Intégrer le snippet
3. Aller dans Réglages > Headless Preview
4. Cocher/décocher les CPT désirés
5. Enregistrer

### Je veux : Tout comprendre avant d'installer

**Documentation à lire :**
1. ✅ `README-PREVIEW.md` - Vue d'ensemble
2. ✅ `INTEGRATION-CPT-SELECTOR.md` - Sélecteur de CPT
3. ✅ `cpt-selector-demo.md` - Démo visuelle

## 🔧 Configuration détaillée

### Variables WordPress

**Via wp-config.php :**
```php
define('HEADLESS_FRONTEND_URL', 'https://lesetatsgenerauxcommunaux.org');
define('WP_PREVIEW_SECRET', 'votre-secret-securise');
```

**Via interface admin :**
1. Réglages > Headless Preview
2. Frontend URL : `https://lesetatsgenerauxcommunaux.org`
3. Preview Secret : `[généré avec crypto.randomBytes]`

### Variables Next.js

**Fichier `.env.local` :**
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://admin.lesetatsgenerauxcommunaux.org/wp-json/wp/v2
WP_PREVIEW_API=https://admin.lesetatsgenerauxcommunaux.org/wp-json
WP_PREVIEW_SECRET=le-même-secret-que-wordpress
SITE_DOMAIN=lesetatsgenerauxcommunaux.org
```

## 🐛 Dépannage

### Problème : Endpoint 404

**Solutions :**
1. Aller dans Réglages > Permaliens et cliquer "Enregistrer"
2. Vérifier que le plugin est activé
3. Vider le cache WordPress
4. Tester directement l'URL dans le navigateur

**Test :**
```
https://admin.lesetatsgenerauxcommunaux.org/wp-json/headless-preview/v1/post-types
```

### Problème : Preview retourne 404 pour CPT

**Causes :**
- Le CPT n'a pas `show_in_rest => true`
- Le `rest_base` est incorrect
- Next.js n'a pas la correction `fetchDraftPost`

**Solutions :**
1. Vérifier dans Réglages > Headless Preview (tableau de diagnostic)
2. Si rouge : activer REST API pour le CPT
3. Si ACF : ACF > Post Types > [CPT] > Show In REST API
4. Si code : ajouter `'show_in_rest' => true` dans `register_post_type()`

### Problème : "Invalid preview secret"

**Solutions :**
1. Vérifier que le secret est identique dans WordPress ET Next.js
2. Pas d'espaces avant/après le secret
3. Redémarrer le serveur Next.js après modification `.env.local`

## 📊 Architecture

### Flux de preview

```
WordPress Editor
      ↓
Clic "Prévisualiser"
      ↓
Bouton personnalisé (plugin)
      ↓
Génère URL : /api/preview?secret=xxx&id=123&postType=evenement
      ↓
Next.js vérifie le secret
      ↓
Appelle endpoint WordPress : /wp-json/headless-preview/v1/post-types
      ↓
Récupère rest_base pour le CPT
      ↓
Fetch content : /wp-json/wp/v2/evenement/123
      ↓
Affiche la preview
```

### Endpoints WordPress

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/wp-json/headless-preview/v1/post-types` | GET | Liste des CPT avec leur rest_base |
| `/wp-json/wp/v2/posts` | GET | Articles standard |
| `/wp-json/wp/v2/pages` | GET | Pages |
| `/wp-json/wp/v2/evenement` | GET | Événements (CPT) |
| `/wp-json/wp/v2/ressource` | GET | Ressources (CPT) |
| `/wp-json/wp/v2/groupe-locaux` | GET | Groupes locaux (CPT) |

## 📝 Fichiers par fonctionnalité

### Preview headless

| Fonctionnalité | Fichier(s) |
|----------------|-----------|
| Endpoint REST API | `headless-preview-endpoint.php` |
| Plugin complet | `headless-preview-plugin.php` |
| Documentation | `README-PREVIEW.md` |

### Sélecteur de CPT

| Fonctionnalité | Fichier(s) |
|----------------|-----------|
| Snippet sélecteur | `preview-cpt-selector-snippet.php` |
| Guide d'intégration | `INTEGRATION-CPT-SELECTOR.md` |
| Démo visuelle | `cpt-selector-demo.md` |

### Autres endpoints

| Fonctionnalité | Fichier(s) |
|----------------|-----------|
| Newsletter | `newsletter-endpoint.php` |
| Titres pages archives | `titres-pages-darchives-endpoint.php` |
| Page Les EGC | `functions-egc.php`, `page-les-egc.php` |
| CORS | `cors-headers.php` |

## 🎓 Pour aller plus loin

### Personnalisation du sélecteur de CPT

**Voir :** `INTEGRATION-CPT-SELECTOR.md` section "Personnalisation"

- Changer les CPT activés par défaut
- Cacher certains CPT du sélecteur
- Modifier le style des checkboxes
- Ajouter des validations personnalisées

### Développement de nouveaux endpoints

**Exemple :** Ajouter un endpoint pour des données personnalisées

```php
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/my-data', [
        'methods'  => 'GET',
        'callback' => 'get_my_custom_data',
        'permission_callback' => '__return_true',
    ]);
});

function get_my_custom_data() {
    // Votre logique
    return rest_ensure_response(['data' => 'value']);
}
```

## 🔗 Liens utiles

### Documentation WordPress

- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Custom Post Types](https://developer.wordpress.org/plugins/post-types/)
- [ACF REST API](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/)

### Documentation Next.js

- [Draft Mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Projet

- [GitHub du projet](https://github.com/votre-repo)
- [Site de production](https://lesetatsgenerauxcommunaux.org)
- [Admin WordPress](https://admin.lesetatsgenerauxcommunaux.org)

## 📧 Support

Pour toute question ou problème :

1. Consulter `README-PREVIEW.md` (guide complet)
2. Vérifier le tableau de diagnostic (Réglages > Headless Preview)
3. Activer WP_DEBUG et consulter `debug.log`
4. Vérifier les logs Next.js dans le terminal

## 📄 Licence

Tous les fichiers de ce dossier sont sous licence MIT - Libre d'utilisation et de modification.

---

**Dernière mise à jour :** 2026-02-10
**Version des plugins :** 1.1.0
**Compatibilité WordPress :** 5.0+
**Compatibilité Next.js :** 13+
