<?php
/**
 * MaxiBlocks Custom Scripts Class
 *
 * @since   2.1.9
 * @package MaxiBlocks
 */

if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_Custom_Scripts')):
    class MaxiBlocks_Custom_Scripts
    {
        private static $instance;

        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_Custom_Scripts();
            }
        }

        public function __construct()
        {
            add_action('init', [$this, 'register_post_meta_fields']);
            add_action('add_meta_boxes', [$this, 'register_meta_boxes']);
            add_action('save_post', [$this, 'save_post_scripts_meta']);
            add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);

            add_action('wp_head', [$this, 'render_header_scripts'], 1);
            add_action('wp_footer', [$this, 'render_footer_scripts'], 999);

            add_filter('manage_post_posts_columns', [$this, 'add_custom_scripts_column']);
            add_filter('manage_page_posts_columns', [$this, 'add_custom_scripts_column']);
            add_action('manage_post_posts_custom_column', [$this, 'render_custom_scripts_column'], 10, 2);
            add_action('manage_page_posts_custom_column', [$this, 'render_custom_scripts_column'], 10, 2);

            add_action('quick_edit_custom_box', [$this, 'quick_edit_fields'], 10, 2);
            add_action('admin_footer-edit.php', [$this, 'quick_edit_script']);
            add_action('save_post', [$this, 'save_quick_edit_fields']);
        }

        public static function sanitize_scripts_code($value)
        {
            if (!is_string($value)) {
                return '';
            }

            // This field is restricted to users with unfiltered_html or
            // manage_options capability (see auth_callback and
            // can_edit_custom_scripts).  These users can already insert
            // arbitrary HTML/JS in WordPress, so heavy HTML-level
            // sanitisation (wp_kses) is unnecessary and would mangle
            // legitimate JavaScript (e.g. comparison operators, template
            // literals).  We trim whitespace and ensure the value is a
            // valid UTF-8 string.
            return trim(wp_check_invalid_utf8($value, true));
        }

        private static function can_edit_custom_scripts()
        {
            return current_user_can('unfiltered_html') || current_user_can('manage_options');
        }

        public function register_post_meta_fields()
        {
            $args = [
                'type' => 'string',
                'single' => true,
                'show_in_rest' => true,
                'sanitize_callback' => [__CLASS__, 'sanitize_scripts_code'],
                'auth_callback' => function () {
                    return self::can_edit_custom_scripts();
                },
            ];

            register_post_meta('post', '_maxi_custom_js_header', $args);
            register_post_meta('post', '_maxi_custom_js_footer', $args);
            register_post_meta('page', '_maxi_custom_js_header', $args);
            register_post_meta('page', '_maxi_custom_js_footer', $args);
        }

        public function enqueue_block_editor_assets()
        {
            $screen = get_current_screen();
            if (!$screen || !in_array($screen->post_type, ['post', 'page'], true)) {
                return;
            }

            $script = <<<'JS'
(function() {
    if (!window.wp || !wp.data || !wp.data.select || !wp.data.dispatch) {
        return;
    }

    var select = wp.data.select('core/editor');
    var dispatch = wp.data.dispatch('core/editor');
    if (!select || !dispatch || typeof dispatch.editPost !== 'function' || typeof select.getCurrentPostType !== 'function') {
        return;
    }

    if (!select.getCurrentPostType()) {
        return;
    }

    var timeout;
    var observer = null;
    var listenersBound = false;

    var bindScriptFields = function() {
        if (listenersBound) {
            return true;
        }

        var headerField = document.querySelector('textarea[name="maxi_custom_js_header"]');
        var footerField = document.querySelector('textarea[name="maxi_custom_js_footer"]');
        if (!headerField || !footerField) {
            return false;
        }

        var isSaving = function() {
            var saving = select.isSavingPost && select.isSavingPost();
            var autosaving = select.isAutosavingPost && select.isAutosavingPost();
            return saving || autosaving;
        };

        var sync = function() {
            if (isSaving()) {
                return;
            }
            dispatch.editPost({
                meta: {
                    _maxi_custom_js_header: headerField.value,
                    _maxi_custom_js_footer: footerField.value
                }
            });
        };

        var debouncedSync = function() {
            if (isSaving()) {
                return;
            }
            clearTimeout(timeout);
            timeout = setTimeout(sync, 200);
        };

        headerField.addEventListener('input', debouncedSync);
        footerField.addEventListener('input', debouncedSync);
        listenersBound = true;
        return true;
    };

    if (bindScriptFields()) {
        return;
    }

    if (!document.body || typeof MutationObserver === 'undefined') {
        return;
    }

    observer = new MutationObserver(function() {
        if (bindScriptFields() && observer) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(function() {
        if (observer && !listenersBound) {
            observer.disconnect();
        }
    }, 30000);
})();
JS;

            wp_add_inline_script('wp-edit-post', $script, 'after');
        }

        private function get_request_value($meta_key, $field_name)
        {
            if (
                isset($_POST['meta']) &&
                is_array($_POST['meta']) &&
                array_key_exists($meta_key, $_POST['meta'])
            ) {
                return $_POST['meta'][$meta_key];
            }

            if (array_key_exists($field_name, $_POST)) {
                return $_POST[$field_name];
            }

            return null;
        }

        public function save_post_scripts_meta($post_id)
        {
            if (defined('REST_REQUEST') && REST_REQUEST) {
                return;
            }

            if (!isset($_POST['maxi_custom_scripts_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['maxi_custom_scripts_nonce'])), 'maxi_custom_scripts_meta_box')) {
                return;
            }

            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
                return;
            }

            if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
                return;
            }

            if (!current_user_can('edit_post', $post_id)) {
                return;
            }

            if (!self::can_edit_custom_scripts()) {
                return;
            }

            $header_raw = $this->get_request_value(
                '_maxi_custom_js_header',
                'maxi_custom_js_header',
            );
            $footer_raw = $this->get_request_value(
                '_maxi_custom_js_footer',
                'maxi_custom_js_footer',
            );

            if (null === $header_raw && null === $footer_raw) {
                return;
            }

            $header_value = is_string($header_raw) ? (string) wp_unslash($header_raw) : '';
            $footer_value = is_string($footer_raw) ? (string) wp_unslash($footer_raw) : '';

            $header_script = self::sanitize_scripts_code($header_value);
            $footer_script = self::sanitize_scripts_code($footer_value);

            if ('' === trim($header_script)) {
                delete_post_meta($post_id, '_maxi_custom_js_header');
            } else {
                update_post_meta($post_id, '_maxi_custom_js_header', $header_script);
            }

            if ('' === trim($footer_script)) {
                delete_post_meta($post_id, '_maxi_custom_js_footer');
            } else {
                update_post_meta($post_id, '_maxi_custom_js_footer', $footer_script);
            }
        }

        public function register_meta_boxes()
        {
            add_meta_box(
                'maxi-custom-scripts',
                __('MaxiBlocks custom scripts and styles', 'maxi-blocks'),
                [$this, 'render_meta_box'],
                ['post', 'page'],
                'normal',
                'default',
            );
        }

        public function render_meta_box($post)
        {
            wp_nonce_field('maxi_custom_scripts_meta_box', 'maxi_custom_scripts_nonce');

            $header_script = get_post_meta($post->ID, '_maxi_custom_js_header', true);
            $footer_script = get_post_meta($post->ID, '_maxi_custom_js_footer', true);

            echo '<p><strong>' . esc_html__('Header scripts and styles', 'maxi-blocks') . '</strong></p>';
            echo '<p>' . esc_html__('Add code for this post/page only. Printed in the <head>. Wrap JavaScript in <script> tags and CSS in <style> tags.', 'maxi-blocks') . '</p>';
            echo '<textarea name="maxi_custom_js_header" rows="6" style="width:100%;">' . esc_textarea($header_script) . '</textarea>';

            echo '<p><strong>' . esc_html__('Footer scripts and styles', 'maxi-blocks') . '</strong></p>';
            echo '<p>' . esc_html__('Add code for this post/page only. Printed before </body>. Wrap JavaScript in <script> tags and CSS in <style> tags.', 'maxi-blocks') . '</p>';
            echo '<textarea name="maxi_custom_js_footer" rows="6" style="width:100%;">' . esc_textarea($footer_script) . '</textarea>';
        }

        public function render_header_scripts()
        {
            if (is_admin()) {
                return;
            }

            $global_header_scripts = get_option('maxi_custom_js_header_option', '');
            if (!empty($global_header_scripts)) {
                echo "\n<!-- MaxiBlocks custom header scripts -->\n";
                echo $global_header_scripts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                echo "\n";
            }

            if (is_singular(['post', 'page'])) {
                $post_id = get_queried_object_id();
                if (!$post_id) {
                    return;
                }

                $post_script = get_post_meta($post_id, '_maxi_custom_js_header', true);
                if (!empty($post_script)) {
                    echo "\n<!-- MaxiBlocks post/page header scripts -->\n";
                    echo $post_script; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo "\n";
                }
            }
        }

        public function render_footer_scripts()
        {
            if (is_admin()) {
                return;
            }

            $global_footer_scripts = get_option('maxi_custom_js_footer_option', '');
            if (!empty($global_footer_scripts)) {
                echo "\n<!-- MaxiBlocks custom footer scripts -->\n";
                echo $global_footer_scripts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                echo "\n";
            }

            if (is_singular(['post', 'page'])) {
                $post_id = get_queried_object_id();
                if (!$post_id) {
                    return;
                }

                $post_script = get_post_meta($post_id, '_maxi_custom_js_footer', true);
                if (!empty($post_script)) {
                    echo "\n<!-- MaxiBlocks post/page footer scripts -->\n";
                    echo $post_script; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo "\n";
                }
            }
        }

        public function add_custom_scripts_column($columns)
        {
            $columns['maxi_custom_scripts'] = __('Maxi scripts/styles', 'maxi-blocks');
            return $columns;
        }

        public function render_custom_scripts_column($column, $post_id)
        {
            if ('maxi_custom_scripts' !== $column) {
                return;
            }

            $header = get_post_meta($post_id, '_maxi_custom_js_header', true);
            $footer = get_post_meta($post_id, '_maxi_custom_js_footer', true);

            $status = [];
            if (!empty($header)) {
                $status[] = __('Header', 'maxi-blocks');
            }
            if (!empty($footer)) {
                $status[] = __('Footer', 'maxi-blocks');
            }

            echo '<span class="maxi-custom-scripts-status">' . esc_html(!empty($status) ? implode(' / ', $status) : __('None', 'maxi-blocks')) . '</span>';
            echo '<div class="hidden" id="maxi-custom-scripts-inline-' . esc_attr((string) $post_id) . '">';
            echo '<textarea class="maxi-inline-header">' . esc_textarea($header) . '</textarea>';
            echo '<textarea class="maxi-inline-footer">' . esc_textarea($footer) . '</textarea>';
            echo '</div>';
        }

        public function quick_edit_fields($column_name, $post_type)
        {
            if ('maxi_custom_scripts' !== $column_name || !in_array($post_type, ['post', 'page'], true)) {
                return;
            }

            wp_nonce_field('maxi_quick_edit_scripts', 'maxi_quick_edit_scripts_nonce');

            echo '<fieldset class="inline-edit-col-right">';
            echo '<div class="inline-edit-col">';
            echo '<label>';
            echo '<span class="title">' . esc_html__('Header scripts and styles', 'maxi-blocks') . '</span>';
            echo '<textarea name="maxi_quick_custom_js_header" rows="3"></textarea>';
            echo '</label>';
            echo '<label>';
            echo '<span class="title">' . esc_html__('Footer scripts and styles', 'maxi-blocks') . '</span>';
            echo '<textarea name="maxi_quick_custom_js_footer" rows="3"></textarea>';
            echo '</label>';
            echo '</div>';
            echo '</fieldset>';
        }

        public function quick_edit_script()
        {
            $screen = get_current_screen();
            if (!$screen || !in_array($screen->post_type, ['post', 'page'], true)) {
                return;
            }
            ?>
            <script>
                (function() {
                    if (typeof window.jQuery === 'undefined' || typeof window.inlineEditPost === 'undefined' || typeof window.inlineEditPost.edit !== 'function') {
                        return;
                    }

                    (function($) {
                        const wpInlineEditFunction = inlineEditPost.edit;
                        inlineEditPost.edit = function(postId) {
                            wpInlineEditFunction.apply(this, arguments);
                            let id = 0;
                            if (typeof(postId) === 'object') {
                                id = parseInt(this.getId(postId), 10);
                            }

                            if (id > 0) {
                                const $editRow = $('#edit-' + id);
                                const $inlineData = $('#maxi-custom-scripts-inline-' + id);

                                if ($inlineData.length) {
                                    $editRow.find('textarea[name="maxi_quick_custom_js_header"]').val($inlineData.find('.maxi-inline-header').val());
                                    $editRow.find('textarea[name="maxi_quick_custom_js_footer"]').val($inlineData.find('.maxi-inline-footer').val());
                                }
                            }
                        };
                    })(window.jQuery);
                })();
            </script>
            <?php
        }

        public function save_quick_edit_fields($post_id)
        {
            if (!isset($_POST['maxi_quick_edit_scripts_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['maxi_quick_edit_scripts_nonce'])), 'maxi_quick_edit_scripts')) {
                return;
            }

            if (!current_user_can('edit_post', $post_id)) {
                return;
            }

            if (!self::can_edit_custom_scripts()) {
                return;
            }

            if (!isset($_POST['maxi_quick_custom_js_header']) || !isset($_POST['maxi_quick_custom_js_footer'])) {
                return;
            }

            $header_raw = wp_unslash($_POST['maxi_quick_custom_js_header']);
            $footer_raw = wp_unslash($_POST['maxi_quick_custom_js_footer']);
            $header_value = is_string($header_raw) ? $header_raw : '';
            $footer_value = is_string($footer_raw) ? $footer_raw : '';

            $header_script = self::sanitize_scripts_code($header_value);
            $footer_script = self::sanitize_scripts_code($footer_value);

            if ('' === trim($header_script)) {
                delete_post_meta($post_id, '_maxi_custom_js_header');
            } else {
                update_post_meta($post_id, '_maxi_custom_js_header', $header_script);
            }

            if ('' === trim($footer_script)) {
                delete_post_meta($post_id, '_maxi_custom_js_footer');
            } else {
                update_post_meta($post_id, '_maxi_custom_js_footer', $footer_script);
            }
        }
    }
endif;
