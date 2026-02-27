// Endpoint REST API pour la page d'options "Réseaux sociaux"
add_action('rest_api_init', function() {
    register_rest_route('mytheme/v1', '/reseaux-sociaux', [
        'methods'  => 'GET',
        'callback' => function() {
            // Récupère tous les champs ACF de la page d'options
            $fields = get_fields('option');
            return rest_ensure_response([
                'acf' => $fields ?: []
            ]);
        },
        'permission_callback' => '__return_true',
    ]);
});
<?php
/**
 * Endpoint REST API pour la page d'options "Titres Pages d'archives"
 * À ajouter dans functions.php du thème WordPress
 */

// Enregistrer l'endpoint REST API pour les titres des pages d'archives
function register_archive_titles_rest_route() {
    register_rest_route('mytheme/v1', '/titres-pages-darchives', [
        'methods' => 'GET',
        'callback' => 'get_archive_titles_rest_data',
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'register_archive_titles_rest_route');

function get_archive_titles_rest_data($request) {
    // Vérifier que ACF est actif
    if (!function_exists('get_fields')) {
        return new WP_Error(
            'acf_not_active',
            'Advanced Custom Fields plugin is not active',
            ['status' => 500]
        );
    }

    // Récupérer tous les champs ACF de la page d'options
    $fields = get_fields('option');

    return rest_ensure_response([
        'acf' => $fields ?: []
    ]);
}

// Ajouter les champs ACF à la page d'options si elle n'existe pas
function create_archive_titles_options_page() {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => 'Titres Pages d\'archives',
            'menu_title' => 'Titres Pages d\'archives',
            'menu_slug' => 'titres-pages-darchives',
            'capability' => 'edit_posts',
            'redirect' => false
        ]);
    }
}
add_action('acf/init', 'create_archive_titles_options_page');

// Revalidation Vercel lors de la sauvegarde des options ACF
// (save_post ne se déclenche pas pour les pages d'options ACF)
add_action('acf/save_post', function($post_id) {
    if ($post_id !== 'options') return;

    $vercel_url = 'https://lesetatsgenerauxcommunaux.org/api/revalidate';
    $secret_token = '5NlL5F9iyje6RFmoSOlY3DND';

    wp_remote_get(add_query_arg([
        'path'   => '/',
        'secret' => $secret_token,
    ], $vercel_url), [
        'blocking' => false,
        'timeout'  => 5,
    ]);
});

// Enregistrer l'endpoint REST API pour la sous-page d'options "Réseaux sociaux"
function register_reseaux_sociaux_rest_route() {
    register_rest_route('mytheme/v1', '/reseaux-sociaux', [
        'methods' => 'GET',
        'callback' => 'get_reseaux_sociaux_rest_data',
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'register_reseaux_sociaux_rest_route');

function get_reseaux_sociaux_rest_data($request) {
    // Vérifier que ACF est actif
    if (!function_exists('get_field')) {
        return new WP_Error(
            'acf_not_active',
            'Advanced Custom Fields plugin is not active',
            ['status' => 500]
        );
    }

    // Récupérer les champs de la sous-page d'options "Réseaux sociaux"
    $data = [
        'facebook' => get_field('facebook', 'option'),
        'twitter' => get_field('twitter', 'option'),
        'instagram' => get_field('instagram', 'option'),
        'linkedin' => get_field('linkedin', 'option'),
        // Ajoutez d'autres réseaux si besoin
    ];

    // Log pour debug (visible dans les logs WordPress)
    error_log('[WordPress] Réseaux sociaux data: ' . print_r($data, true));

    return rest_ensure_response($data);
}
?>
