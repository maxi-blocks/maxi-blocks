/**
 * BLOCK: maxi-blocks/map-maxi
 *
 * Create a map with marker and description
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
import { mapIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/map-maxi', {
	title: __('Map Maxi', 'maxi-blocks'),
	icon: mapIcon,
	description: __('Create a map with marker and description', 'maxi-blocks'),
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
