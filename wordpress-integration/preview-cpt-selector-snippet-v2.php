<?php
/**
 * Snippet : Sélecteur de CPT pour la Preview (Version 2)
 *
 * Ce snippet permet de choisir quels Custom Post Types auront le bouton de preview.
 * Les CPT décochés n'auront AUCUN bouton de preview (ni natif, ni plugin).
 *
 * Installation :
 * Option 1 : Ajouter ce code à la fin du fichier headless-preview.php (avant la dernière ligne ?>)
 * Option 2 : Ajouter ce code dans functions.php du thème
 * Option 3 : Créer un plugin séparé avec ce code
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get list of enabled post types for preview
 * Par défaut, tous les CPT publics sont activés
 */
function headless_preview_get_enabled_post_types() {
    $default_enabled = ['post', 'page']; // post et page toujours activés par défaut

    // Récupérer tous les CPT publics
    $all_post_types = get_post_types(['public' => true], 'names');

    // Par défaut, activer tous les CPT
    $default_enabled = array_keys($all_post_types);

    // Récupérer la configuration sauvegardée
    $enabled = get_option('headless_preview_enabled_post_types', $default_enabled);

    return is_array($enabled) ? $enabled : $default_enabled;
}

/**
 * Check if a post type has preview enabled
 */
function headless_preview_is_post_type_enabled($post_type) {
    $enabled = headless_preview_get_enabled_post_types();
    return in_array($post_type, $enabled);
}

/**
 * Filtre : Ne modifier les liens de preview QUE pour les CPT sélectionnés
 */
add_filter('preview_post_link', 'headless_preview_selective_link', 5, 2);
function headless_preview_selective_link($preview_link, $post) {
    // Si le post type n'est pas activé, retourner null pour désactiver complètement
    if (!headless_preview_is_post_type_enabled($post->post_type)) {
        return null;
    }

    // Sinon, appliquer le lien headless (on suppose que la fonction existe)
    if (function_exists('headless_preview_link')) {
        return headless_preview_link($preview_link, $post);
    }

    return $preview_link;
}

/**
 * NOUVEAU : Supprimer complètement le bouton preview pour les CPT désactivés (Gutenberg)
 */
add_action('enqueue_block_editor_assets', 'headless_preview_hide_button_for_disabled_cpt');
function headless_preview_hide_button_for_disabled_cpt() {
    global $post;

    if (!$post) {
        return;
    }

    // Si le post type n'est pas activé, cacher TOUS les boutons de preview
    if (!headless_preview_is_post_type_enabled($post->post_type)) {
        ?>
        <style>
            /* Cacher le bouton preview natif WordPress */
            .editor-preview-dropdown,
            .block-editor-post-preview__dropdown,
            .editor-post-preview,
            .components-button.editor-post-preview,

            /* Cacher aussi le bouton du plugin headless-preview */
            .headless-preview-button,

            /* Cacher dans la barre d'outils */
            .edit-post-header__settings .components-dropdown-menu__menu-item[aria-label*="preview" i],
            .edit-post-header__settings .components-dropdown-menu__menu-item[aria-label*="aperçu" i],

            /* Cacher dans le menu document */
            .editor-post-switch-to-draft,
            button[aria-label*="preview" i],
            button[aria-label*="aperçu" i] {
                display: none !important;
            }
        </style>
        <script>
        (function() {
            // Attendre que l'éditeur soit chargé
            if (typeof wp !== 'undefined' && wp.data) {
                // Désactiver la fonctionnalité de preview
                wp.data.subscribe(function() {
                    // Supprimer tous les boutons de preview du DOM
                    var previewButtons = document.querySelectorAll(
                        '.editor-post-preview, ' +
                        '.editor-preview-dropdown, ' +
                        '.block-editor-post-preview__dropdown, ' +
                        '.headless-preview-button, ' +
                        '[aria-label*="preview"], ' +
                        '[aria-label*="aperçu"], ' +
                        '[aria-label*="Preview"], ' +
                        '[aria-label*="Aperçu"]'
                    );

                    previewButtons.forEach(function(button) {
                        if (button) {
                            button.style.display = 'none';
                            button.remove();
                        }
                    });
                });
            }
        })();
        </script>
        <?php
    }
}

