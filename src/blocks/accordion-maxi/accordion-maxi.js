/**
 * BLOCK: maxi-blocks/accordion-maxi
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

/**
 * Styles and icons
 */
import './style.scss';
import { accordionIcon } from '../../icons';

/**
 * Block
 */
registerBlockType('maxi-blocks/accordion-maxi', {
	title: __('Accordion Maxi', 'maxi-blocks'),
	icon: accordionIcon,
	description: 'Expand or collapse content inside of a panel',
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
});
