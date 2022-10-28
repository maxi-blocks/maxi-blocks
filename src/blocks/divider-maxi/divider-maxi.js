/**
 * BLOCK: maxi-blocks/divider-maxi
 *
 * Registering an divider block with Gutenberg.
 * Shows an divider and a description. A test block.
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
import { dividerIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */
registerBlockType('maxi-blocks/divider-maxi', {
	title: __('Divider Maxi', 'maxi-blocks'),
	icon: dividerIcon,
	description: 'Create a divider between visual elements',
	category: 'maxi-blocks',
	apiVersion: 2,
	variations: [],

	attributes,

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
	}),
});