/**
 * NOUVEAU : Supprimer complètement le bouton preview pour les CPT désactivés (Classic Editor)
 */
add_action('admin_head', 'headless_preview_hide_classic_preview');
function headless_preview_hide_classic_preview() {
    global $post, $pagenow;

    // Seulement sur les pages d'édition
    if (!in_array($pagenow, ['post.php', 'post-new.php']) || !$post) {
        return;
    }

    // Si le post type n'est pas activé, cacher TOUS les boutons de preview
    if (!headless_preview_is_post_type_enabled($post->post_type)) {
        ?>
        <style>
            /* Cacher le bouton preview natif WordPress */
            #preview-action,
            #post-preview,
            .preview.button,
            a#post-preview,

            /* Cacher le bouton du plugin */
            .headless-preview-classic-button,
            #headless-preview-container,

            /* Cacher dans la meta box */
            .misc-pub-section.misc-pub-preview {
                display: none !important;
            }
        </style>
        <script>
        jQuery(document).ready(function($) {
            // Supprimer tous les boutons/liens de preview
            $('#preview-action, #post-preview, .preview.button, .headless-preview-classic-button').remove();

            // Supprimer le lien "Aperçu des modifications" aussi
            $('a[target="wp-preview"]').remove();
            $('a').filter(function() {
                return $(this).text().toLowerCase().includes('aperçu') ||
                       $(this).text().toLowerCase().includes('preview');
            }).remove();
        });
        </script>
        <?php
    }
}

/**
 * NOUVEAU : Retirer l'action "Preview" de la liste des posts
 */
add_filter('post_row_actions', 'headless_preview_remove_row_preview', 10, 2);
add_filter('page_row_actions', 'headless_preview_remove_row_preview', 10, 2);
function headless_preview_remove_row_preview($actions, $post) {
    // Si le post type n'est pas activé, retirer TOUTES les actions de preview
    if (!headless_preview_is_post_type_enabled($post->post_type)) {
        unset($actions['view']);
        unset($actions['preview']);
        unset($actions['headless_preview']);
    } else {
        // Si activé, retirer seulement la preview native
        unset($actions['view']);
        unset($actions['preview']);
    }

    return $actions;
}

/**
 * NOUVEAU : Désactiver la prévisualisation via URL directe
 */
add_action('template_redirect', 'headless_preview_disable_direct_preview');
function headless_preview_disable_direct_preview() {
    // Si c'est une tentative de preview
    if (!is_preview()) {
        return;
    }

    global $post;

    if (!$post) {
        return;
    }

    // Si le post type n'est pas activé pour la preview
    if (!headless_preview_is_post_type_enabled($post->post_type)) {
        // Rediriger vers l'éditeur avec un message
        wp_safe_redirect(admin_url('post.php?post=' . $post->ID . '&action=edit&preview-disabled=1'));
        exit;
    }
}

/**
 * NOUVEAU : Message admin si tentative de preview sur CPT désactivé
 */
add_action('admin_notices', 'headless_preview_disabled_notice');
function headless_preview_disabled_notice() {
    if (!isset($_GET['preview-disabled']) || $_GET['preview-disabled'] !== '1') {
        return;
    }

    ?>
    <div class="notice notice-warning is-dismissible">
        <p>
            <strong>Preview désactivée :</strong>
            La fonctionnalité de preview est désactivée pour ce type de contenu.
            Publiez ou enregistrez en brouillon pour voir le résultat.
        </p>
    </div>
    <?php
}

/**
 * Ajouter section dans la page de paramètres
 */
add_action('admin_init', 'headless_preview_register_cpt_settings');
function headless_preview_register_cpt_settings() {
    register_setting(
        'headless_preview_settings',
        'headless_preview_enabled_post_types',
        [
            'type' => 'array',
            'sanitize_callback' => 'headless_preview_sanitize_post_types',
            'default' => []
        ]
    );
}

/**
 * Sanitize post types array
 */
function headless_preview_sanitize_post_types($input) {
    if (!is_array($input)) {
        return [];
    }

    // Valider que ce sont bien des post types existants
    $valid_post_types = get_post_types(['public' => true], 'names');

    return array_intersect($input, array_keys($valid_post_types));
}

/**
 * Ajouter la section CPT dans la page de paramètres existante
 * Cette fonction s'insère dans la page headless_preview_settings_page
 */
