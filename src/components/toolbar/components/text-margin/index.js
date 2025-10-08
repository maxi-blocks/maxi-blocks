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
import { toolbarTextMargin } from '@maxi-icons';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Text Margin - Direct Sidebar Link
 */
const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi'];

const TextMargin = props => {
	const { blockName } = props;

	const { tooltipsHide } = useSelect(select => {
		const { receiveMaxiSettings } = select('maxiBlocks');
		const maxiSettings = receiveMaxiSettings();
		const { hide_tooltips: hideTooltips } = maxiSettings;
		return {
			tooltipsHide: !isEmpty(hideTooltips) ? hideTooltips : false,
		};
	}, []);

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const buttonContent = (
		<Button
			className='toolbar-item toolbar-item__button toolbar-item__text-margin'
			onClick={() => {
				openSidebarAccordion(0, 'margin padding');
			}}
		>
			<Icon className='toolbar-item__icon' icon={toolbarTextMargin} />
		</Button>
	);

	return tooltipsHide ? (
		buttonContent
	) : (
		<Tooltip text={__('Margin', 'maxi-blocks')} placement='top'>
			{buttonContent}
		</Tooltip>
	);
};

export default TextMargin;
