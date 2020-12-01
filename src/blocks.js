/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

// Extensions
import './extensions/dom';
import './extensions/store';
import './extensions/attributes';
import './extensions/save';
import './extensions/styles';
import './extensions/text';

// CSS
import './css';

// Blocks
import './blocks/row-maxi/row-maxi';
import './blocks/column-maxi/column-maxi';
import './blocks/text-maxi/text-maxi';
import './blocks/divider-maxi/divider-maxi';
import './blocks/image-maxi/image-maxi';
import './blocks/button-maxi/button-maxi';
import './blocks/cloud-maxi/cloud-maxi';
import './blocks/container-maxi/container-maxi';
import './blocks/font-icon-maxi/font-icon-maxi';
import './blocks/svg-icon-maxi/svg-icon-maxi';

// Sidebar
import './blocks/customizer-maxi/index';

// Editor
import './editor/saver';
import './editor/styler';