add_action('admin_footer', 'headless_preview_add_cpt_selector_to_settings');
function headless_preview_add_cpt_selector_to_settings() {
    $screen = get_current_screen();

    // Seulement sur la page des paramètres Headless Preview
    if (!$screen || $screen->id !== 'settings_page_headless-preview') {
        return;
    }

    // Injecter du JavaScript pour ajouter la section
    ?>
    <script>
    jQuery(document).ready(function($) {
        // Créer la section de sélection des CPT
        var cptSelectorHtml = <?php echo json_encode(headless_preview_get_cpt_selector_html()); ?>;

        // Insérer après le formulaire principal
        $('form[method="post"]').first().after(cptSelectorHtml);
    });
    </script>
    <style>
        .headless-cpt-selector {
            background: #fff;
            border: 1px solid #c3c4c7;
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
        }
        .headless-cpt-selector h2 {
            margin-top: 0;
        }
        .cpt-checkbox-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .cpt-checkbox-item {
            display: flex;
            align-items: flex-start;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .cpt-checkbox-item:hover {
            background: #f0f0f0;
        }
        .cpt-checkbox-item input[type="checkbox"] {
            margin-top: 3px;
            margin-right: 10px;
        }
        .cpt-checkbox-label {
            display: flex;
            flex-direction: column;
        }
        .cpt-checkbox-label strong {
            display: block;
            margin-bottom: 3px;
            color: #1d2327;
        }
        .cpt-checkbox-label small {
            color: #646970;
            font-size: 12px;
        }
        .cpt-rest-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 5px;
        }
        .cpt-rest-badge.enabled {
            background: #d4edda;
            color: #155724;
        }
        .cpt-rest-badge.disabled {
            background: #f8d7da;
            color: #721c24;
        }
        .cpt-disabled-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 5px;
            background: #ffc107;
            color: #856404;
        }
    </style>
    <?php
}

/**
 * Générer le HTML de la section sélecteur de CPT
 */
