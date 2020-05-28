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
import './extensions/store';
import './extensions/attributes';
import './extensions/save';
import './extensions/dom';
// import './extensions/blocks';

// CSS
import './css';

// Blocks
import './blocks/row-maxi/row-maxi';
import './blocks/column-maxi/column-maxi';
import './blocks/text-maxi/text-maxi';
import './blocks/divider-maxi/divider-maxi';
import './blocks/image-maxi/image-maxi';
import './blocks/section-maxi/section-maxi';
import './blocks/button-maxi/button-maxi.js';
import './blocks/cloud-maxi/cloud-maxi.js';

// Deprecated
// import './blocks/block-layout/block-layout.js';

// Deprecated
//import './blocks/block-layout/block-layout.js';
// import './blocks/block-container/block-container.js';
// import './blocks/block-image-box/block-image-box.js';
// import './blocks/block-title-extra/block-title-extra.js';
// import './blocks/block-testimonial/block-single-testimonial';
// import './blocks/block-button/block.js';