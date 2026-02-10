<?php
/**
 * Plugin Name: Headless Preview Support
 * Plugin URI: https://github.com/yourusername/headless-preview
 * Description: Enables headless preview support for Next.js frontend. Exposes custom post type information and configures preview links.
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * Installation Instructions:
 * 1. Create folder: wp-content/plugins/headless-preview/
 * 2. Copy this file to: wp-content/plugins/headless-preview/headless-preview-plugin.php
 * 3. Activate the plugin in WordPress admin
 * 4. Add to wp-config.php: define('WP_PREVIEW_SECRET', 'your-secret-here');
 * 5. Add to wp-config.php: define('HEADLESS_FRONTEND_URL', 'https://yourdomain.com');
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
        'callback' => 'headless_preview_get_post_types_info',
        'permission_callback' => '__return_true', // Public endpoint
    ]);
});

/**
 * Get post types information including REST base
 */
function headless_preview_get_post_types_info() {
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
 * Change preview link to point to headless frontend
 */
add_filter('preview_post_link', 'headless_preview_post_link', 10, 2);

function headless_preview_post_link($preview_link, $post) {
    // Get frontend URL from constant or environment
    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? HEADLESS_FRONTEND_URL
        : get_option('headless_preview_frontend_url', '');

    // If no frontend URL is configured, return default preview link
    if (empty($frontend_url)) {
        return $preview_link;
    }

    // Get preview secret
    $preview_secret = defined('WP_PREVIEW_SECRET')
        ? WP_PREVIEW_SECRET
        : get_option('headless_preview_secret', '');

    // Build preview URL
    $preview_url = add_query_arg([
        'secret' => $preview_secret,
        'id' => $post->ID,
        'postType' => $post->post_type,
        'slug' => $post->post_name,
    ], rtrim($frontend_url, '/') . '/api/preview');

    return $preview_url;
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

/**
 * Add admin notice if configuration is missing
 */
add_action('admin_notices', function () {
    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? HEADLESS_FRONTEND_URL
        : get_option('headless_preview_frontend_url', '');

    $preview_secret = defined('WP_PREVIEW_SECRET')
        ? WP_PREVIEW_SECRET
        : get_option('headless_preview_secret', '');

    if (empty($frontend_url) || empty($preview_secret)) {
        ?>
        <div class="notice notice-warning">
            <p>
                <strong>Headless Preview:</strong> Configuration incomplete.
                <?php if (empty($frontend_url)): ?>
                    Add <code>define('HEADLESS_FRONTEND_URL', 'https://yourdomain.com');</code> to wp-config.php.
                <?php endif; ?>
                <?php if (empty($preview_secret)): ?>
                    Add <code>define('WP_PREVIEW_SECRET', 'your-secret-here');</code> to wp-config.php.
                <?php endif; ?>
            </p>
        </div>
        <?php
    }
});

/**
 * Add settings page (optional - for users who prefer UI over wp-config.php)
 */
add_action('admin_menu', function () {
    add_options_page(
        'Headless Preview Settings',
        'Headless Preview',
        'manage_options',
        'headless-preview-settings',
        'headless_preview_settings_page'
    );
});

function headless_preview_settings_page() {
    // Save settings
    if (isset($_POST['headless_preview_save'])) {
        check_admin_referer('headless_preview_settings');

        update_option('headless_preview_frontend_url', sanitize_text_field($_POST['frontend_url']));
        update_option('headless_preview_secret', sanitize_text_field($_POST['preview_secret']));

        echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
    }

    $frontend_url = get_option('headless_preview_frontend_url', '');
    $preview_secret = get_option('headless_preview_secret', '');

    // Check if using wp-config constants
    $using_constants = defined('HEADLESS_FRONTEND_URL') || defined('WP_PREVIEW_SECRET');

    ?>
    <div class="wrap">
        <h1>Headless Preview Settings</h1>

        <?php if ($using_constants): ?>
            <div class="notice notice-info">
                <p>
                    <strong>Note:</strong> You are using wp-config.php constants.
                    These settings will override any values entered here.
                </p>
                <ul>
                    <?php if (defined('HEADLESS_FRONTEND_URL')): ?>
                        <li>HEADLESS_FRONTEND_URL: <code><?php echo esc_html(HEADLESS_FRONTEND_URL); ?></code></li>
                    <?php endif; ?>
                    <?php if (defined('WP_PREVIEW_SECRET')): ?>
                        <li>WP_PREVIEW_SECRET: <code><?php echo str_repeat('*', 20); ?></code> (hidden)</li>
                    <?php endif; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form method="post">
            <?php wp_nonce_field('headless_preview_settings'); ?>

            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="frontend_url">Frontend URL</label>
                    </th>
                    <td>
                        <input
                            type="url"
                            id="frontend_url"
                            name="frontend_url"
                            value="<?php echo esc_attr($frontend_url); ?>"
                            class="regular-text"
                            placeholder="https://yourdomain.com"
                            <?php echo defined('HEADLESS_FRONTEND_URL') ? 'disabled' : ''; ?>
                        >
                        <p class="description">
                            The URL of your Next.js frontend (without trailing slash).
                            <?php if (defined('HEADLESS_FRONTEND_URL')): ?>
                                <br><strong>Currently using value from wp-config.php</strong>
                            <?php endif; ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="preview_secret">Preview Secret</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="preview_secret"
                            name="preview_secret"
                            value="<?php echo esc_attr($preview_secret); ?>"
                            class="regular-text"
                            placeholder="Generate a secure random string"
                            <?php echo defined('WP_PREVIEW_SECRET') ? 'disabled' : ''; ?>
                        >
                        <p class="description">
                            A secure random string shared between WordPress and Next.js.
                            <?php if (defined('WP_PREVIEW_SECRET')): ?>
                                <br><strong>Currently using value from wp-config.php</strong>
                            <?php endif; ?>
                        </p>
                    </td>
                </tr>
            </table>

            <?php if (!$using_constants): ?>
                <p class="submit">
                    <input type="submit" name="headless_preview_save" class="button button-primary" value="Save Settings">
                </p>
            <?php endif; ?>
        </form>

        <hr>

        <h2>Testing</h2>
        <p>
            Test your configuration:
            <a href="<?php echo esc_url(rest_url('headless-preview/v1/post-types')); ?>" target="_blank" class="button">
                View Post Types Endpoint
            </a>
        </p>

        <h2>Custom Post Types Status</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Post Type</th>
                    <th>Label</th>
                    <th>REST Enabled</th>
                    <th>REST Base</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $post_types = get_post_types(['public' => true], 'objects');
                foreach ($post_types as $post_type):
                    if (in_array($post_type->name, ['attachment'])) continue;
                    $rest_enabled = $post_type->show_in_rest;
                    $rest_base = $post_type->rest_base ?: $post_type->name;
                ?>
                <tr>
                    <td><code><?php echo esc_html($post_type->name); ?></code></td>
                    <td><?php echo esc_html($post_type->label); ?></td>
                    <td>
                        <?php if ($rest_enabled): ?>
                            <span style="color: green;">✓ Yes</span>
                        <?php else: ?>
                            <span style="color: red;">✗ No</span>
                        <?php endif; ?>
                    </td>
                    <td><code><?php echo esc_html($rest_base); ?></code></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}
