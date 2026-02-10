<?php
/**
 * Headless Preview Endpoint
 * Expose custom post type information for Next.js preview
 *
 * Installation:
 * 1. Copier ce fichier dans le dossier wp-content/themes/votre-theme/
 * 2. Ajouter dans functions.php: require_once get_template_directory() . '/headless-preview-endpoint.php';
 * OU
 * 1. Créer un plugin avec ce code
 * 2. Activer le plugin dans l'admin WordPress
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API endpoint for post type information
 */
add_action('rest_api_init', function () {
    register_rest_route('headless-preview/v1', '/post-types', [
        'methods'  => 'GET',
        'callback' => 'get_post_types_info',
        'permission_callback' => '__return_true', // Public endpoint
    ]);
});

/**
 * Get post types information including REST base
 */
function get_post_types_info() {
    $post_types = get_post_types([
        'show_in_rest' => true,
    ], 'objects');

    $result = [];

    foreach ($post_types as $post_type) {
        // Get the REST base (slug used in REST API)
        $rest_base = $post_type->rest_base;

        // If no custom rest_base is set, use the post type name
        if (empty($rest_base)) {
            $rest_base = $post_type->name;
        }

        $result[$post_type->name] = [
            'rest_base' => $rest_base,
            'label' => $post_type->label,
            'name' => $post_type->name,
            'public' => $post_type->public,
            'hierarchical' => $post_type->hierarchical,
        ];
    }

    return rest_ensure_response($result);
}

/**
 * Ensure all custom post types are exposed in REST API
 * This is a helper function to verify CPT configuration
 */
add_action('init', function () {
    // Get all registered post types
    $post_types = get_post_types(['public' => true], 'objects');

    foreach ($post_types as $post_type) {
        // Skip built-in post types
        if (in_array($post_type->name, ['post', 'page', 'attachment'])) {
            continue;
        }

        // Check if the post type is exposed in REST
        if (!$post_type->show_in_rest) {
            // Log warning for non-REST CPTs (visible in debug.log if WP_DEBUG is enabled)
            error_log(
                sprintf(
                    '[Headless Preview] Warning: Custom post type "%s" is not exposed in REST API. ' .
                    'Set "show_in_rest" => true when registering the post type.',
                    $post_type->name
                )
            );
        }
    }
}, 999); // Late priority to ensure all CPTs are registered
