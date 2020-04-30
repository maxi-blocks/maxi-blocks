/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { titleExtra } from '../../icons';

/**
 * Block dependencies
 */

import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Block
 */


registerBlockType( 'gutenberg-extra/block-title-extra', {
	title: __('Title Extra', 'gutenberg-extra'),
	icon: titleExtra,
	category: 'gutenberg-extra-blocks',
	supports: {
        align: true,
    },
	attributes: {
		...attributes,
	},
	getEditWrapperProps(attributes) {
        const {
			uniqueID
        } = attributes;

        return {
			'uniqueid': uniqueID
        };
    },
	edit,
	save
} );
