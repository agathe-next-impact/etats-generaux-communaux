<?php
/**
 * Plugin Name: EGC – Envoi des formulaires du site
 * Description: Reçoit les formulaires (contact, newsletter) du front Next.js et envoie les emails via wp_mail().
 * Version: 1.0.0
 *
 * INSTALLATION
 * 1. Copier ce fichier dans wp-content/mu-plugins/ (ou wp-content/plugins/ puis l'activer).
 * 2. Ajouter dans wp-config.php, avec une valeur longue et aléatoire :
 *        define('EGC_FORMS_SECRET', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
 *    La MÊME valeur doit être définie sur Vercel dans la variable WP_FORMS_SECRET.
 * 3. (Optionnel) define('EGC_FRONT_URL', 'https://lesetatsgenerauxcommunaux.org');  // pour le logo
 * 4. Recommandé : installer une extension d'envoi (WP Mail SMTP, FluentSMTP…) pour que
 *    wp_mail() ne parte pas en spam. Sans extension, wp_mail() utilise mail() de l'hébergeur.
 *
 * SÉCURITÉ
 * - L'endpoint refuse toute requête sans l'en-tête X-EGC-Forms-Secret correct.
 * - Le destinataire est lu ici (ACF), jamais dans la requête.
 * - Remplace l'ancien endpoint public mytheme/v1/newsletter-subscription, à supprimer.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('egc/v1', '/send-form', [
        'methods'             => 'POST',
        'callback'            => 'egc_forms_handle_request',
        'permission_callback' => 'egc_forms_check_secret',
    ]);
});

function egc_forms_check_secret(WP_REST_Request $request) {
    if (!defined('EGC_FORMS_SECRET') || strlen(EGC_FORMS_SECRET) < 24) {
        return new WP_Error('egc_forms_not_configured', 'Service indisponible', ['status' => 503]);
    }
    $provided = (string) $request->get_header('x-egc-forms-secret');
    if (!hash_equals(EGC_FORMS_SECRET, $provided)) {
        return new WP_Error('egc_forms_forbidden', 'Accès refusé', ['status' => 403]);
    }
    return true;
}

/** Destinataire des formulaires : champ ACF de la page d'options, puis email admin du site. */
function egc_forms_recipient() {
    if (function_exists('get_field')) {
        $page = get_field('page_newsletter', 'option');
        $email = is_array($page) ? ($page['email_denvoi_des_inscriptions_a_la_newsletter'] ?? '') : '';
        if ($email && is_email($email)) {
            return $email;
        }
    }
    return get_option('admin_email');
}

function egc_forms_headers($from_name, $reply_to = '') {
    $host    = wp_parse_url(get_site_url(), PHP_URL_HOST);
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        sprintf('From: %s <noreply@%s>', $from_name, $host),
    ];
    if ($reply_to && is_email($reply_to)) {
        $headers[] = 'Reply-To: ' . $reply_to;
    }
    return $headers;
}

/** Texte sur une ligne, sans retour chariot (évite l'injection d'en-têtes). */
function egc_forms_line($value, $max) {
    $value = sanitize_text_field((string) $value);
    return mb_substr($value, 0, $max);
}

function egc_forms_handle_request(WP_REST_Request $request) {
    $params = $request->get_json_params() ?: [];
    $type   = $params['type'] ?? '';

    if ($type === 'contact') {
        return egc_forms_send_contact($params);
    }
    if ($type === 'newsletter') {
        return egc_forms_send_newsletter($params);
    }
    return new WP_Error('egc_forms_bad_type', 'Type de formulaire inconnu', ['status' => 400]);
}

function egc_forms_send_contact(array $p) {
    $nom     = egc_forms_line($p['nom'] ?? '', 200);
    $email   = sanitize_email($p['email'] ?? '');
    $sujet   = egc_forms_line($p['sujet'] ?? '', 200);
    $message = mb_substr(sanitize_textarea_field((string) ($p['message'] ?? '')), 0, 10000);

    if (!$nom || !is_email($email) || !$sujet || !$message) {
        return new WP_Error('egc_forms_invalid', 'Champs invalides', ['status' => 400]);
    }

    $html = '
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">Nouveau message de contact</h2>
        <div style="margin: 20px 0;">
          <p><strong>Nom :</strong> ' . esc_html($nom) . '</p>
          <p><strong>Email :</strong> <a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a></p>
          <p><strong>Sujet :</strong> ' . esc_html($sujet) . '</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Message :</strong></p>
          <p style="margin: 10px 0 0 0;">' . nl2br(esc_html($message)) . '</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Ce message a été envoyé depuis le formulaire de contact du site Les EGC.</p>
      </div>';

    $sent = wp_mail(egc_forms_recipient(), '[Contact] ' . $sujet, $html, egc_forms_headers('Les EGC', $email));

    if (!$sent) {
        return new WP_Error('egc_forms_mail_failed', "Échec de l'envoi", ['status' => 500]);
    }
    return ['success' => true];
}

function egc_forms_send_newsletter(array $p) {
    $nom       = egc_forms_line($p['nom'] ?? '', 100);
    $prenom    = egc_forms_line($p['prenom'] ?? '', 100);
    $email     = sanitize_email($p['email'] ?? '');
    $telephone = egc_forms_line($p['telephone'] ?? '', 30);

    if (!$nom || !$prenom || !is_email($email)) {
        return new WP_Error('egc_forms_invalid', 'Champs invalides', ['status' => 400]);
    }

    $date = wp_date('d/m/Y') . ' à ' . wp_date('H:i');

    $admin_html = '
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">Nouvelle inscription à la newsletter</h2>
        <div style="margin: 20px 0;">
          <p><strong>Nom :</strong> ' . esc_html($nom) . '</p>
          <p><strong>Prénom :</strong> ' . esc_html($prenom) . '</p>
          <p><strong>Email :</strong> <a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a></p>
          <p><strong>Téléphone :</strong> ' . esc_html($telephone ?: 'Non fourni') . '</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Inscription effectuée le ' . esc_html($date) . '.</p>
      </div>';

    $admin_sent = wp_mail(egc_forms_recipient(), 'Nouvelle inscription à la newsletter', $admin_html, egc_forms_headers('Les EGC'));

    if (!$admin_sent) {
        return new WP_Error('egc_forms_mail_failed', "Échec de l'envoi", ['status' => 500]);
    }

    $front    = defined('EGC_FRONT_URL') ? EGC_FRONT_URL : 'https://lesetatsgenerauxcommunaux.org';
    $logo_url = esc_url(rtrim($front, '/') . '/images/logo-egc.png');

    $subscriber_html = '
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <img src="' . $logo_url . '" alt="Logo Les EGC" style="max-width: 200px; margin-bottom: 20px;" />
        <div style="text-align: left;">
          <h2 style="color: #333; border-bottom: 2px solid #6CB33F; padding-bottom: 10px;">Bienvenue dans notre newsletter !</h2>
          <p>Bonjour ' . esc_html($prenom) . ',</p>
          <p>Merci de vous être inscrit(e) à notre newsletter. Vous recevrez bientôt nos actualités et informations.</p>
          <p>Si vous n\'êtes pas à l\'origine de cette inscription, vous pouvez ignorer cet email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Les États Généraux Communaux</p>
        </div>
      </div>';

    // L'échec de la confirmation n'annule pas l'inscription (l'admin a été prévenu)
    wp_mail($email, "Confirmation d'inscription à la newsletter", $subscriber_html, egc_forms_headers('Les États Généraux Communaux'));

    return ['success' => true];
}
