/**
 * BLOCK: maxi-blocks/group-maxi
 *
 * Create a number counter
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
import { numberCounterIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/number-counter-maxi', {
	title: __('Number Counter Maxi', 'maxi-blocks'),
	icon: numberCounterIcon,
	description: __('Create a number counter', 'maxi-blocks'),
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
