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


registerBlockType( 'maxi-blocks/block-title-extra', {
	title: __('Title Extra', 'maxi-blocks'),
	icon: titleExtra,
	category: 'maxi-blocks-blocks',
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
