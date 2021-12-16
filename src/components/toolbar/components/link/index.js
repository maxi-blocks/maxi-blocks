/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import ToolbarPopover from '../toolbar-popover';
import ToolbarContext from '../toolbar-popover/toolbarContext';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
	const { blockName, onChange, linkSettings } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi'
	)
		return null;

	const removeLinkHandle = () => {
		onChange({
			url: '',
		});
	};

	return (
		<ToolbarPopover
			icon={toolbarLink}
			tooltip={__('Link', 'maxi-blocks')}
			className={
				!isNil(linkSettings) &&
				!isEmpty(linkSettings.url) &&
				'toolbar-item__link--active'
			}
		>
			<>
				<LinkControl
					value={linkSettings}
					onChange={value => onChange(value)}
					settings={[
						// {
						// 	id: 'opensInNewTab',
						// 	title: __('Open in new tab', 'maxi-blocks'),
						// },
						{
							id: 'noFollow',
							title: __('"nofollow"', 'maxi-blocks'),
						},
						{
							id: 'sponsored',
							title: __('"sponsored"', 'maxi-blocks'),
						},
						{
							id: 'ugc',
							title: __('"UGC"', 'maxi-blocks'),
						},
					]}
				/>
				{!isNil(linkSettings) && !isEmpty(linkSettings.url) && (
					<ToolbarContext.Consumer>
						{context => (
							<Button
								className='toolbar-popover-link-destroyer'
								onClick={() => {
									removeLinkHandle();
									context.onClose();
								}}
							>
								{__('Remove link', 'maxi-blocks')}
							</Button>
						)}
					</ToolbarContext.Consumer>
				)}
			</>
		</ToolbarPopover>
	);
};

export default Link;
