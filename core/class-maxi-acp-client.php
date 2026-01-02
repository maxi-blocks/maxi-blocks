<?php
/**
 * MaxiBlocks ACP Client
 *
 * @since   1.0.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_ACP_Client')):
    class MaxiBlocks_ACP_Client
    {
        /**
         * Perform a request to an ACP agent endpoint.
         *
         * @param string     $url     ACP endpoint URL.
         * @param array|null $payload Payload to send.
         * @param array      $headers Request headers.
         * @param string     $method  HTTP method.
         * @param int|null   $timeout Optional timeout in seconds.
         *
         * @return array|WP_Error
         */
        public static function request($url, $payload, $headers, $method, $timeout)
        {
            $request_headers = [
                'Accept' => 'application/json',
            ];

            if (!empty($headers)) {
                $request_headers = array_merge($request_headers, $headers);
            }

            $args = [
                'method' => $method,
                'headers' => $request_headers,
            ];

            if (!empty($payload)) {
                $args['body'] = wp_json_encode($payload);
                $args['headers']['Content-Type'] = 'application/json';
            }

            if (!empty($timeout)) {
                $args['timeout'] = $timeout;
            }

            $response = wp_remote_request($url, $args);

            if (is_wp_error($response)) {
                return $response;
            }

            $status = wp_remote_retrieve_response_code($response);
            $body = wp_remote_retrieve_body($response);

            return [
                'status' => $status,
                'headers' => wp_remote_retrieve_headers($response),
                'body' => $body,
            ];
        }
    }
endif;
