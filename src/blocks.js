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

// CSS
import './css';

// Blocks
import './blocks/row-maxi/row-maxi';
import './blocks/column-maxi/column-maxi';
import './blocks/text-maxi/text-maxi';
import './blocks/divider-maxi/divider-maxi';
import './blocks/image-maxi/image-maxi';
import './blocks/button-maxi/button-maxi.js';
import './blocks/cloud-maxi/cloud-maxi.js';
import './blocks/container-maxi/container-maxi.js';
import './blocks/icon-maxi/icon-maxi.js';