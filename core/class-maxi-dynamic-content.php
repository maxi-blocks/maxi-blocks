<?php

/**
 * Server side part of MaxiBlocks_DynamicContent Gutenberg component
 *
 * Generates dynamic content on frontend
 */
class MaxiBlocks_DynamicContent {
	/**
	 * This plugin's instance.
	 *
	 * @var MaxiBlocks_DynamicContent
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if (null === self::$instance) {
			self::$instance = new MaxiBlocks_DynamicContent();
		}
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		// Dynamic blocks
		register_block_type('maxi-blocks/text-maxi', [
			'api_version' => 2,
			'editor_script' => 'maxi-blocks-block-editor',
			'render_callback' => [$this, 'render_dc'],
		]);
		register_block_type('maxi-blocks/button-maxi', [
			'api_version' => 2,
			'editor_script' => 'maxi-blocks-block-editor',
			'render_callback' => [$this, 'render_dc'],
		]);
		register_block_type('maxi-blocks/image-maxi', [
			'api_version' => 2,
			'editor_script' => 'maxi-blocks-block-editor',
			'render_callback' => [$this, 'render_dc'],
		]);
	}

	public function render_dc($attributes, $content) {
		if (!array_key_exists('dc.s', $attributes)) {
			return $content;
		}
		if (!$attributes['dc.s']) {
			return $content;
		}

		if (array_key_exists('dc_l.s', $attributes)) {
			$dc_link_status = $attributes['dc_l.s'];

			if ($dc_link_status) {
				$content = self::render_dc_link($attributes, $content);
			}
		}

		$block_name = substr(
			$attributes['_uid'],
			0,
			strrpos($attributes['_uid'], '-'),
		);

		if ($block_name !== 'image-maxi') {
			$content = self::render_dc_content($attributes, $content);
		} else {
			$content = self::render_dc_image($attributes, $content);
		}

		return $content;
	}

	public function render_dc_link($attributes, $content) {
		if (
			array_key_exists('dc_ty', $attributes) &&
			$attributes['dc_ty'] === 'settings'
		) {
			$link = get_home_url();
		} elseif (
			array_key_exists('dc_ty', $attributes) &&
			in_array($attributes['dc_ty'], ['categories', 'tags'])
		) {
			$link = get_term_link($attributes['dc_id']);
		} elseif (
			array_key_exists('dc_ty', $attributes) &&
			$attributes['dc_ty'] === 'users'
		) {
			$link = get_author_posts_url($attributes['dc_id']);
		} else {
			$post = self::get_post($attributes);

			if (empty($post)) {
				return $content;
			}

			$link = get_permalink($post->ID);
		}

		$content = str_replace('$link-to-replace', $link, $content);

		return $content;
	}

	public function render_dc_content($attributes, $content) {
		@[
			'dc_ty' => $dc_type,
			'dc_rel' => $dc_relation,
			'dc_f' => $dc_field,
		] = $attributes;

		if (empty($dc_type)) {
			$dc_type = 'posts';
		}
		if (empty($dc_relation)) {
			$dc_relation = 'id';
		}

		$response = '';

		if (in_array($dc_type, ['posts', 'pages'])) {
			// Post or page
			$response = self::get_post_or_page_content($attributes);
		} elseif ($dc_type === 'settings') {
			// Site settings
			$response = self::get_site_content($dc_field);
		} elseif ($dc_type === 'media') {
			$response = self::get_media_content($attributes);
		} elseif (in_array($dc_type, ['categories', 'tags'])) {
			// Categories or tags
			$response = self::get_taxonomy_content($attributes);
		} elseif ($dc_type === 'users') {
			// Users
			$response = self::get_user_content($attributes);
		}

		if ($dc_field === 'date') {
			$response = self::get_date($response, $attributes);
		}

		if (empty($response)) {
			$response = 'No content found';
		}

		$content = str_replace('$text-to-replace', $response, $content);

		return $content;
	}

	public function render_dc_image($attributes, $content) {
		@[
			'dc_ty' => $dc_type,
			'dc_rel' => $dc_relation,
			'dc_f' => $dc_field,
			'dc_id' => $dc_id,
		] = $attributes;

		if (empty($dc_type)) {
			$dc_type = 'posts';
		}
		if (empty($dc_relation)) {
			$dc_relation = 'id';
		}

		$media_id;
		$media_src;
		$media_alt = '';
		$media_caption = '';

		// Get media ID
		if (in_array($dc_type, ['posts', 'pages'])) {
			// Post or page
			$post = $this->get_post($attributes);
			// $dc_field is not used here as there's just on option for the moment
			$media_id = get_post_meta($post->ID, '_thumbnail_id', true);
		} elseif ($dc_type === 'settings') {
			// Site settings
			// $dc_field is not used here as there's just on option for the moment
			$media_id = get_theme_mod('custom_logo');
		} elseif ($dc_type === 'media') {
			$media_id = $dc_id;
		}

		if (!empty($media_id) && is_numeric($media_id)) {
			$media_src = wp_get_attachment_image_src($media_id, 'full')[0];

			$media_alt = get_post_meta(
				$media_id,
				'_wp_attachment_image_alt',
				true,
			);

			if (empty($media_alt)) {
				$media_alt = 'No content found';
			}

			$media_caption = get_post($media_id)->post_excerpt;

			if (empty($media_caption)) {
				$media_caption = 'No content found';
			}
		}

		if (!empty($media_src)) {
			$content = str_replace('$media-id-to-replace', $media_id, $content);
			$content = str_replace(
				'$media-url-to-replace',
				$media_src,
				$content,
			);
			$content = str_replace(
				'$media-alt-to-replace',
				$media_alt,
				$content,
			);
			$content = str_replace(
				'$media-caption-to-replace',
				$media_caption,
				$content,
			);
		} else {
			$content = str_replace('$media-id-to-replace', '', $content);
			$content = str_replace('$media-url-to-replace', '', $content);
			$content = str_replace('$media-alt-to-replace', '', $content);
			$content = str_replace('$media-caption-to-replace', '', $content);
		}

		return $content;
	}

	public function get_post($attributes) {
		@[
			'dc_ty' => $dc_type,
			'dc_rel' => $dc_relation,
			'dc_id' => $dc_id,
			'dc_au' => $dc_author,
		] = $attributes;

		if (empty($dc_type)) {
			$dc_type = 'posts';
		}
		if (empty($dc_relation)) {
			$dc_relation = 'id';
		}

		if (in_array($dc_type, ['posts', 'pages'])) {
			// Basic args
			$args = [
				'post_type' => $dc_type === 'posts' ? 'post' : 'page',
				'post_status' => 'publish',
				'posts_per_page' => 1,
			];

			// DC Relation
			if ($dc_relation == 'id') {
				$args['p'] = $dc_id;
			} elseif ($dc_relation == 'author') {
				$args['author'] = $dc_author ?? $dc_id;
			} elseif ($dc_relation == 'random') {
				$args['orderby'] = 'rand';
			}

			$query = new WP_Query($args);

			return $query->post;
		} elseif ($dc_type === 'media') {
			$args = [
				'post_type' => 'attachment',
				'posts_per_page' => 1,
			];

			// DC Relation
			$is_random = $dc_relation === 'random';
			if ($dc_relation == 'id') {
				$args['p'] = $dc_id;
			} elseif ($is_random) {
				$args = [
					'post_type' => 'attachment',
					'post_status' => 'inherit',
					'posts_per_page' => -1,
				];
			}

			$query = new WP_Query($args);

			$post;

			if ($is_random) {
				$posts = $query->posts;
				$post = $posts[array_rand($posts)];
			} else {
				$post = $query->post;
			}

			return $post;
		} elseif (in_array($dc_type, ['categories', 'tags'])) {
			if ($dc_type === 'categories') {
				$taxonomy = 'category';
			} elseif ($dc_type === 'tags') {
				$taxonomy = 'post_tag';
			}

			$args = [
				'taxonomy' => $taxonomy,
				'hide_empty' => false,
				'number' => 1,
			];

			if ($dc_relation == 'random') {
				$args['orderby'] = 'rand';
			} else {
				$args['include'] = $dc_id;
			}

			$terms = get_terms($args);

			return $terms[0];
		} elseif ($dc_type === 'users') {
			$args = [
				// 'role' => 'author',
				// 'number' => 1,
			];

			if ($dc_relation == 'random') {
				$args['orderby'] = 'rand';
			} else {
				$args['include'] = $dc_id;
			}

			$users = get_users($args);

			return $users[0];
		} elseif ($dc_type === 'settings') {
			return null;
		}
	}

	public function get_post_or_page_content($attributes) {
		@[
			'dc_f' => $dc_field,
			'dc_lim' => $dc_limit,
		] = $attributes;

		$post = $this->get_post($attributes);

		$post_data = $post->{"post_$dc_field"};

		if (empty($post_data) && $dc_field === 'excerpt') {
			$post_data = $post->post_content;
		}
		// In case is content, remove blocks and strip tags
		if (in_array($dc_field, ['content', 'excerpt'])) {
			// Remove all HTML tags and replace with a line break
			$post_data = excerpt_remove_blocks($post_data);
			$post_data = wp_strip_all_tags($post_data);

			// Ensures no double or more line breaks
			$post_data = preg_replace("/[\r\n]+/", "\n", $post_data);
			$post_data = preg_replace("/\n{2,}/", "\n", $post_data);
			$post_data = nl2br($post_data);

			// In case is not set, put the default limit
			if (!isset($dc_limit)) {
				$dc_limit = 100;
			}

			// Limit content
			$post_data = self::get_limited_string($post_data, $dc_limit);
		}

		// In case is author, get author name
		if ($dc_field === 'author') {
			$post_data = get_the_author_meta(
				'display_name',
				$post->post_author,
			);
		}

		return $post_data;
	}

	public function get_site_content($dc_field) {
		$dictionary = [
			'title' => 'name',
			'tagline' => 'description',
			'url' => 'url',
			'email' => 'admin_email',
			'language' => 'language',
		];

		$site_data = get_bloginfo($dictionary[$dc_field]);

		return $site_data;
	}

	public function get_media_content($attributes) {
		@[
			'dc_f' => $dc_field,
		] = $attributes;

		$post = $this->get_post($attributes);
		$media_data = $post->{"post_$dc_field"};

		if ($dc_field === 'author') {
			$media_data = get_the_author_meta(
				'display_name',
				$post->post_author,
			);
		}

		return $media_data;
	}

	public function get_user_content($attributes) {
		@[
			'dc_f' => $dc_field,
		] = $attributes;

		$user = $this->get_post($attributes);

		$user_dictionary = [
			'name' => 'display_name',
			'email' => 'user_email',
			'url' => 'user_url',
			'description' => 'description',
		];

		$user_data = $user->data->{$user_dictionary[$dc_field]};

		return $user_data;
	}

	public function get_taxonomy_content($attributes) {
		@[
			'dc_f' => $dc_field,
			'dc_lim' => $dc_limit,
		] = $attributes;

		$term = $this->get_post($attributes);
		if ($dc_field === 'link') {
			$tax_data = get_term_link($term);
		} else {
			$tax_data = $term->{"$dc_field"};
		}

		if ($dc_field === 'parent') {
			if ($tax_data === 0) {
				$tax_data = 'No parent';
			} else {
				$tax_data = get_term($tax_data)->name;
			}
		}

		if ($dc_field === 'description') {
			$tax_data = self::get_limited_string($tax_data, $dc_limit);
		}

		return $tax_data;
	}

	public function get_date($date, $attributes) {
		@[
			'dc_fo' => $dc_format,
			'dc_cfo' => $dc_custom_format,
			'dc_cd' => $dc_custom_date,
			'dc_y' => $dc_year,
			'dc_mo' => $dc_month,
			'dc_da' => $dc_day,
			'dc_hou' => $dc_hour,
			'dc_h12' => $dc_hour12,
			'dc_min' => $dc_minute,
			'dc_sec' => $dc_second,
			'dc_wd' => $dc_weekday,
			'dc_era' => $dc_era,
			'dc_loc' => $dc_locale,
			'dc_tz' => $dc_timezone,
			'dc_tzn' => $dc_timezone_name,
		] = $attributes;

		if (!isset($dc_custom_date)) {
			$dc_custom_date = false;
		}
		if (!isset($dc_timezone)) {
			$dc_timezone = 'none';
		}
		if (!isset($dc_format)) {
			$dc_format = 'd.m.Y t';
		}

		$options = [
			'day' => $dc_day === 'none' ? null : $dc_day,
			'era' => $dc_era === 'none' ? null : $dc_era,
			'hour' => $dc_hour === 'none' ? null : $dc_hour,
			'hour12' =>
				$dc_hour12 === 'false'
					? false
					: ($dc_hour12 === 'true'
						? true
						: $dc_hour12),
			'minute' => $dc_minute === 'none' ? null : $dc_minute,
			'month' => $dc_month === 'none' ? null : $dc_month,
			'second' => $dc_second === 'none' ? null : $dc_second,
			'timezone' => $dc_timezone === 'none' ? 'UTC' : $dc_timezone,
			'timezone_name' =>
				$dc_timezone_name === 'none' ? null : $dc_timezone_name,
			'weekday' => $dc_weekday === 'none' ? null : $dc_weekday,
			'year' => $dc_year === 'none' ? null : $dc_year,
		];

		$new_date = new DateTime($date, new DateTimeZone($options['timezone']));

		$content = '';
		$new_format = $dc_custom_date ? $dc_custom_format : $dc_format;

		if ($dc_custom_date) {
			$new_format = self::convert_moment_to_php_date_format(
				$dc_custom_format,
			);
		}

		$new_format = str_replace(
			['DV', 'DS', 'MS'],
			['x', 'z', 'c'],
			$new_format,
		);

		$map = [
			'z' => 'D',
			'x' => 'd',
			'c' => 'M',
			'd' => 'j',
			'D' => 'l',
			'm' => 'm',
			'M' => 'F',
			'y' => 'y',
			'Y' => 'Y',
			't' => 'H:i:s',
		];

		$new_format = preg_replace_callback(
			'/[xzcdDmMyYt]/',
			function ($match) use ($map) {
				return $map[$match[0]];
			},
			$new_format,
		);

		$content = $new_date->format($new_format);

		return $content;
	}

	public function convert_moment_to_php_date_format($format) {
		$replacements = [
			'DD' => 'd',
			'ddd' => 'D',
			'D' => 'j',
			'dddd' => 'l',
			'E' => 'N',
			'o' => 'S',
			'e' => 'w',
			'DDD' => 'z',
			'W' => 'W',
			'MMMM' => 'F',
			'MM' => 'm',
			'MMM' => 'M',
			'M' => 'n',
			'YYYY' => 'o',
			'YY' => 'y',
			'a' => 'a',
			'A' => 'A',
			'h' => 'g',
			'H' => 'G',
			'hh' => 'h',
			'HH' => 'H',
			'mm' => 'i',
			'ss' => 's',
			'SSS' => 'u',
			'zz' => 'e',
			'X' => 'U',
		];

		return strtr($format, $replacements);
	}

	public function get_limited_string($string, $limit) {
		if ($limit > 0 && strlen($string) > $limit) {
			$string = trim($string);
			$string = substr($string, 0, $limit) . '…';
		}

		return $string;
	}
}