function headless_preview_get_cpt_selector_html() {
    $enabled_post_types = headless_preview_get_enabled_post_types();
    $all_post_types = get_post_types(['public' => true], 'objects');

    ob_start();
    ?>
    <div class="headless-cpt-selector">
        <h2>🎯 Sélection des types de contenu pour la preview</h2>
        <p>
            <strong>Choisissez quels types de contenu auront le bouton de preview headless.</strong><br>
            ⚠️ <strong>Important :</strong> Les types NON sélectionnés n'auront <strong>AUCUN</strong> bouton de preview (ni WordPress, ni headless).
        </p>

        <form method="post" action="options.php" id="headless-cpt-form">
            <?php settings_fields('headless_preview_settings'); ?>

            <div class="cpt-checkbox-list">
                <?php foreach ($all_post_types as $post_type): ?>
                    <?php
                    $is_enabled = in_array($post_type->name, $enabled_post_types);
                    $has_rest = $post_type->show_in_rest;
                    $is_builtin = in_array($post_type->name, ['post', 'page', 'attachment']);

                    // Ignorer attachment
                    if ($post_type->name === 'attachment') {
                        continue;
                    }
                    ?>
                    <label class="cpt-checkbox-item">
                        <input
                            type="checkbox"
                            name="headless_preview_enabled_post_types[]"
                            value="<?php echo esc_attr($post_type->name); ?>"
                            <?php checked($is_enabled); ?>
                        >
                        <span class="cpt-checkbox-label">
                            <strong>
                                <?php echo esc_html($post_type->label); ?>
                                <?php if ($has_rest): ?>
                                    <span class="cpt-rest-badge enabled">✓ REST</span>
                                <?php else: ?>
                                    <span class="cpt-rest-badge disabled">✗ REST</span>
                                <?php endif; ?>
                                <?php if (!$is_enabled): ?>
                                    <span class="cpt-disabled-badge">🚫 Preview OFF</span>
                                <?php endif; ?>
                            </strong>
                            <small>
                                <?php echo esc_html($post_type->name); ?>
                                <?php if ($is_builtin): ?>
                                    <em>(built-in)</em>
                                <?php endif; ?>
                                <?php if (!$is_enabled): ?>
                                    <br><strong style="color: #856404;">📵 Aucun bouton de preview</strong>
                                <?php elseif (!$has_rest): ?>
                                    <br><strong style="color: #d63638;">⚠ Attention : REST API désactivé</strong>
                                <?php endif; ?>
                            </small>
                        </span>
                    </label>
                <?php endforeach; ?>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0;">
                    <strong>⚠️ Comportement :</strong>
                </p>
                <ul style="margin: 10px 0 0 20px;">
                    <li><strong>✓ Coché :</strong> Bouton de preview headless (violet avec icône)</li>
                    <li><strong>☐ Décoché :</strong> <strong>AUCUN</strong> bouton de preview (ni natif, ni plugin)</li>
                </ul>
            </div>

            <p class="description" style="margin-top: 20px;">
                <strong>💡 Conseil :</strong> Les types de contenu avec REST API désactivé ne fonctionneront pas en preview headless.
                Activez "show_in_rest" dans leur configuration avant de les cocher.
            </p>

            <?php submit_button('Enregistrer la sélection', 'primary', 'submit', true, ['id' => 'submit-cpt-selection']); ?>
        </form>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Traiter la sauvegarde du formulaire
 */
add_action('admin_init', 'headless_preview_handle_cpt_save');
function headless_preview_handle_cpt_save() {
    // Vérifier que nous sommes sur la bonne page
    if (!isset($_POST['headless_preview_enabled_post_types']) && !isset($_POST['option_page'])) {
        return;
    }

    // Si le formulaire est soumis mais aucun CPT coché, sauvegarder un tableau vide
    if (isset($_POST['option_page']) && $_POST['option_page'] === 'headless_preview_settings') {
        // Vérifier le nonce
        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'headless_preview_settings-options')) {
            return;
        }

        // Vérifier les permissions
        if (!current_user_can('manage_options')) {
            return;
        }

        // Récupérer et nettoyer les données
        $enabled_post_types = isset($_POST['headless_preview_enabled_post_types'])
            ? $_POST['headless_preview_enabled_post_types']
            : [];

        $enabled_post_types = headless_preview_sanitize_post_types($enabled_post_types);

        // Sauvegarder
        update_option('headless_preview_enabled_post_types', $enabled_post_types);

        // Rediriger avec message de succès
        wp_safe_redirect(add_query_arg([
            'page' => 'headless-preview',
            'cpt-updated' => 'true'
        ], admin_url('options-general.php')));
        exit;
    }
}

/**
 * Afficher un message de succès après sauvegarde
 */
add_action('admin_notices', 'headless_preview_cpt_success_notice');
function headless_preview_cpt_success_notice() {
    if (!isset($_GET['cpt-updated']) || $_GET['cpt-updated'] !== 'true') {
        return;
    }

    $screen = get_current_screen();
    if (!$screen || $screen->id !== 'settings_page_headless-preview') {
        return;
    }

    ?>
    <div class="notice notice-success is-dismissible">
        <p><strong>✓ Sélection des types de contenu enregistrée avec succès!</strong></p>
    </div>
    <?php
}

/**
 * Ajouter une colonne dans la liste des posts pour indiquer si la preview headless est active
 */
add_filter('manage_posts_columns', 'headless_preview_add_column');
add_filter('manage_pages_columns', 'headless_preview_add_column');
function headless_preview_add_column($columns) {
    // Ajouter après le titre
    $new_columns = [];
    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;
        if ($key === 'title') {
            $new_columns['headless_preview'] = '🔗 Preview';
        }
    }
    return $new_columns;
}

/**
 * Afficher le contenu de la colonne
 */
add_action('manage_posts_custom_column', 'headless_preview_column_content', 10, 2);
add_action('manage_pages_custom_column', 'headless_preview_column_content', 10, 2);
function headless_preview_column_content($column, $post_id) {
    if ($column !== 'headless_preview') {
        return;
    }

    $post = get_post($post_id);
    $is_enabled = headless_preview_is_post_type_enabled($post->post_type);

    if ($is_enabled) {
        echo '<span style="color: green; font-weight: bold;" title="Preview headless activée">✓ Headless</span>';
    } else {
        echo '<span style="color: #d63638; font-weight: bold;" title="Preview désactivée">🚫 OFF</span>';
    }
}
