<?php
/**
 * Fonctions spécifiques pour la page Les EGC
 * À ajouter dans functions.php du thème WordPress
 */

// Enregistrement des champs ACF pour Les EGC
function register_egc_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        // Le JSON ACF sera importé via l'interface d'administration
        // ou via acf_add_local_field_group() avec la structure complète
    }
}
add_action('acf/init', 'register_egc_acf_fields');

// Fonction helper pour récupérer les données EGC
function get_egc_data($page_id = null) {
    if (!$page_id) {
        $page_id = get_the_ID();
    }
    
    return [
        'hero' => get_field('hero_section', $page_id),
        'what' => get_field('what_section', $page_id),
        'who' => get_field('who_section', $page_id),
        'context' => get_field('context_section', $page_id),
        'why_commune' => get_field('why_commune_section', $page_id),
        'how_to_act' => get_field('how_to_act_section', $page_id),
        'doleances' => get_field('doleances_section', $page_id),
        'who_can_organize' => get_field('who_can_organize_section', $page_id),
        'after_elections' => get_field('after_elections_section', $page_id),
        'link_egc_acc' => get_field('link_egc_acc_section', $page_id),
        'help' => get_field('help_section', $page_id),
        'cta' => get_field('cta_section', $page_id)
    ];
}

// API REST pour récupérer les données EGC
function register_egc_rest_route() {
    register_rest_route('wp/v2', '/egc/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'get_egc_rest_data',
        'permission_callback' => '__return_true',
        'args' => [
            'id' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ]
        ]
    ]);
}
add_action('rest_api_init', 'register_egc_rest_route');

function get_egc_rest_data($request) {
    $page_id = $request['id'];
    $page = get_post($page_id);
    
    if (!$page || $page->post_type !== 'page') {
        return new WP_Error('invalid_page', 'Page not found', ['status' => 404]);
    }
    
    $egc_data = get_egc_data($page_id);
    
    return rest_ensure_response([
        'id' => $page_id,
        'title' => get_the_title($page_id),
        'slug' => $page->post_name,
        'data' => $egc_data
    ]);
}

// Fonction pour valider les données EGC
function validate_egc_data($data) {
    $required_sections = ['hero', 'what', 'who', 'context'];
    $errors = [];
    
    foreach ($required_sections as $section) {
        if (empty($data[$section])) {
            $errors[] = sprintf('Section %s is required', $section);
        }
    }
    
    return empty($errors) ? true : $errors;
}
?>
