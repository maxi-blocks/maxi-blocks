/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getBlockStyle } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { isEmpty } from 'lodash';

/**
 * Component
 */
const BlockStylesControl = props => {
	const { blockStyle, onChange, isFirstOnHierarchy, className, clientId } =
		props;

	const { getBlockOrder } = select('core/block-editor');
	const { updateBlockAttributes } = dispatch('core/block-editor');

	const classes = classnames('maxi-block-style-control', className);

	const getSelectorOptions = () => {
		if (isFirstOnHierarchy)
			return [
				{ label: __('Dark', 'maxi-blocks'), value: 'maxi-dark' },
				{ label: __('Light', 'maxi-blocks'), value: 'maxi-light' },
			];
		return [{ label: __('Parent', 'maxi-blocks'), value: 'maxi-parent' }];
	};

	const getAllInnerBlocks = (id, parentBlockStyle) => {
		const innerBlockIds = id ? getBlockOrder(id) : getBlockOrder(clientId);
		const innerBlocksStyle = parentBlockStyle || '';

		if (innerBlockIds) {
			innerBlockIds.forEach(innerBlockId => {
				if (!isEmpty(innerBlocksStyle))
					updateBlockAttributes(innerBlockId, {
						parentBlockStyle: innerBlocksStyle,
					});

				getAllInnerBlocks(innerBlockId, parentBlockStyle);
			});
		}
	};

	return (
		<>
			{isFirstOnHierarchy ? (
				<SelectControl
					label={__('Block Style', 'maxi-blocks')}
					className={classes}
					value={blockStyle}
					options={getSelectorOptions()}
					onChange={blockStyle => {
						const dependsOnParent = blockStyle.includes('parent');
						const parentBlockStyle = blockStyle.replace(
							'maxi-',
							''
						);

						getAllInnerBlocks(clientId, parentBlockStyle);

						onChange({
							blockStyle,
							...(!dependsOnParent && { parentBlockStyle }),
						});
					}}
				/>
			) : (
				<div className='maxi-block-style-preview'>
					{__('Block Style: ', 'maxi-blocks')}
					<span
						className={`maxi-block-style-preview__${getBlockStyle(
							clientId
						)}`}
					>
						{__('Parent', 'maxi-blocks')} |{' '}
						{getBlockStyle(clientId)}
					</span>
				</div>
			)}
		</>
	);
};

export default BlockStylesControl;
