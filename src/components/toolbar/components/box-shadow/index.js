/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';
import { openSidebarAccordion } from '@extensions/inspector';

/**
 * Icons
 */
import './editor.scss';
import { toolbarDropShadow } from '@maxi-icons';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * BoxShadow - Direct Sidebar Link
 */
const ALLOWED_BLOCKS = [
	'maxi-blocks/button-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/slider-maxi',
	'maxi-blocks/slide-maxi',
	'maxi-blocks/video-maxi',
];

const BoxShadow = props => {
	const { blockName } = props;

	const { tooltipsHide } = useSelect(select => {
		const { receiveMaxiSettings } = select('maxiBlocks');
		const maxiSettings = receiveMaxiSettings() || {};
		const { hide_tooltips } = maxiSettings;
		return {
			tooltipsHide: typeof hide_tooltips === 'boolean' ? hide_tooltips : false,
		};
	}, []);

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const buttonContent = (
		<Button
			className='toolbar-item toolbar-item__button toolbar-item__box-shadow'
			onClick={() => {
				openSidebarAccordion(0, 'box shadow');
			}}
		>
			<Icon className='toolbar-item__icon' icon={toolbarDropShadow} />
		</Button>
	);

	return tooltipsHide ? (
		buttonContent
	) : (
		<Tooltip text={__('Box shadow', 'maxi-blocks')} placement='top'>
			{buttonContent}
		</Tooltip>
	);
};

export default BoxShadow;
