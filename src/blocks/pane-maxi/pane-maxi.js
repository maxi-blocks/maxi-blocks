/**
 * BLOCK: maxi-blocks/pane-maxi
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
import { groupIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/pane-maxi', {
	title: __('Pane Maxi', 'maxi-blocks'),
	description: __('Hide some content inside of it', 'maxi-blocks'),
	icon: groupIcon,
	category: 'maxi-blocks',
	apiVersion: 2,
	variations: [],

	attributes,
	parent: ['maxi-blocks/accordion-maxi'],

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
