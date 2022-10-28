/**
 * BLOCK: maxi-blocks/group-maxi
 *
 * Combine a set of blocks in a group
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
import attributes from './attributes';

const Edit = lazy(() => import('./edit'));
import save from './save';
import { customCss } from './data';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { groupIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/group-maxi', {
	title: __('Group Maxi', 'maxi-blocks'),
	icon: groupIcon,
	description: 'Combine a set of blocks in a group',
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
