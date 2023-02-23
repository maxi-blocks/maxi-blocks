/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const getIsSiteEditor = () => !!select('core/edit-site');

export default getIsSiteEditor;
