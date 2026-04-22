<?php
/**
 * Maxi MCP companion plugin.
 *
 * @package MaxiBlocks
 */

if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('Maxi_MCP_Plugin')):
    class Maxi_MCP_Plugin
    {
        private static $instance = null;

        private const OPTION_ENABLED = 'maxi_mcp_enabled';
        private const FLASH_TRANSIENT_PREFIX = 'maxi_mcp_flash_';
        private const PAGE_CONNECT = 'maxi-mcp-connect';
        private const PAGE_SETTINGS = 'maxi-mcp-settings';
        private const PASSWORD_PREFIX = 'Maxi MCP';
        private const SERVER_NAME = 'maxi-wordpress';
        private const MINIMUM_WORDPRESS_VERSION = '6.9';

        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new self();
            }
        }

        public function __construct()
        {
            add_action('plugins_loaded', [$this, 'bootstrap'], 25);
            add_action('admin_menu', [$this, 'register_menu']);
            add_action('admin_post_maxi_mcp_save_settings', [
                $this,
                'handle_save_settings',
            ]);
            add_action('admin_post_maxi_mcp_create_password', [
                $this,
                'handle_create_password',
            ]);
            add_action('admin_post_maxi_mcp_revoke_password', [
                $this,
                'handle_revoke_password',
            ]);
            add_action('admin_notices', [$this, 'render_dependency_notices']);
            add_action('wp_abilities_api_categories_init', [
                $this,
                'register_ability_categories',
            ]);
            add_action('wp_abilities_api_init', [
                $this,
                'register_abilities',
            ]);
        }

        public function bootstrap()
        {
            if (!$this->is_enabled() || !$this->is_runtime_available()) {
                return;
            }

            add_filter(
                'mcp_adapter_default_server_config',
                [$this, 'filter_default_server_config'],
            );
            add_filter(
                'rest_pre_echo_response',
                [$this, 'normalize_empty_schema_properties'],
            );

            \WP\MCP\Core\McpAdapter::instance();
        }

        public function filter_default_server_config($config)
        {
            if (!is_array($config)) {
                return $config;
            }

            $config['server_name'] = 'Maxi MCP';

            if (isset($config['server_description'])) {
                $config['server_description'] = __(
                    'WordPress editing tools for the current MaxiBlocks site.',
                    'maxi-mcp',
                );
            }

            return $config;
        }

        public function normalize_empty_schema_properties($response)
        {
            if (!is_array($response)) {
                return $response;
            }

            $result = $response['result'] ?? null;

            if (!$result instanceof \stdClass) {
                return $response;
            }

            $tools = $result->tools ?? null;

            if (!is_array($tools)) {
                return $response;
            }

            foreach ($tools as &$tool) {
                foreach (['inputSchema', 'outputSchema'] as $schema_key) {
                    $schema = $tool[$schema_key] ?? null;

                    if (
                        !is_array($schema) ||
                        !array_key_exists('properties', $schema) ||
                        $schema['properties'] !== []
                    ) {
                        continue;
                    }

                    $schema['properties'] = new \stdClass();
                    $tool[$schema_key] = $schema;
                }
            }

            $result->tools = $tools;

            return $response;
        }

        public function register_menu()
        {
            add_menu_page(
                __('Connect', 'maxi-mcp'),
                __('Maxi MCP', 'maxi-mcp'),
                'manage_options',
                self::PAGE_CONNECT,
                [$this, 'render_connect_page'],
                'dashicons-share',
                59,
            );

            add_submenu_page(
                self::PAGE_CONNECT,
                __('Connect', 'maxi-mcp'),
                __('Connect', 'maxi-mcp'),
                'manage_options',
                self::PAGE_CONNECT,
                [$this, 'render_connect_page'],
            );

            add_submenu_page(
                self::PAGE_CONNECT,
                __('Settings', 'maxi-mcp'),
                __('Settings', 'maxi-mcp'),
                'manage_options',
                self::PAGE_SETTINGS,
                [$this, 'render_settings_page'],
            );
        }

        public function render_dependency_notices()
        {
            if (!current_user_can('manage_options')) {
                return;
            }

            $page = isset($_GET['page'])
                ? sanitize_key(wp_unslash($_GET['page']))
                : '';

            if (
                $page !== self::PAGE_CONNECT &&
                $page !== self::PAGE_SETTINGS
            ) {
                return;
            }

            if (!self::is_wordpress_supported()) {
                printf(
                    '<div class="notice notice-error"><p>%s</p></div>',
                    esc_html(
                        sprintf(
                            __(
                                'Maxi MCP requires WordPress %1$s or newer. This site is running %2$s.',
                                'maxi-mcp',
                            ),
                            self::MINIMUM_WORDPRESS_VERSION,
                            get_bloginfo('version'),
                        ),
                    ),
                );

                return;
            }

            if (!file_exists(WP_PLUGIN_DIR . '/maxi-blocks/plugin.php')) {
                printf(
                    '<div class="notice notice-error"><p>%s</p></div>',
                    esc_html__(
                        'Maxi MCP needs the MaxiBlocks plugin to be installed.',
                        'maxi-mcp',
                    ),
                );

                return;
            }

            if (!$this->is_runtime_available()) {
                printf(
                    '<div class="notice notice-error"><p>%s</p></div>',
                    esc_html__(
                        'Maxi MCP could not load the official WordPress MCP Adapter from MaxiBlocks. Reinstall MaxiBlocks or use a build that includes its Composer dependencies.',
                        'maxi-mcp',
                    ),
                );

                return;
            }

            if (
                function_exists('is_plugin_active') &&
                is_plugin_active('mcp-adapter/mcp-adapter.php')
            ) {
                printf(
                    '<div class="notice notice-info is-dismissible"><p>%s</p></div>',
                    esc_html__(
                        'The standalone MCP Adapter plugin is active. Maxi MCP already uses the official adapter through MaxiBlocks, so you can deactivate the standalone plugin to avoid confusion.',
                        'maxi-mcp',
                    ),
                );
            }
        }

        public function register_ability_categories()
        {
            if (!function_exists('wp_register_ability_category')) {
                return;
            }

            wp_register_ability_category('maxi-content', [
                'label' => __('Maxi Content', 'maxi-mcp'),
                'description' => __(
                    'Read and write WordPress posts and pages through Maxi MCP.',
                    'maxi-mcp',
                ),
            ]);
        }

        public function register_abilities()
        {
            if (!function_exists('wp_register_ability')) {
                return;
            }

            wp_register_ability('maxi-mcp/list-content', [
                'label' => __('List Content', 'maxi-mcp'),
                'description' => __(
                    'List WordPress posts or pages with optional search and status filters. Use this first when you need to find a page before reading or updating it.',
                    'maxi-mcp',
                ),
                'category' => 'maxi-content',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'post_type' => [
                            'type' => 'string',
                            'enum' => ['post', 'page'],
                            'default' => 'page',
                        ],
                        'status' => [
                            'type' => 'string',
                            'enum' => ['publish', 'draft', 'private', 'pending', 'any'],
                            'default' => 'any',
                        ],
                        'search' => [
                            'type' => 'string',
                        ],
                        'per_page' => [
                            'type' => 'integer',
                            'default' => 10,
                            'minimum' => 1,
                            'maximum' => 25,
                        ],
                        'page' => [
                            'type' => 'integer',
                            'default' => 1,
                            'minimum' => 1,
                        ],
                    ],
                ],
                'output_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'items' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'id' => ['type' => 'integer'],
                                    'post_type' => ['type' => 'string'],
                                    'status' => ['type' => 'string'],
                                    'slug' => ['type' => 'string'],
                                    'title' => ['type' => 'string'],
                                    'link' => ['type' => 'string'],
                                    'modified' => ['type' => 'string'],
                                ],
                            ],
                        ],
                        'total' => ['type' => 'integer'],
                    ],
                    'required' => ['items', 'total'],
                ],
                'permission_callback' => [$this, 'can_list_content'],
                'execute_callback' => [$this, 'list_content'],
                'meta' => [
                    'annotations' => [
                        'readonly' => true,
                        'destructive' => false,
                        'idempotent' => true,
                    ],
                    'mcp' => [
                        'public' => true,
                        'type' => 'tool',
                    ],
                ],
            ]);

            wp_register_ability('maxi-mcp/get-content', [
                'label' => __('Get Content', 'maxi-mcp'),
                'description' => __(
                    'Get the editable details for a WordPress post or page, including title, excerpt, and raw post_content.',
                    'maxi-mcp',
                ),
                'category' => 'maxi-content',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => [
                            'type' => 'integer',
                        ],
                    ],
                    'required' => ['id'],
                ],
                'output_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'post_type' => ['type' => 'string'],
                        'status' => ['type' => 'string'],
                        'slug' => ['type' => 'string'],
                        'title' => ['type' => 'string'],
                        'excerpt' => ['type' => 'string'],
                        'content' => ['type' => 'string'],
                        'link' => ['type' => 'string'],
                        'modified' => ['type' => 'string'],
                    ],
                    'required' => [
                        'id',
                        'post_type',
                        'status',
                        'slug',
                        'title',
                        'excerpt',
                        'content',
                        'link',
                        'modified',
                    ],
                ],
                'permission_callback' => [$this, 'can_edit_content'],
                'execute_callback' => [$this, 'get_content'],
                'meta' => [
                    'annotations' => [
                        'readonly' => true,
                        'destructive' => false,
                        'idempotent' => true,
                    ],
                    'mcp' => [
                        'public' => true,
                        'type' => 'tool',
                    ],
                ],
            ]);

            wp_register_ability('maxi-mcp/upsert-content', [
                'label' => __('Create or Update Content', 'maxi-mcp'),
                'description' => __(
                    'Create a new WordPress post/page or update an existing one. Use this for safe draft-first edits and content rewrites.',
                    'maxi-mcp',
                ),
                'category' => 'maxi-content',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'post_type' => [
                            'type' => 'string',
                            'enum' => ['post', 'page'],
                            'default' => 'page',
                        ],
                        'title' => ['type' => 'string'],
                        'content' => ['type' => 'string'],
                        'excerpt' => ['type' => 'string'],
                        'status' => [
                            'type' => 'string',
                            'enum' => ['draft', 'publish', 'private', 'pending'],
                            'default' => 'draft',
                        ],
                        'slug' => ['type' => 'string'],
                        'parent' => ['type' => 'integer'],
                    ],
                ],
                'output_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'post_type' => ['type' => 'string'],
                        'status' => ['type' => 'string'],
                        'slug' => ['type' => 'string'],
                        'title' => ['type' => 'string'],
                        'link' => ['type' => 'string'],
                    ],
                    'required' => ['id', 'post_type', 'status', 'slug', 'title', 'link'],
                ],
                'permission_callback' => [$this, 'can_upsert_content'],
                'execute_callback' => [$this, 'upsert_content'],
                'meta' => [
                    'annotations' => [
                        'readonly' => false,
                        'destructive' => false,
                        'idempotent' => false,
                    ],
                    'mcp' => [
                        'public' => true,
                        'type' => 'tool',
                    ],
                ],
            ]);

            wp_register_ability('maxi-mcp/delete-content', [
                'label' => __('Delete Content', 'maxi-mcp'),
                'description' => __(
                    'Delete a WordPress post or page.',
                    'maxi-mcp',
                ),
                'category' => 'maxi-content',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer'],
                    ],
                    'required' => ['id'],
                ],
                'output_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'deleted' => ['type' => 'boolean'],
                    ],
                    'required' => ['id', 'deleted'],
                ],
                'permission_callback' => [$this, 'can_delete_content'],
                'execute_callback' => [$this, 'delete_content'],
                'meta' => [
                    'annotations' => [
                        'readonly' => false,
                        'destructive' => true,
                        'idempotent' => false,
                    ],
                    'mcp' => [
                        'public' => true,
                        'type' => 'tool',
                    ],
                ],
            ]);

            wp_register_ability('maxi-mcp/get-guide', [
                'label' => __('Get Maxi MCP Guide', 'maxi-mcp'),
                'description' => __(
                    'Return the recommended workflow, common tasks, and MaxiBlocks context for AI clients connected to this site.',
                    'maxi-mcp',
                ),
                'category' => 'maxi-content',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => [],
                ],
                'output_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'overview' => ['type' => 'string'],
                        'workflow' => [
                            'type' => 'array',
                            'items' => ['type' => 'string'],
                        ],
                        'content_tools' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'name' => ['type' => 'string'],
                                    'purpose' => ['type' => 'string'],
                                ],
                            ],
                        ],
                        'common_tasks' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'task' => ['type' => 'string'],
                                    'steps' => [
                                        'type' => 'array',
                                        'items' => ['type' => 'string'],
                                    ],
                                ],
                            ],
                        ],
                        'maxiblocks_context' => [
                            'type' => 'object',
                            'properties' => [
                                'summary' => ['type' => 'string'],
                                'blocks' => [
                                    'type' => 'array',
                                    'items' => ['type' => 'string'],
                                ],
                                'features' => [
                                    'type' => 'array',
                                    'items' => ['type' => 'string'],
                                ],
                            ],
                        ],
                        'starter_prompts' => [
                            'type' => 'array',
                            'items' => ['type' => 'string'],
                        ],
                    ],
                    'required' => [
                        'overview',
                        'workflow',
                        'content_tools',
                        'common_tasks',
                        'maxiblocks_context',
                        'starter_prompts',
                    ],
                ],
                'permission_callback' => [$this, 'can_read_guide'],
                'execute_callback' => [$this, 'get_guide'],
                'meta' => [
                    'annotations' => [
                        'readonly' => true,
                        'destructive' => false,
                        'idempotent' => true,
                    ],
                    'mcp' => [
                        'public' => true,
                        'type' => 'tool',
                    ],
                ],
            ]);
        }

        public function handle_save_settings()
        {
            $this->assert_manage_options();
            check_admin_referer('maxi_mcp_save_settings');

            $enabled = isset($_POST['maxi_mcp_enabled']);
            update_option(self::OPTION_ENABLED, $enabled);

            $this->set_flash([
                'type' => 'success',
                'message' => $enabled
                    ? __(
                        'Maxi MCP is enabled. You can connect Claude Code or Codex now.',
                        'maxi-mcp',
                    )
                    : __(
                        'Maxi MCP is disabled. External MCP clients can no longer connect.',
                        'maxi-mcp',
                    ),
            ]);

            $this->redirect_to(self::PAGE_SETTINGS);
        }

        public function handle_create_password()
        {
            $this->assert_manage_options();
            check_admin_referer('maxi_mcp_create_password');

            if (
                !class_exists('WP_Application_Passwords') ||
                !function_exists('wp_is_application_passwords_available') ||
                !wp_is_application_passwords_available()
            ) {
                $this->set_flash([
                    'type' => 'error',
                    'message' => __(
                        'Application passwords require HTTPS or a local WordPress environment.',
                        'maxi-mcp',
                    ),
                ]);

                $this->redirect_to(self::PAGE_CONNECT);
            }

            $label = isset($_POST['password_name'])
                ? sanitize_text_field(wp_unslash($_POST['password_name']))
                : '';
            $name = $this->build_password_name($label);
            $result = WP_Application_Passwords::create_new_application_password(
                get_current_user_id(),
                ['name' => $name],
            );

            if (is_wp_error($result)) {
                $this->set_flash([
                    'type' => 'error',
                    'message' => $result->get_error_message(),
                ]);

                $this->redirect_to(self::PAGE_CONNECT);
            }

            $this->set_flash([
                'type' => 'success',
                'message' => __(
                    'Application password created. Copy it now. WordPress will not show it again after you leave this page.',
                    'maxi-mcp',
                ),
                'password' => (string) $result[0],
                'password_name' => $name,
            ]);

            $this->redirect_to(self::PAGE_CONNECT);
        }

        public function handle_revoke_password()
        {
            $this->assert_manage_options();
            check_admin_referer('maxi_mcp_revoke_password');

            if (!class_exists('WP_Application_Passwords')) {
                $this->set_flash([
                    'type' => 'error',
                    'message' => __(
                        'Application passwords are not available on this site.',
                        'maxi-mcp',
                    ),
                ]);

                $this->redirect_to(self::PAGE_CONNECT);
            }

            $uuid = isset($_POST['uuid'])
                ? sanitize_text_field(wp_unslash($_POST['uuid']))
                : '';

            if ($uuid === '') {
                $this->set_flash([
                    'type' => 'error',
                    'message' => __(
                        'Missing application password identifier.',
                        'maxi-mcp',
                    ),
                ]);

                $this->redirect_to(self::PAGE_CONNECT);
            }

            $deleted = WP_Application_Passwords::delete_application_password(
                get_current_user_id(),
                $uuid,
            );

            $this->set_flash([
                'type' => $deleted ? 'success' : 'error',
                'message' => $deleted
                    ? __(
                        'Application password revoked.',
                        'maxi-mcp',
                    )
                    : __(
                        'Application password could not be revoked.',
                        'maxi-mcp',
                    ),
            ]);

            $this->redirect_to(self::PAGE_CONNECT);
        }

        public function render_connect_page()
        {
            if (!current_user_can('manage_options')) {
                return;
            }

            $flash = $this->pull_flash();
            $status = $this->get_server_status();
            $endpoint_url = $this->get_endpoint_url();
            $current_user = wp_get_current_user();
            $username = (string) ($current_user->user_login ?? '');
            $password = (string) ($flash['password'] ?? '');

            echo '<div class="wrap maxi-mcp-admin">';
            echo '<h1>' . esc_html__('Connect', 'maxi-mcp') . '</h1>';

            $this->render_flash($flash);
            $this->render_status_card($status, true);

            echo '<div class="maxi-mcp-grid">';

            echo '<section class="maxi-mcp-card">';
            echo '<h2>' . esc_html__('1. Enable the server', 'maxi-mcp') . '</h2>';
            echo '<p>' .
                esc_html__(
                    'Turn on Maxi MCP in Settings first. That makes the WordPress MCP endpoint available to Claude Code, Codex, and other MCP clients.',
                    'maxi-mcp',
                ) .
                '</p>';
            echo '<p><a class="button" href="' .
                esc_url(admin_url('admin.php?page=' . self::PAGE_SETTINGS)) .
                '">' .
                esc_html__('Open Maxi MCP settings', 'maxi-mcp') .
                '</a></p>';
            echo '</section>';

            echo '<section class="maxi-mcp-card">';
            echo '<h2>' . esc_html__('2. Create a WordPress password', 'maxi-mcp') . '</h2>';
            echo '<p>' .
                esc_html__(
                    'This password is only for the AI client. It is separate from your normal WordPress login.',
                    'maxi-mcp',
                ) .
                '</p>';
            echo '<form method="post" action="' .
                esc_url(admin_url('admin-post.php')) .
                '" class="maxi-mcp-inline-form">';
            wp_nonce_field('maxi_mcp_create_password');
            echo '<input type="hidden" name="action" value="maxi_mcp_create_password">';
            echo '<input type="text" name="password_name" class="regular-text" placeholder="' .
                esc_attr__(
                    'Optional label, for example Office laptop',
                    'maxi-mcp',
                ) .
                '">';
            echo '<button type="submit" class="button button-primary">' .
                esc_html__('Create application password', 'maxi-mcp') .
                '</button>';
            echo '</form>';

            if ($password !== '') {
                echo '<div class="maxi-mcp-secret">';
                echo '<strong>' .
                    esc_html__(
                        'New application password',
                        'maxi-mcp',
                    ) .
                    '</strong>';
                echo '<div class="maxi-mcp-copy-row">';
                echo '<textarea id="maxi-mcp-new-password" class="large-text code" rows="2" readonly>' .
                    esc_textarea($password) .
                    '</textarea>';
                echo '<button type="button" class="button" data-copy-target="maxi-mcp-new-password">' .
                    esc_html__('Copy', 'maxi-mcp') .
                    '</button>';
                echo '</div>';
                echo '<p class="description">' .
                    esc_html__(
                        'Copy this now. WordPress will not show it again after you leave this page.',
                        'maxi-mcp',
                    ) .
                    '</p>';
                echo '</div>';
            }

            $this->render_password_list();
            echo '</section>';

            echo '<section class="maxi-mcp-card">';
            echo '<h2>' . esc_html__('3. Connect your client', 'maxi-mcp') . '</h2>';
            echo '<p>' .
                esc_html__(
                    'Use the generated setup below on the same machine where Claude Code or Codex is installed.',
                    'maxi-mcp',
                ) .
                '</p>';
            echo '<div class="maxi-mcp-stack">';
            $this->render_copy_block(
                'maxi-mcp-endpoint',
                __('Maxi MCP endpoint', 'maxi-mcp'),
                $endpoint_url,
                __(
                    'Use this direct server URL if a client asks for the raw MCP endpoint.',
                    'maxi-mcp',
                ),
            );
            $this->render_copy_block(
                'maxi-mcp-claude-macos',
                __('Claude Code command (macOS / Linux)', 'maxi-mcp'),
                $this->build_claude_command($username, $password, false),
                $password !== ''
                    ? __(
                        'Run this in Terminal on the machine where Claude Code is installed.',
                        'maxi-mcp',
                    )
                    : __(
                        'Create an application password first to generate a ready-to-run Claude Code command.',
                        'maxi-mcp',
                    ),
            );
            $this->render_copy_block(
                'maxi-mcp-claude-windows',
                __('Claude Code command (Windows)', 'maxi-mcp'),
                $this->build_claude_command($username, $password, true),
                $password !== ''
                    ? __(
                        'Run this in PowerShell or Command Prompt on the machine where Claude Code is installed.',
                        'maxi-mcp',
                    )
                    : __(
                        'Create an application password first to generate a ready-to-run Claude Code command.',
                        'maxi-mcp',
                    ),
            );
            $this->render_copy_block(
                'maxi-mcp-codex-config',
                __('Codex config.toml snippet', 'maxi-mcp'),
                $this->build_codex_config($username, $password),
                $password !== ''
                    ? __(
                        'Paste this into ~/.codex/config.toml, then restart Codex.',
                        'maxi-mcp',
                    )
                    : __(
                        'Create an application password first to generate a ready-to-paste Codex config block.',
                        'maxi-mcp',
                    ),
            );
            echo '</div>';
            echo '</section>';

            echo '<section class="maxi-mcp-card">';
            echo '<h2>' . esc_html__('4. First prompt', 'maxi-mcp') . '</h2>';
            echo '<p>' .
                esc_html__(
                    'Open a fresh chat after connecting the client, then paste one of these prompts.',
                    'maxi-mcp',
                ) .
                '</p>';
            $this->render_copy_block(
                'maxi-mcp-claude-prompt',
                __('Claude Code first prompt', 'maxi-mcp'),
                $this->build_first_prompt('claude'),
                __(
                    'Use this right after you connect Claude Code.',
                    'maxi-mcp',
                ),
            );
            $this->render_copy_block(
                'maxi-mcp-codex-prompt',
                __('Codex first prompt', 'maxi-mcp'),
                $this->build_first_prompt('codex'),
                __(
                    'Use this right after you connect Codex.',
                    'maxi-mcp',
                ),
            );
            echo '</section>';

            echo '</div>';

            $this->render_page_script();
            echo '</div>';
        }

        public function render_settings_page()
        {
            if (!current_user_can('manage_options')) {
                return;
            }

            $flash = $this->pull_flash();
            $status = $this->get_server_status();

            echo '<div class="wrap maxi-mcp-admin">';
            echo '<h1>' . esc_html__('Settings', 'maxi-mcp') . '</h1>';

            $this->render_flash($flash);
            $this->render_status_card($status, false);

            echo '<form method="post" action="' .
                esc_url(admin_url('admin-post.php')) .
                '" class="maxi-mcp-card maxi-mcp-settings-form">';
            wp_nonce_field('maxi_mcp_save_settings');
            echo '<input type="hidden" name="action" value="maxi_mcp_save_settings">';
            echo '<h2>' . esc_html__('Server access', 'maxi-mcp') . '</h2>';
            echo '<label class="maxi-mcp-toggle">';
            echo '<input type="checkbox" name="maxi_mcp_enabled" value="1" ' .
                checked($this->is_enabled(), true, false) .
                '>';
            echo '<span>' .
                esc_html__(
                    'Enable Maxi MCP on this site',
                    'maxi-mcp',
                ) .
                '</span>';
            echo '</label>';
            echo '<p class="description">' .
                esc_html__(
                    'When enabled, external MCP clients can read the tool list for this WordPress site and use any public abilities exposed through the official WordPress MCP Adapter.',
                    'maxi-mcp',
                ) .
                '</p>';
            echo '<p class="description">' .
                esc_html__(
                    'This is for site admins and developers. Keep it disabled on sites where you do not want external AI clients to connect.',
                    'maxi-mcp',
                ) .
                '</p>';
            echo '<p><button type="submit" class="button button-primary">' .
                esc_html__('Save settings', 'maxi-mcp') .
                '</button></p>';
            echo '</form>';

            echo '<div class="maxi-mcp-card">';
            echo '<h2>' . esc_html__('Current endpoint', 'maxi-mcp') . '</h2>';
            echo '<p>' .
                esc_html__(
                    'This is the streamable HTTP endpoint clients connect to.',
                    'maxi-mcp',
                ) .
                '</p>';
            $this->render_copy_block(
                'maxi-mcp-settings-endpoint',
                __('Endpoint URL', 'maxi-mcp'),
                $this->get_endpoint_url(),
                '',
            );
            echo '</div>';

            $this->render_page_script();
            echo '</div>';
        }

        private function render_flash($flash)
        {
            if (!is_array($flash) || empty($flash['message'])) {
                return;
            }

            $type = sanitize_html_class((string) ($flash['type'] ?? 'info'));
            printf(
                '<div class="notice notice-%1$s is-dismissible"><p>%2$s</p></div>',
                esc_attr($type),
                esc_html((string) $flash['message']),
            );
        }

        private function render_status_card($status, $show_settings_link)
        {
            $class = !empty($status['ready'])
                ? 'maxi-mcp-card maxi-mcp-card--success'
                : 'maxi-mcp-card maxi-mcp-card--warning';

            echo '<div class="' . esc_attr($class) . '">';
            echo '<h2>' . esc_html__('Status', 'maxi-mcp') . '</h2>';
            echo '<p>' . esc_html((string) $status['message']) . '</p>';

            if (
                $show_settings_link &&
                empty($status['ready']) &&
                ($status['code'] ?? '') === 'disabled'
            ) {
                echo '<p><a class="button button-secondary" href="' .
                    esc_url(admin_url('admin.php?page=' . self::PAGE_SETTINGS)) .
                    '">' .
                    esc_html__('Enable Maxi MCP in settings', 'maxi-mcp') .
                    '</a></p>';
            }

            echo '</div>';
        }

        private function render_password_list()
        {
            $passwords = $this->get_passwords_for_user();

            echo '<div class="maxi-mcp-password-list">';
            echo '<h3>' . esc_html__('Existing Maxi MCP passwords', 'maxi-mcp') . '</h3>';

            if ($passwords === []) {
                echo '<p class="description">' .
                    esc_html__(
                        'No Maxi MCP application passwords yet.',
                        'maxi-mcp',
                    ) .
                    '</p>';
                echo '</div>';

                return;
            }

            echo '<table class="widefat striped"><thead><tr>';
            echo '<th>' . esc_html__('Name', 'maxi-mcp') . '</th>';
            echo '<th>' . esc_html__('Created', 'maxi-mcp') . '</th>';
            echo '<th>' . esc_html__('Last used', 'maxi-mcp') . '</th>';
            echo '<th>' . esc_html__('Actions', 'maxi-mcp') . '</th>';
            echo '</tr></thead><tbody>';

            foreach ($passwords as $password) {
                echo '<tr>';
                echo '<td>' . esc_html($password['name']) . '</td>';
                echo '<td>' . esc_html($password['created']) . '</td>';
                echo '<td>' . esc_html($password['lastUsed']) . '</td>';
                echo '<td>';
                echo '<form method="post" action="' .
                    esc_url(admin_url('admin-post.php')) .
                    '" onsubmit="return window.confirm(' .
                    wp_json_encode(
                        __(
                            'Revoke this application password? Any AI client using it will lose access immediately.',
                            'maxi-mcp',
                        ),
                    ) .
                    ');">';
                wp_nonce_field('maxi_mcp_revoke_password');
                echo '<input type="hidden" name="action" value="maxi_mcp_revoke_password">';
                echo '<input type="hidden" name="uuid" value="' .
                    esc_attr($password['uuid']) .
                    '">';
                echo '<button type="submit" class="button button-small">' .
                    esc_html__('Revoke', 'maxi-mcp') .
                    '</button>';
                echo '</form>';
                echo '</td>';
                echo '</tr>';
            }

            echo '</tbody></table>';
            echo '</div>';
        }

        private function render_copy_block($id, $label, $value, $description)
        {
            echo '<div class="maxi-mcp-copy-block">';
            echo '<label for="' . esc_attr($id) . '"><strong>' .
                esc_html($label) .
                '</strong></label>';
            echo '<div class="maxi-mcp-copy-row">';
            echo '<textarea id="' .
                esc_attr($id) .
                '" class="large-text code" rows="' .
                esc_attr($this->get_textarea_rows($value)) .
                '" readonly>' .
                esc_textarea($value) .
                '</textarea>';
            echo '<button type="button" class="button" data-copy-target="' .
                esc_attr($id) .
                '">' .
                esc_html__('Copy', 'maxi-mcp') .
                '</button>';
            echo '</div>';

            if ($description !== '') {
                echo '<p class="description">' . esc_html($description) . '</p>';
            }

            echo '</div>';
        }

        private function render_page_script()
        {
            static $rendered = false;

            if ($rendered) {
                return;
            }

            $rendered = true;

            echo '<style>
                .maxi-mcp-admin .maxi-mcp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;margin-top:20px}
                .maxi-mcp-admin .maxi-mcp-card{background:#fff;border:1px solid #dcdcde;border-radius:10px;padding:20px}
                .maxi-mcp-admin .maxi-mcp-card--success{border-color:#00a32a}
                .maxi-mcp-admin .maxi-mcp-card--warning{border-color:#dba617}
                .maxi-mcp-admin .maxi-mcp-inline-form,.maxi-mcp-admin .maxi-mcp-copy-row{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}
                .maxi-mcp-admin .maxi-mcp-inline-form .regular-text{min-width:260px}
                .maxi-mcp-admin .maxi-mcp-copy-row textarea{flex:1;min-width:240px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
                .maxi-mcp-admin .maxi-mcp-copy-block + .maxi-mcp-copy-block{margin-top:18px}
                .maxi-mcp-admin .maxi-mcp-secret{margin-top:16px;padding:16px;border:1px solid #dcdcde;border-radius:8px;background:#f6f7f7}
                .maxi-mcp-admin .maxi-mcp-stack{display:grid;gap:18px}
                .maxi-mcp-admin .maxi-mcp-settings-form{max-width:760px}
                .maxi-mcp-admin .maxi-mcp-toggle{display:flex;gap:10px;align-items:flex-start;font-weight:600;margin:10px 0 12px}
                .maxi-mcp-admin .maxi-mcp-password-list{margin-top:18px}
                .maxi-mcp-admin textarea.large-text{resize:vertical}
                .maxi-mcp-admin .description{max-width:72ch}
            </style>';
            echo '<script>
                document.addEventListener("click", function(event) {
                    var button = event.target.closest("[data-copy-target]");
                    if (!button) return;
                    var target = document.getElementById(button.getAttribute("data-copy-target"));
                    if (!target || !navigator.clipboard) return;
                    navigator.clipboard.writeText(target.value || target.textContent || "").then(function() {
                        var original = button.textContent;
                        button.textContent = "Copied!";
                        window.setTimeout(function() {
                            button.textContent = original;
                        }, 1500);
                    });
                });
            </script>';
        }

        private function get_textarea_rows($value)
        {
            $lines = max(2, substr_count((string) $value, "\n") + 1);

            return min($lines, 12);
        }

        public function can_list_content($input = [])
        {
            return $this->require_capability(
                $this->get_post_type_capability(
                    $this->sanitize_post_type($input['post_type'] ?? 'page'),
                ),
            );
        }

        public function can_read_guide($input = [])
        {
            return $this->require_capability('read');
        }

        public function can_edit_content($input = [])
        {
            return $this->require_post_capability($input, 'edit_post');
        }

        public function can_upsert_content($input = [])
        {
            if (!empty($input['id'])) {
                return $this->require_post_capability($input, 'edit_post');
            }

            return $this->require_capability(
                $this->get_post_type_capability(
                    $this->sanitize_post_type($input['post_type'] ?? 'page'),
                ),
            );
        }

        public function can_delete_content($input = [])
        {
            return $this->require_post_capability($input, 'delete_post');
        }

        public function list_content($input = [])
        {
            $post_type = $this->sanitize_post_type($input['post_type'] ?? 'page');
            $status = $this->sanitize_list_status($input['status'] ?? 'any');
            $per_page = min(
                25,
                max(1, absint($input['per_page'] ?? 10)),
            );
            $page = max(1, absint($input['page'] ?? 1));

            $query = new \WP_Query([
                'post_type' => $post_type,
                'post_status' => $status === 'any'
                    ? ['publish', 'draft', 'private', 'pending']
                    : $status,
                'posts_per_page' => $per_page,
                'paged' => $page,
                's' => isset($input['search'])
                    ? sanitize_text_field((string) $input['search'])
                    : '',
                'orderby' => 'modified',
                'order' => 'DESC',
            ]);

            $items = array_map(function ($post) {
                return $this->format_post_summary($post);
            }, $query->posts);

            return [
                'items' => $items,
                'total' => (int) $query->found_posts,
            ];
        }

        public function get_content($input = [])
        {
            $post = $this->get_editable_post_or_error($input);
            if (is_wp_error($post)) {
                return $post;
            }

            return $this->format_post_detail($post);
        }

        public function upsert_content($input = [])
        {
            $post_type = $this->sanitize_post_type($input['post_type'] ?? 'page');
            $post_status = $this->sanitize_edit_status($input['status'] ?? 'draft');
            $post_data = [
                'post_type' => $post_type,
                'post_status' => $post_status,
            ];

            if (array_key_exists('title', $input)) {
                $post_data['post_title'] = sanitize_text_field(
                    (string) $input['title'],
                );
            }

            if (array_key_exists('content', $input)) {
                $post_data['post_content'] = (string) $input['content'];
            }

            if (array_key_exists('excerpt', $input)) {
                $post_data['post_excerpt'] = sanitize_textarea_field(
                    (string) $input['excerpt'],
                );
            }

            if (!empty($input['slug'])) {
                $post_data['post_name'] = sanitize_title(
                    (string) $input['slug'],
                );
            }

            if (!empty($input['parent']) && $post_type === 'page') {
                $post_data['post_parent'] = absint($input['parent']);
            }

            if (!empty($input['id'])) {
                $post_data['ID'] = absint($input['id']);
                $result = wp_update_post(wp_slash($post_data), true);
            } else {
                $result = wp_insert_post(wp_slash($post_data), true);
            }

            if (is_wp_error($result)) {
                return $result;
            }

            $post = get_post((int) $result);

            if (!$post instanceof \WP_Post) {
                return new \WP_Error(
                    'maxi_mcp_post_missing',
                    __(
                        'The post was saved, but WordPress could not reload it.',
                        'maxi-mcp',
                    ),
                );
            }

            return $this->format_post_summary($post);
        }

        public function delete_content($input = [])
        {
            $post = $this->get_editable_post_or_error($input);
            if (is_wp_error($post)) {
                return $post;
            }

            $deleted = wp_delete_post($post->ID, true);

            if (!$deleted instanceof \WP_Post) {
                return new \WP_Error(
                    'maxi_mcp_delete_failed',
                    __(
                        'WordPress could not delete that post or page.',
                        'maxi-mcp',
                    ),
                );
            }

            return [
                'id' => (int) $post->ID,
                'deleted' => true,
            ];
        }

        public function get_guide($input = [])
        {
            return [
                'overview' => __(
                    'This WordPress site uses MaxiBlocks, a design-first Gutenberg builder with 19 foundation blocks, style cards, starter sites, dynamic content, and the MaxiBlocks Go theme. Use the Maxi MCP content tools to find pages, inspect raw content, and make safe updates.',
                    'maxi-mcp',
                ),
                'workflow' => [
                    __(
                        'Start with maxi-mcp/list-content to find the relevant page or post.',
                        'maxi-mcp',
                    ),
                    __(
                        'Use maxi-mcp/get-content before editing so you can inspect the current raw content and preserve structure.',
                        'maxi-mcp',
                    ),
                    __(
                        'Prefer updating drafts first. Use maxi-mcp/upsert-content with status=draft unless the user clearly wants a published change.',
                        'maxi-mcp',
                    ),
                    __(
                        'Avoid deleting content unless the user explicitly asks for deletion.',
                        'maxi-mcp',
                    ),
                    __(
                        'When editing MaxiBlocks-heavy pages, preserve existing block comments and only change the content the user asked for.',
                        'maxi-mcp',
                    ),
                ],
                'content_tools' => [
                    [
                        'name' => 'maxi-mcp/list-content',
                        'purpose' => __(
                            'Find posts or pages by type, status, or search term.',
                            'maxi-mcp',
                        ),
                    ],
                    [
                        'name' => 'maxi-mcp/get-content',
                        'purpose' => __(
                            'Read the full editable content of a specific post or page.',
                            'maxi-mcp',
                        ),
                    ],
                    [
                        'name' => 'maxi-mcp/upsert-content',
                        'purpose' => __(
                            'Create new drafts or update existing posts and pages.',
                            'maxi-mcp',
                        ),
                    ],
                    [
                        'name' => 'maxi-mcp/delete-content',
                        'purpose' => __(
                            'Delete a post or page when the user explicitly requests it.',
                            'maxi-mcp',
                        ),
                    ],
                    [
                        'name' => 'maxi-mcp/get-guide',
                        'purpose' => __(
                            'Reload this usage guide and task workflow at any time.',
                            'maxi-mcp',
                        ),
                    ],
                ],
                'common_tasks' => [
                    [
                        'task' => __(
                            'Update an existing page',
                            'maxi-mcp',
                        ),
                        'steps' => [
                            'maxi-mcp/list-content',
                            'maxi-mcp/get-content',
                            'maxi-mcp/upsert-content',
                        ],
                    ],
                    [
                        'task' => __(
                            'Create a new draft landing page',
                            'maxi-mcp',
                        ),
                        'steps' => [
                            'maxi-mcp/upsert-content',
                        ],
                    ],
                    [
                        'task' => __(
                            'Audit site content before editing',
                            'maxi-mcp',
                        ),
                        'steps' => [
                            'core/get-site-info',
                            'maxi-mcp/list-content',
                            'maxi-mcp/get-guide',
                        ],
                    ],
                ],
                'maxiblocks_context' => [
                    'summary' => __(
                        'MaxiBlocks focuses on fewer, more capable Gutenberg blocks instead of a huge block catalog. It also includes style cards, starter sites, a cloud design library, dynamic content, and a Full Site Editing theme.',
                        'maxi-mcp',
                    ),
                    'blocks' => [
                        'Container',
                        'Row',
                        'Column',
                        'Group',
                        'Text',
                        'Heading',
                        'Button',
                        'Image',
                        'Icon',
                        'Video',
                        'Divider',
                        'Accordion',
                        'Slider',
                        'Map',
                        'Number Counter',
                        'Search',
                        'List Item',
                        'Template Library',
                    ],
                    'features' => [
                        'Style Cards',
                        'Starter Sites',
                        'Dynamic Content',
                        'Custom CSS',
                        'Animations and Scroll Effects',
                        'MaxiBlocks Go Theme',
                    ],
                ],
                'starter_prompts' => [
                    __(
                        'Use maxi-mcp/get-guide, then list the first 5 pages on this site and tell me which one looks safest to edit.',
                        'maxi-mcp',
                    ),
                    __(
                        'Use maxi-mcp/get-guide, then find the About page, read it, and suggest a clearer headline and intro paragraph.',
                        'maxi-mcp',
                    ),
                ],
            ];
        }

        private function get_server_status()
        {
            if (!file_exists(WP_PLUGIN_DIR . '/maxi-blocks/plugin.php')) {
                return [
                    'code' => 'maxi_missing',
                    'ready' => false,
                    'message' => __(
                        'Maxi MCP needs the MaxiBlocks plugin to be installed.',
                        'maxi-mcp',
                    ),
                ];
            }

            if (!self::is_wordpress_supported()) {
                return [
                    'code' => 'unsupported_wordpress',
                    'ready' => false,
                    'message' => sprintf(
                        __(
                            'Maxi MCP requires WordPress %1$s or newer. This site is currently running %2$s.',
                            'maxi-mcp',
                        ),
                        self::MINIMUM_WORDPRESS_VERSION,
                        get_bloginfo('version'),
                    ),
                ];
            }

            if (!$this->is_runtime_available()) {
                return [
                    'code' => 'dependency_missing',
                    'ready' => false,
                    'message' => __(
                        'The official WordPress MCP Adapter could not be loaded from MaxiBlocks on this site.',
                        'maxi-mcp',
                    ),
                ];
            }

            if (!$this->is_enabled()) {
                return [
                    'code' => 'disabled',
                    'ready' => false,
                    'message' => __(
                        'Maxi MCP is installed but disabled. Open Settings and turn it on before connecting a client.',
                        'maxi-mcp',
                    ),
                ];
            }

            $server = rest_get_server();
            $routes = is_object($server) ? $server->get_routes() : [];

            if (!isset($routes['/mcp/mcp-adapter-default-server'])) {
                return [
                    'code' => 'route_missing',
                    'ready' => false,
                    'message' => __(
                        'Maxi MCP is enabled, but the default server route is not available yet. Reload the page and check for plugin conflicts if this continues.',
                        'maxi-mcp',
                    ),
                ];
            }

            return [
                'code' => 'ready',
                'ready' => true,
                'message' => __(
                    'Maxi MCP is live on this site. Claude Code and Codex can now inspect and edit posts or pages through the exposed WordPress abilities.',
                    'maxi-mcp',
                ),
            ];
        }

        private function require_capability($capability)
        {
            if (!is_user_logged_in()) {
                return new \WP_Error(
                    'authentication_required',
                    __(
                        'You must be logged in to use Maxi MCP abilities.',
                        'maxi-mcp',
                    ),
                );
            }

            if (!current_user_can($capability)) {
                return new \WP_Error(
                    'insufficient_capability',
                    sprintf(
                        __(
                            'The current user does not have the required capability: %s',
                            'maxi-mcp',
                        ),
                        $capability,
                    ),
                );
            }

            return true;
        }

        private function require_post_capability($input, $capability)
        {
            $post_id = absint($input['id'] ?? 0);

            if ($post_id < 1) {
                return new \WP_Error(
                    'missing_post_id',
                    __(
                        'A valid post ID is required.',
                        'maxi-mcp',
                    ),
                );
            }

            if (!is_user_logged_in()) {
                return new \WP_Error(
                    'authentication_required',
                    __(
                        'You must be logged in to use Maxi MCP abilities.',
                        'maxi-mcp',
                    ),
                );
            }

            if (!current_user_can($capability, $post_id)) {
                return new \WP_Error(
                    'insufficient_capability',
                    __(
                        'The current user does not have permission to edit that post or page.',
                        'maxi-mcp',
                    ),
                );
            }

            return true;
        }

        private function get_editable_post_or_error($input)
        {
            $post_id = absint($input['id'] ?? 0);
            $post = get_post($post_id);

            if (!$post instanceof \WP_Post) {
                return new \WP_Error(
                    'maxi_mcp_post_not_found',
                    __(
                        'The requested post or page could not be found.',
                        'maxi-mcp',
                    ),
                );
            }

            return $post;
        }

        private function sanitize_post_type($post_type)
        {
            return $post_type === 'post' ? 'post' : 'page';
        }

        private function sanitize_list_status($status)
        {
            $allowed = ['publish', 'draft', 'private', 'pending', 'any'];

            return in_array($status, $allowed, true) ? $status : 'any';
        }

        private function sanitize_edit_status($status)
        {
            $allowed = ['draft', 'publish', 'private', 'pending'];

            return in_array($status, $allowed, true) ? $status : 'draft';
        }

        private function get_post_type_capability($post_type)
        {
            return $post_type === 'post' ? 'edit_posts' : 'edit_pages';
        }

        private function format_post_summary($post)
        {
            return [
                'id' => (int) $post->ID,
                'post_type' => (string) $post->post_type,
                'status' => (string) $post->post_status,
                'slug' => (string) $post->post_name,
                'title' => (string) get_the_title($post),
                'link' => (string) get_permalink($post),
                'modified' => (string) get_post_modified_time(
                    DATE_ATOM,
                    true,
                    $post,
                ),
            ];
        }

        private function format_post_detail($post)
        {
            return [
                'id' => (int) $post->ID,
                'post_type' => (string) $post->post_type,
                'status' => (string) $post->post_status,
                'slug' => (string) $post->post_name,
                'title' => (string) get_the_title($post),
                'excerpt' => (string) $post->post_excerpt,
                'content' => (string) $post->post_content,
                'link' => (string) get_permalink($post),
                'modified' => (string) get_post_modified_time(
                    DATE_ATOM,
                    true,
                    $post,
                ),
            ];
        }

        private function is_enabled()
        {
            return (bool) get_option(self::OPTION_ENABLED, false);
        }

        private function is_runtime_available()
        {
            return class_exists('\WP\MCP\Core\McpAdapter');
        }

        private static function is_wordpress_supported()
        {
            global $wp_version;

            return version_compare(
                (string) $wp_version,
                self::MINIMUM_WORDPRESS_VERSION,
                '>=',
            );
        }

        private function get_endpoint_url()
        {
            return rest_url('mcp/mcp-adapter-default-server');
        }

        private function get_passwords_for_user()
        {
            if (!class_exists('WP_Application_Passwords')) {
                return [];
            }

            $passwords = WP_Application_Passwords::get_user_application_passwords(
                get_current_user_id(),
            );

            $passwords = array_values(
                array_filter($passwords, static function ($item) {
                    return isset($item['name']) &&
                        str_starts_with(
                            (string) $item['name'],
                            self::PASSWORD_PREFIX,
                        );
                }),
            );

            usort($passwords, static function ($first, $second) {
                return (int) ($second['created'] ?? 0) <=>
                    (int) ($first['created'] ?? 0);
            });

            return array_map(function ($item) {
                return [
                    'uuid' => (string) ($item['uuid'] ?? ''),
                    'name' => (string) ($item['name'] ?? ''),
                    'created' => $this->format_timestamp(
                        $item['created'] ?? 0,
                    ),
                    'lastUsed' => $this->format_timestamp(
                        $item['last_used'] ?? 0,
                        __('Never', 'maxi-mcp'),
                    ),
                ];
            }, $passwords);
        }

        private function build_password_name($label)
        {
            $label = is_string($label)
                ? sanitize_text_field(trim($label))
                : '';
            $base_name = self::PASSWORD_PREFIX;

            if ($label !== '') {
                $base_name .= ' - ' . $label;
            }

            if (!class_exists('WP_Application_Passwords')) {
                return $base_name;
            }

            $existing = WP_Application_Passwords::get_user_application_passwords(
                get_current_user_id(),
            );
            $names = array_map(
                static function ($item) {
                    return (string) ($item['name'] ?? '');
                },
                $existing,
            );

            if (!in_array($base_name, $names, true)) {
                return $base_name;
            }

            $counter = 2;
            $candidate = $base_name . ' ' . $counter;

            while (in_array($candidate, $names, true)) {
                $counter++;
                $candidate = $base_name . ' ' . $counter;
            }

            return $candidate;
        }

        private function build_claude_command($username, $password, $is_windows)
        {
            if ($password === '') {
                return __(
                    'Create a WordPress application password above to generate the Claude Code command.',
                    'maxi-mcp',
                );
            }

            $remote_command = $is_windows
                ? 'cmd /c npx -y @automattic/mcp-wordpress-remote@latest'
                : 'npx -y @automattic/mcp-wordpress-remote@latest';

            return sprintf(
                'claude mcp add %1$s --env WP_API_URL="%2$s" --env WP_API_USERNAME="%3$s" --env WP_API_PASSWORD="%4$s" -- %5$s',
                self::SERVER_NAME,
                $this->get_endpoint_url(),
                $username,
                $password,
                $remote_command,
            );
        }

        private function build_codex_config($username, $password)
        {
            if ($password === '') {
                return __(
                    'Create a WordPress application password above to generate the Codex config snippet.',
                    'maxi-mcp',
                );
            }

            $authorization_header = 'Basic ' .
                base64_encode($username . ':' . $password);

            return sprintf(
                "[mcp_servers.%1\$s]\nurl = \"%2\$s\"\nhttp_headers = { Authorization = \"%3\$s\" }",
                self::SERVER_NAME,
                $this->get_endpoint_url(),
                $authorization_header,
            );
        }

        private function build_first_prompt($client)
        {
            if ($client === 'codex') {
                return sprintf(
                    'Use the "%1$s" MCP server. First call maxi-mcp/get-guide, then list every tool whose name starts with "maxi-mcp/" and tell me in one short paragraph what you can change on this WordPress site.',
                    self::SERVER_NAME,
                );
            }

            return sprintf(
                'Use the "%1$s" MCP server. First call maxi-mcp/get-guide, then confirm you can reach this WordPress site and summarize the safe editing workflow.',
                self::SERVER_NAME,
            );
        }

        private function format_timestamp($timestamp, $fallback = '')
        {
            if (empty($timestamp)) {
                return $fallback;
            }

            $date_format = trim(
                get_option('date_format') . ' ' . get_option('time_format'),
            );

            return wp_date(
                $date_format !== '' ? $date_format : 'Y-m-d H:i',
                (int) $timestamp,
            );
        }

        private function set_flash($data)
        {
            set_transient(
                self::FLASH_TRANSIENT_PREFIX . get_current_user_id(),
                $data,
                10 * MINUTE_IN_SECONDS,
            );
        }

        private function pull_flash()
        {
            $key = self::FLASH_TRANSIENT_PREFIX . get_current_user_id();
            $flash = get_transient($key);

            if ($flash !== false) {
                delete_transient($key);
            }

            return is_array($flash) ? $flash : [];
        }

        private function redirect_to($page)
        {
            wp_safe_redirect(admin_url('admin.php?page=' . $page));
            exit();
        }

        private function assert_manage_options()
        {
            if (!current_user_can('manage_options')) {
                wp_die(
                    esc_html__(
                        'You do not have permission to manage Maxi MCP.',
                        'maxi-mcp',
                    ),
                );
            }
        }
    }
endif;
