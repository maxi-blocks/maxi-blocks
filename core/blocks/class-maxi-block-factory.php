<?php

// Exit if accessed directly
if (! defined('ABSPATH')) {
    exit;
}

const MAXI_BLOCK_FACTORY_BLOCK_CLASSES = [
    'maxi-blocks/group-maxi' => 'MaxiBlocks_Group_Maxi_Block',
    'maxi-blocks/container-maxi' => 'MaxiBlocks_Container_Maxi_Block',
    'maxi-blocks/row-maxi' => 'MaxiBlocks_Row_Maxi_Block',
    'maxi-blocks/column-maxi' => 'MaxiBlocks_Column_Maxi_Block',
    'maxi-blocks/accordion-maxi' => 'MaxiBlocks_Accordion_Maxi_Block',
    'maxi-blocks/pane-maxi' => 'MaxiBlocks_Pane_Maxi_Block',
    'maxi-blocks/button-maxi' => 'MaxiBlocks_Button_Maxi_Block',
    'maxi-blocks/divider-maxi' => 'MaxiBlocks_Divider_Maxi_Block',
    'maxi-blocks/image-maxi' => 'MaxiBlocks_Image_Maxi_Block',
    'maxi-blocks/svg-icon-maxi' => 'MaxiBlocks_SVG_Icon_Maxi_Block',
    'maxi-blocks/text-maxi' => 'MaxiBlocks_Text_Maxi_Block',
    'maxi-blocks/list-item-maxi' => 'MaxiBlocks_List_Item_Maxi_Block',
    'maxi-blocks/video-maxi' => 'MaxiBlocks_Video_Maxi_Block',
    'maxi-blocks/number-counter-maxi' => 'MaxiBlocks_Number_Counter_Maxi_Block',
    'maxi-blocks/search-maxi' => 'MaxiBlocks_Search_Maxi_Block',
    'maxi-blocks/map-maxi' => 'MaxiBlocks_Map_Maxi_Block',
    'maxi-blocks/slider-maxi' => 'MaxiBlocks_Slider_Maxi_Block',
    'maxi-blocks/slide-maxi' => 'MaxiBlocks_Slide_Maxi_Block',
];

class MaxiBlocks_BlockFactory
{
    private static ?MaxiBlocks_BlockFactory $instance = null;

    public static function register(): void
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
    }

    public static function get_instance(): MaxiBlocks_BlockFactory
    {
        self::register();
        return self::$instance;
    }

    /**
     * Creates all blocks.
     */
    public function create_all_blocks(): void
    {
        foreach (MAXI_BLOCK_FACTORY_BLOCK_CLASSES as $block_name => $class_name) {
            $this->create_block($block_name);
        }
    }

    /**
     * Creates and returns an instance of the specified block class.
     *
     * @param string $block_name The name of the block to create.
     * @return object|null An instance of the block class, or null if the block is not found.
     */
    public function create_block(string $block_name): ?object
    {
        if(!isset(MAXI_BLOCK_FACTORY_BLOCK_CLASSES[$block_name])) {
            return null;
        }

        $class_name = MAXI_BLOCK_FACTORY_BLOCK_CLASSES[$block_name];
        $file_name = $this->get_file_name($block_name);

        if(!$this->load_class_file($file_name) || !class_exists($class_name)) {
            return null;
        }

        $class_name::register();
        return $class_name::get_instance();
    }

    /**
     * Loads the class file for the block.
     *
     * @param string $file_name The name of the file to load.
     * @return bool True if the file is loaded successfully, false otherwise.
     */
    private function load_class_file(string $file_name): bool
    {
        $file_path = MAXI_PLUGIN_DIR_PATH . 'core/blocks/' . $file_name . '.php';
        if (file_exists($file_path)) {
            require_once $file_path;
            return true;
        }
        return false;
    }

    /**
     * Get the file name from the block name.
     *
     * @param string $block_name The name of the block.
     * @return string The name of the file.
     */
    private function get_file_name(string $block_name): string
    {
        return str_replace('maxi-blocks/', 'class-', $block_name) . '-block';
    }
}
