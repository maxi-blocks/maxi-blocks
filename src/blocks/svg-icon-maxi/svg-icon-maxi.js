/**
 * BLOCK: maxi-blocks/image-maxi
 *
 * Registering an image block with Gutenberg.
 * Shows an image and a description. A test block.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { lazy, Suspense } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

/**
 * Block dependencies
 */
const Edit = lazy(() => import('./edit'));
import attributes from './attributes';
import save from './save';
import { customCss } from './data';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { iconBox } from '../../icons';

/**
 * Migrators
 */
import {
	blockMigrator,
	SVGTransitionMigrator,
} from '../../extensions/styles/migrators';

/**
 * Block
 */
registerBlockType('maxi-blocks/svg-icon-maxi', {
	title: __('Icon Maxi', 'maxi-blocks'),
	icon: iconBox,
	description: 'Add icon or shape and style it',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	getEditWrapperProps(attributes) {
		const { uniqueID } = attributes;

		return {
			uniqueid: uniqueID,
		};
	},
	edit: props => (
		<Suspense fallback={<Spinner />}>
			<Edit {...props} />
		</Suspense>
	),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
		migrators: [SVGTransitionMigrator],
	}),
});
