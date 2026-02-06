<?php
/**
 * Configuration CORS pour l'API REST WordPress
 * À ajouter dans functions.php du thème WordPress
 * 
 * Permet les requêtes depuis le frontend Next.js (localhost en dev et production)
 */

// Ajouter les en-têtes CORS pour l'API REST
function add_cors_http_header() {
    // Domaines autorisés
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://lesetatsgenerauxcommunaux.org',
        'https://www.lesetatsgenerauxcommunaux.org',
        'https://etats-generaux-communaux.vercel.app'
    ];
    
    // Récupérer l'origine de la requête
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Vérifier si l'origine est autorisée
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400"); // Cache preflight pendant 24h
    }
}

// Hook pour les requêtes REST API
add_action('rest_api_init', function() {
    // Supprimer le hook send_headers par défaut si nécessaire
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    // Ajouter notre propre gestion CORS
    add_filter('rest_pre_serve_request', function($value) {
        add_cors_http_header();
        return $value;
    });
}, 15);

// Gérer les requêtes OPTIONS (preflight)
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        add_cors_http_header();
        header("HTTP/1.1 200 OK");
        exit();
    }
});

// Alternative : Ajouter les en-têtes via le hook send_headers
add_action('send_headers', 'add_cors_http_header');

/**
 * Pour une solution plus simple (moins sécurisée, à utiliser uniquement en dev),
 * vous pouvez aussi ajouter ces lignes dans le fichier .htaccess :
 * 
 * <IfModule mod_headers.c>
 *     Header set Access-Control-Allow-Origin "*"
 *     Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
 *     Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
 * </IfModule>
 */
