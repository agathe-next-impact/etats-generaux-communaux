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
    if (!function_exists('get_field')) {
        return new WP_Error(
            'acf_not_active',
            'Advanced Custom Fields plugin is not active',
            ['status' => 500]
        );
    }
    
    // Récupérer tous les champs de la page d'options
    $data = [
        // Titres des pages d'archives
        'titre_page_actualites' => get_field('titre_page_actualites', 'option'),
        'sous_titre_page_actualites' => get_field('sous_titre_page_actualites', 'option'),
        'titre_page_evenements' => get_field('titre_page_evenements', 'option'),
        'sous_titre_page_evenements' => get_field('sous_titre_page_evenements', 'option'),
        'titre_page_ressources' => get_field('titre_page_ressources', 'option'),
        'sous_titre_page_ressources' => get_field('sous_titre_page_ressources', 'option'),
        'titre_page_groupes_locaux' => get_field('titre_page_groupes_locaux', 'option'),
        'sous_titre_page_groupes_locaux' => get_field('sous_titre_page_groupes_locaux', 'option'),
        
        // Groupe Page Newsletter
        'page_newsletter' => [
            'titre' => get_field('titre', 'option') ?: get_field('page_newsletter_titre', 'option'),
            'sous_titre' => get_field('sous_titre', 'option') ?: get_field('page_newsletter_sous_titre', 'option'),
            'email_denvoi_des_inscriptions_a_la_newsletter' => get_field('email_denvoi_des_inscriptions_a_la_newsletter', 'option')
        ]
    ];
    
    // Log pour debug (visible dans les logs WordPress)
    error_log('[WordPress] Archive titles data: ' . print_r($data, true));
    error_log('[WordPress] Newsletter email: ' . $data['page_newsletter']['email_denvoi_des_inscriptions_a_la_newsletter']);
    
    return rest_ensure_response($data);
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
?>
