<?php
/**
 * Plugin Name: Maxi Blocks wp-env loopback routing
 * Description: Routes server-side localhost requests through the Docker host gateway.
 */

/**
 * Make browser-facing wp-env URLs reachable from inside its containers.
 *
 * wp-env publishes WordPress on a host port such as 8888 or 8889, while Apache
 * listens on port 80 inside the container. Consequently, a server-side request
 * to localhost:8888 targets the container itself on a port where nothing is
 * listening. wp-env exposes the Docker host as host.docker.internal, so connect
 * there while preserving the original URL and Host header.
 *
 * @param resource|CurlHandle $handle cURL handle.
 * @param array               $args   HTTP request arguments.
 * @param string              $url    Requested URL.
 */
function maxi_blocks_wp_env_route_loopback_request( $handle, $args, $url ) {
	$host = wp_parse_url( $url, PHP_URL_HOST );
	$port = wp_parse_url( $url, PHP_URL_PORT );

	if ( 'localhost' !== $host || ! $port ) {
		return;
	}

	curl_setopt(
		$handle,
		CURLOPT_CONNECT_TO,
		array( "localhost:{$port}:host.docker.internal:{$port}" )
	);
}
add_action( 'http_api_curl', 'maxi_blocks_wp_env_route_loopback_request', 10, 3 );
