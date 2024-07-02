<?php

if (!defined('ABSPATH')) {
    exit();
}


class MaxiBlocks_Reusable_Blocks_Processor
{
    private static ?MaxiBlocks_Reusable_Blocks_Processor $instance = null;

    public static function register(): MaxiBlocks_Reusable_Blocks_Processor
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Reusable_Blocks_Processor();
        }

        return self::$instance;
    }

    /**
     * Fetches and parses reusable blocks from the provided blocks.
     */
    public function get_parsed_reusable_blocks_frontend(array $blocks): array
    {
        $reusable_block_ids = $this->get_reusable_blocks_ids($blocks);

        // Remove duplicates from the block IDs.
        $reusable_block_ids = array_unique($reusable_block_ids);
        $all_parsed_blocks = [];

        // Fetch and parse each reusable block by its ID.
        foreach ($reusable_block_ids as $block_id) {
            $block = get_post($block_id);
            if ($block) {
                $parsed_blocks = parse_blocks($block->post_content);
                $all_parsed_blocks = array_merge($all_parsed_blocks, $parsed_blocks);
            }
        }

        return $all_parsed_blocks;
    }

    private function get_reusable_blocks_ids(array $blocks): array
    {
        $reusable_block_ids = [];

        foreach ($blocks as $block) {
            if ($block['blockName'] === 'core/block' && !empty($block['attrs']['ref'])) {
                $reusable_block_ids[] = $block['attrs']['ref'];
            }

            if (!empty($block['innerBlocks'])) {
                $reusable_block_ids = array_merge($reusable_block_ids, $this->get_reusable_blocks_ids($block['innerBlocks']));
            }
        }

        return $reusable_block_ids;
    }
}
