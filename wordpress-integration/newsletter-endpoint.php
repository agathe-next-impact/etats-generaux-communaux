<?php
/**
 * WordPress REST API endpoint for newsletter subscriptions
 * Add this code to your theme's functions.php or create a custom plugin
 */

add_action('rest_api_init', function () {
    register_rest_route('mytheme/v1', '/newsletter-subscription', array(
        'methods' => 'POST',
        'callback' => 'handle_newsletter_subscription',
        'permission_callback' => '__return_true',
    ));
});

function handle_newsletter_subscription($request) {
    $params = $request->get_json_params();
    
    $nom = sanitize_text_field($params['nom']);
    $prenom = sanitize_text_field($params['prenom']);
    $email = sanitize_email($params['email']);
    $telephone = sanitize_text_field($params['telephone']);
    $recipient_email = sanitize_email($params['recipient_email']);
    
    // Validate email
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Email invalide', array('status' => 400));
    }
    
    // Email to admin
    $admin_subject = 'Nouvelle inscription à la newsletter';
    $admin_message = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: #E73628;'>Nouvelle inscription à la newsletter</h2>
            <p>Une nouvelle personne s'est inscrite à la newsletter :</p>
            <ul style='list-style: none; padding: 0;'>
                <li style='margin: 10px 0;'><strong>Nom :</strong> {$nom}</li>
                <li style='margin: 10px 0;'><strong>Prénom :</strong> {$prenom}</li>
                <li style='margin: 10px 0;'><strong>Email :</strong> {$email}</li>
                " . ($telephone ? "<li style='margin: 10px 0;'><strong>Téléphone :</strong> {$telephone}</li>" : "") . "
            </ul>
            <p style='margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;'>
                Cette personne a accepté de donner ses informations personnelles pour recevoir la newsletter.
            </p>
        </body>
        </html>
    ";
    
    $admin_headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: Newsletter EGC <noreply@' . parse_url(get_site_url(), PHP_URL_HOST) . '>'
    );
    
    // Send email to admin
    $admin_sent = wp_mail($recipient_email, $admin_subject, $admin_message, $admin_headers);
    
    // Confirmation email to subscriber
    $subscriber_subject = 'Bienvenue à la newsletter des États Généraux Communaux';
    $subscriber_message = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: #4AAD33;'>Bienvenue {$prenom} !</h2>
            <p>Merci de vous être inscrit(e) à notre newsletter.</p>
            <p>Vous recevrez désormais nos actualités, événements et initiatives directement dans votre boîte mail.</p>
            <p style='margin-top: 30px;'>À très bientôt,<br><strong>L'équipe des États Généraux Communaux</strong></p>
            <p style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;'>
                Si vous souhaitez vous désinscrire, vous pouvez le faire à tout moment en cliquant sur le lien de désinscription présent dans nos emails.
            </p>
        </body>
        </html>
    ";
    
    $subscriber_headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: États Généraux Communaux <noreply@' . parse_url(get_site_url(), PHP_URL_HOST) . '>'
    );
    
    // Send confirmation email to subscriber
    wp_mail($email, $subscriber_subject, $subscriber_message, $subscriber_headers);
    
    if (!$admin_sent) {
        return new WP_Error('email_failed', 'Erreur lors de l\'envoi de l\'email', array('status' => 500));
    }
    
    return array(
        'success' => true,
        'message' => 'Inscription enregistrée avec succès'
    );
}
