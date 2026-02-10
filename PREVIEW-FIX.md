# Fix de la Preview des Custom Post Types (CPT)

## Résumé des problèmes identifiés et résolus

### Problème 1 : Bug dans fetchDraftPost ✅ RÉSOLU

**Fichier :** [lib/wordpress-api.ts:193](lib/wordpress-api.ts#L193)

**Problème :** La fonction `fetchDraftPost` utilisait `getPostTypeEndpoint()` (synchrone) au lieu de `getPostTypeEndpointAsync()` (asynchrone).

**Impact :** Les Custom Post Types créés avec ACF n'étaient pas correctement reconnus car leurs endpoints REST n'étaient pas récupérés depuis WordPress.

**Solution appliquée :**
```typescript
// AVANT (incorrect)
const endpoint = getPostTypeEndpoint(postType);

// APRÈS (correct)
const endpoint = await getPostTypeEndpointAsync(postType);
```

### Problème 2 : Endpoint WordPress manquant ⚠️ À INSTALLER

**Endpoint manquant :** `/wp-json/headless-preview/v1/post-types`

**Problème :** Le code Next.js essaie d'appeler cet endpoint pour récupérer les mappings des CPT, mais il n'existe pas dans WordPress.

**Solution créée :**
- ✅ Fichier créé : [wordpress-integration/headless-preview-endpoint.php](wordpress-integration/headless-preview-endpoint.php)
- ✅ Plugin WordPress créé : [wordpress-integration/headless-preview-plugin.php](wordpress-integration/headless-preview-plugin.php)
- ✅ Guide d'installation : [wordpress-integration/README-PREVIEW.md](wordpress-integration/README-PREVIEW.md)

### Problème 3 : Configuration manquante ⚠️ À CONFIGURER

**Variables manquantes dans .env.local :**

```env
WP_PREVIEW_API=https://admin.lesetatsgenerauxcommunaux.org/wp-json
WP_PREVIEW_SECRET=your-secret-here
```

**Solution créée :**
- ✅ Fichier créé : [.env.example](.env.example)
- ✅ Script de génération de secret : [scripts/generate-preview-secret.js](scripts/generate-preview-secret.js)
- ✅ Script de test : [scripts/test-preview-setup.js](scripts/test-preview-setup.js)

## Actions à réaliser maintenant

### Étape 1 : Installation du plugin WordPress

**Option A : Via plugin (recommandé - le plus simple)**

1. Créer le dossier : `wp-content/plugins/headless-preview/`
2. Copier le fichier `wordpress-integration/headless-preview-plugin.php` dans ce dossier
3. Activer le plugin dans l'admin WordPress
4. Aller dans "Réglages > Headless Preview" pour configurer (ou utiliser wp-config.php)

**Option B : Via le thème**

1. Copier `wordpress-integration/headless-preview-endpoint.php` dans le thème
2. Ajouter dans `functions.php` :
   ```php
   require_once get_template_directory() . '/headless-preview-endpoint.php';
   ```

### Étape 2 : Configurer les variables WordPress

Ajouter dans `wp-config.php` (avant `/* C'est tout, ne touchez pas à ce qui suit ! */`) :

```php
// Configuration Headless Preview
define('HEADLESS_FRONTEND_URL', 'https://lesetatsgenerauxcommunaux.org');
define('WP_PREVIEW_SECRET', 'GENERER_UN_SECRET_ICI');
```

Pour générer un secret sécurisé :

```bash
node scripts/generate-preview-secret.js
```

### Étape 3 : Configurer les variables Next.js

1. Ajouter dans `.env.local` :

```env
WP_PREVIEW_API=https://admin.lesetatsgenerauxcommunaux.org/wp-json
WP_PREVIEW_SECRET=LE_MEME_SECRET_QUE_WORDPRESS
```

2. Redémarrer le serveur Next.js :

```bash
npm run dev
```

### Étape 4 : Vérifier que les CPT sont exposés dans l'API REST

**Si vous utilisez ACF pour créer les CPT :**

1. Aller dans ACF > Post Types
2. Pour chaque CPT (evenement, ressource, groupe-locaux) :
   - ✅ Vérifier que "Show In REST API" est activé
   - ✅ Vérifier le "REST API base slug"

**Si vous utilisez register_post_type() :**

```php
register_post_type('evenement', [
    'labels' => [...],
    'public' => true,
    'show_in_rest' => true,  // ← OBLIGATOIRE !
    'rest_base' => 'evenement',
    // ...
]);
```

### Étape 5 : Tester la configuration

1. **Test de l'endpoint WordPress :**

Visiter : `https://admin.lesetatsgenerauxcommunaux.org/wp-json/headless-preview/v1/post-types`

Vous devriez voir :
```json
{
  "post": { "rest_base": "posts", ... },
  "page": { "rest_base": "pages", ... },
  "evenement": { "rest_base": "evenement", ... },
  "ressource": { "rest_base": "ressource", ... },
  "groupe-locaux": { "rest_base": "groupe-locaux", ... }
}
```

2. **Test automatisé :**

```bash
node scripts/test-preview-setup.js
```

3. **Test de la preview :**

   - Dans WordPress, éditer un événement
   - Cliquer sur "Aperçu"
   - Vous devriez voir la preview du contenu sur le site Next.js

## Fichiers modifiés/créés

### Fichiers modifiés ✏️

- [lib/wordpress-api.ts](lib/wordpress-api.ts#L193) - Correction de `fetchDraftPost`

### Fichiers créés 📝

**WordPress :**
- [wordpress-integration/headless-preview-endpoint.php](wordpress-integration/headless-preview-endpoint.php) - Endpoint REST pour les CPT
- [wordpress-integration/headless-preview-plugin.php](wordpress-integration/headless-preview-plugin.php) - Plugin WordPress complet
- [wordpress-integration/README-PREVIEW.md](wordpress-integration/README-PREVIEW.md) - Guide détaillé

**Next.js :**
- [.env.example](.env.example) - Variables d'environnement
- [scripts/generate-preview-secret.js](scripts/generate-preview-secret.js) - Générateur de secret
- [scripts/test-preview-setup.js](scripts/test-preview-setup.js) - Script de test

**Documentation :**
- [PREVIEW-FIX.md](PREVIEW-FIX.md) - Ce fichier

## Dépannage

### La preview retourne 404

1. ✅ Vérifier que le plugin est activé dans WordPress
2. ✅ Vérifier que l'endpoint existe : `/wp-json/headless-preview/v1/post-types`
3. ✅ Vérifier que les CPT ont `show_in_rest => true`
4. ✅ Vérifier les logs Next.js et WordPress

### "Invalid preview secret"

1. ✅ Vérifier que `WP_PREVIEW_SECRET` est identique dans WordPress et Next.js
2. ✅ Vérifier que le secret est bien défini dans `.env.local`
3. ✅ Redémarrer le serveur Next.js après modification

### La preview affiche une ancienne version

1. ✅ Vider le cache Next.js : `rm -rf .next`
2. ✅ Rebuild : `npm run build && npm run dev`

## Support

Pour plus d'informations, consulter :
- [README-PREVIEW.md](wordpress-integration/README-PREVIEW.md) - Guide complet
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Next.js Draft Mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode)

## Checklist finale

Avant de considérer que tout fonctionne :

- [ ] Le plugin WordPress est installé et activé
- [ ] L'endpoint `/wp-json/headless-preview/v1/post-types` retourne des données
- [ ] Les 3 CPT (evenement, ressource, groupe-locaux) apparaissent dans l'endpoint
- [ ] `WP_PREVIEW_SECRET` est défini dans WordPress ET Next.js (même valeur)
- [ ] `HEADLESS_FRONTEND_URL` est défini dans WordPress
- [ ] Le serveur Next.js a été redémarré
- [ ] Le test `node scripts/test-preview-setup.js` passe
- [ ] La preview fonctionne pour un article standard
- [ ] La preview fonctionne pour un CPT (événement, ressource, groupe local)

---

**Date de résolution :** 2026-02-10
**Problème signalé :** Preview des CPT ne fonctionnait pas
**Cause racine :** Endpoint WordPress manquant + bug dans fetchDraftPost
**Statut :** ✅ Corrections appliquées, installation WordPress requise
