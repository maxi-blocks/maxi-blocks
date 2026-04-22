<?php
/**
 * MaxiBlocks MCP bootstrap.
 *
 * @since   2.1.9
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_MCP')):
    class MaxiBlocks_MCP
    {
        /**
         * Plugin MCP instance.
         *
         * @var MaxiBlocks_MCP|null
         */
        private static $instance = null;

        private const MINIMUM_WORDPRESS_VERSION = '6.9';
        private const DEFAULT_SERVER_ROUTE = '/mcp/mcp-adapter-default-server';
        private const DEFAULT_SERVER_NAME = 'Maxi';

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_MCP();
            }
        }

        /**
         * Constructor.
         */
        public function __construct()
        {
            add_action('plugins_loaded', [$this, 'bootstrap'], 20);
        }

        /**
         * Boot the bundled MCP server when the dependency is available.
         */
        public function bootstrap()
        {
            if (
                !self::is_builtin_enabled() ||
                !self::is_wordpress_supported() ||
                !self::is_adapter_available()
            ) {
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

        /**
         * Get the default MCP endpoint route.
         *
         * @return string
         */
        public static function get_endpoint_route()
        {
            return self::DEFAULT_SERVER_ROUTE;
        }

        /**
         * Get the default MCP endpoint URL.
         *
         * @return string
         */
        public static function get_endpoint_url()
        {
            return rest_url(ltrim(self::DEFAULT_SERVER_ROUTE, '/'));
        }

        /**
         * Get the current MCP server status for the dashboard.
         *
         * @return array
         */
        public static function get_status()
        {
            if (!self::is_builtin_enabled()) {
                return [
                    'code' => 'disabled_by_companion',
                    'ready' => false,
                    'message' => __(
                        'Maxi built-in MCP is disabled because the Maxi MCP companion plugin is active on this site.',
                        'maxi-blocks',
                    ),
                ];
            }

            if (!self::is_wordpress_supported()) {
                return [
                    'code' => 'unsupported_wordpress',
                    'ready' => false,
                    'message' => sprintf(
                        /* translators: %1$s: required WordPress version, %2$s: current WordPress version */
                        __(
                            'Maxi advanced agent setup requires WordPress %1$s or newer. This site is currently running WordPress %2$s.',
                            'maxi-blocks',
                        ),
                        self::MINIMUM_WORDPRESS_VERSION,
                        get_bloginfo('version'),
                    ),
                ];
            }

            if (!self::is_adapter_available()) {
                return [
                    'code' => 'dependency_missing',
                    'ready' => false,
                    'message' => __(
                        'Maxi can expose a built-in MCP server, but the bundled Composer dependency is not installed in this build yet. Run Composer during development or use a packaged build that includes the vendor directory.',
                        'maxi-blocks',
                    ),
                ];
            }

            $server = rest_get_server();
            $routes = is_object($server) ? $server->get_routes() : [];

            if (!isset($routes[self::DEFAULT_SERVER_ROUTE])) {
                return [
                    'code' => 'route_missing',
                    'ready' => false,
                    'message' => __(
                        'Maxi loaded its MCP classes, but the default server route is still unavailable. Reload the page and check for another plugin or theme conflict if this continues.',
                        'maxi-blocks',
                    ),
                ];
            }

            return [
                'code' => 'ready',
                'ready' => true,
                'message' => __(
                    'Maxi built-in MCP server is ready for Claude Code, Codex, and other remote MCP clients.',
                    'maxi-blocks',
                ),
            ];
        }

        /**
         * Brand the bundled default MCP server.
         *
         * @param mixed $config Server config.
         *
         * @return mixed
         */
        public function filter_default_server_config($config)
        {
            if (!is_array($config)) {
                return $config;
            }

            $config['server_name'] = self::DEFAULT_SERVER_NAME;

            return $config;
        }

        /**
         * Ensure empty MCP schema properties are encoded as objects.
         *
         * @param mixed $response REST response payload.
         *
         * @return mixed
         */
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

        /**
         * Check whether the current WordPress version supports the bundled MCP server.
         *
         * @return bool
         */
        private static function is_wordpress_supported()
        {
            global $wp_version;

            return version_compare(
                (string) $wp_version,
                self::MINIMUM_WORDPRESS_VERSION,
                '>=',
            );
        }

        /**
         * Check whether the bundled MCP adapter dependency is loaded.
         *
         * @return bool
         */
        private static function is_adapter_available()
        {
            return class_exists('\WP\MCP\Core\McpAdapter');
        }

        private static function is_builtin_enabled()
        {
            return (bool) apply_filters('maxi_blocks_enable_builtin_mcp', true);
        }
    }
endif;
