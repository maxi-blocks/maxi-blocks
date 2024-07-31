<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/post-management/helpers/class-maxi-media.php';

class MaxiBlocks_Content_Processor
{
    private static ?self $instance = null;
    private static ?MaxiBlocks_Media_Processor $media_processor = null;

    private int $max_execution_time;

    public static function register(): void
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        self::$media_processor = MaxiBlocks_Media_Processor::get_instance();
    }

    public static function get_instance(): self
    {
        self::register();
        return self::$instance;
    }

    public function __construct()
    {
        $this->max_execution_time = ini_get('max_execution_time');
    }

    /**
     * Get the updated post content with media added and unique IDs updated if new blocks are present.
     */
    public function get_updated_post_content(string $post_content, bool $new_blocks = false): string
    {
        $updated_post_content = self::$media_processor->add_media($post_content);

        if($new_blocks) {
            // Get all blocks from post content
            $blocks = parse_blocks($updated_post_content);
            $blocks = array_filter($blocks, function ($block) {
                return isset($block['blockName']);
            });

            if (empty($blocks)) {
                return '';
            }

            $this->update_unique_ids($blocks, function ($block) use ($new_blocks) {
                return $new_blocks || (isset($block['attrs']['uniqueID']) && substr($block['attrs']['uniqueID'], -2) != '-u');
            });

            $updated_post_content = serialize_blocks($blocks);
        }

        return $updated_post_content;
    }

    /**
     * Recursively updates the unique IDs of blocks and their inner blocks.
     *
     * This function iterates through each block, generating a new unique ID based on the block name,
     * and replaces the old unique ID in the block's attributes, innerHTML, and innerContent.
     * It also recursively updates any inner blocks.
     *
     * @param array $blocks Reference to the array of blocks to be updated.
     * @param callable $should_update_unique_id Callback function to determine if the block's unique ID should be updated.
     * @return void
    */
    public function update_unique_ids(
        array &$blocks,
        callable $should_update_unique_id = null,
        array &$id_mapping = [],
        array &$blocks_with_relations = [],
        int $recursion_level = 0
    ): void {
        $is_highest_level = $recursion_level === 0;
        $block_chunks = array_chunk($blocks, 3, true);

        foreach ($block_chunks as $chunk_index => $block_chunk) {
            foreach ($block_chunk as $block_index => $_) {
                $block = &$blocks[$block_index];

                $previous_unique_id = isset($block['attrs']['uniqueID']) ? $block['attrs']['uniqueID'] : null;
                if (!$previous_unique_id) {
                    continue;
                }

                $block_name = $block['blockName'];
                if (strpos($block_name, 'maxi-blocks') === false) {
                    continue;
                }

                if($should_update_unique_id == null || $should_update_unique_id($block)) {
                    $new_unique_id = self::unique_id_generator($block_name);
                    $id_mapping[$previous_unique_id] = $new_unique_id;

                    $block['attrs']['uniqueID'] = $new_unique_id;

                    if (isset($block['attrs']['background-layers'])) {
                        foreach ($block['attrs']['background-layers'] as $key => &$value) {
                            if (isset($value['background-svg-SVGData'])) {
                                $svg_data = &$value['background-svg-SVGData'];
                                foreach ($svg_data as $svg_data_key => $svg_data_value) {
                                    if (strpos($svg_data_key, $previous_unique_id) !== false) {
                                        $svg_data[$new_unique_id] = $svg_data_value;
                                        unset($svg_data[$svg_data_key]);
                                    }
                                }
                                unset($svg_data);
                            }

                            if (isset($value['background-svg-SVGElement'])) {
                                $value['background-svg-SVGElement'] = str_replace($previous_unique_id, $new_unique_id, $value['background-svg-SVGElement']);
                            }
                            unset($value);
                        }
                    }

                    $block['innerHTML'] = str_replace($previous_unique_id, $block['attrs']['uniqueID'], $block['innerHTML']);
                    $block['innerContent'] = array_map(function ($content) use ($previous_unique_id, $block) {
                        return is_string($content) ? str_replace($previous_unique_id, $block['attrs']['uniqueID'], $content) : $content;
                    }, $block['innerContent']);
                }

                if (isset($block['attrs']['relations']) && is_array($block['attrs']['relations'])) {
                    $blocks_with_relations[] = &$block;
                }

                if (!empty($block['innerBlocks'])) {
                    $this->update_unique_ids($block['innerBlocks'], $should_update_unique_id, $id_mapping, $blocks_with_relations, $recursion_level + 1);
                }
            }

            // Reset PHP maximum execution time for each chunk to avoid a timeout
            if ($this->max_execution_time != 0) {
                set_time_limit($this->max_execution_time - 2);
            }
        }

        if ($is_highest_level) {
            $this->update_attribute_relations($blocks_with_relations, $id_mapping);
        }
    }

    /**
     * Updates the unique IDs in the attribute relations of the given blocks.
     *
     * @param array &$blocks_with_relations Array of references to blocks that contain attribute relations.
     * @param array &$id_mapping Mapping of old unique IDs to new unique IDs.
     */
    private function update_attribute_relations(array &$blocks_with_relations, array &$id_mapping): void
    {
        foreach ($blocks_with_relations as &$block) {
            if (is_array($block['attrs']['relations'])) {
                foreach ($block['attrs']['relations'] as &$relation) {
                    if (isset($relation['uniqueID']) && isset($id_mapping[$relation['uniqueID']])) {
                        $relation['uniqueID'] = $id_mapping[$relation['uniqueID']];
                    }
                }
            }
        }
    }

    public static function get_maxiblocks_unique_ids(array $blocks, array &$block_unique_ids = []): array
    {
        foreach ($blocks as $block) {
            $block_name = $block['blockName'] ?? '';
            if (strpos($block_name, 'maxi-blocks') !== false && isset($block['attrs']['uniqueID'])) {
                $block_unique_ids[] = $block['attrs']['uniqueID'];
            }

            if (isset($block['innerBlocks']) && !empty($block['innerBlocks'])) {
                self::get_maxiblocks_unique_ids($block['innerBlocks'], $block_unique_ids);
            }
        }

        return $block_unique_ids;
    }

    /**
     * Transforms all string attributes in the content to JSON format
     * to get correct array of blocks from `parse_blocks` function later on.
     */
    public function prepare_content($content)
    {
        $block_pattern = '/<!-- wp:maxi-blocks\/\$?[a-zA-Z-]+ (.*?) -->/';

        return preg_replace_callback($block_pattern, function ($matches) {
            $block_content = $matches[1];

            // e.g. "background-svg-SVGElement":"\u003csvg fill=\u0022#ff4a17\u0022...
            $attribute_pattern = '/"([^"]+)":\s*"([^"]+)"/';

            // e.g. "custom-formats":{"maxi-text-block__custom-format\u002d\u002d0"...
            $key_pattern = '/"([^"]+)"\s*:/';

            // Process attribute values
            $block_content = preg_replace_callback($attribute_pattern, function ($attr_matches) {
                $encoded_value = addslashes($attr_matches[2]);
                return '"' . $attr_matches[1] . '":"' . $encoded_value . '"';
            }, $block_content);

            // Process keys
            $block_content = preg_replace_callback($key_pattern, function ($key_matches) {
                $encoded_key = addslashes($key_matches[1]);
                return '"' . $encoded_key . '":';
            }, $block_content);

            return '<!-- wp:maxi-blocks/' . substr($matches[0], 20, strpos($matches[0], ' ', 20) - 20) . ' ' . $block_content . ' -->';
        }, $content);
    }

    public static function unique_id_generator(string $block_name): string
    {
        $name = str_replace('maxi-blocks/', '', $block_name);
        $uniquePart = self::generate_random_string().substr(uniqid('', true), 0, 5);
        return "{$name}-{$uniquePart}-u";
    }

    public static function generate_random_string()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < 3; $i++) {
            $index = wp_rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }
}
