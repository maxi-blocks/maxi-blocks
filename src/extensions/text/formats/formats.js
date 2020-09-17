import color from './color';
import link from './link';
import size from './size';
import underline from './underline';
import custom from './custom';

export default [color, link, size, underline, custom];

export { default as defaultFontColorObject } from './color/default';
export { default as defaultFontUnderlineObject } from './underline/default';
export { default as defaultFontSizeObject } from './size/default';
