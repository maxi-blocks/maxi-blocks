/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useReducer } from '@wordpress/element';
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
import { isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const BlockStylesControl = props => {
	const { onChange, isFirstOnHierarchy, className, blockStyle, clientId } =
		props;

	const classes = classnames('maxi-block-style-control', className);

	const getSelectorOptions = () => {
		if (isFirstOnHierarchy)
			return [
				{ label: __('Dark', 'maxi-blocks'), value: 'dark' },
				{ label: __('Light', 'maxi-blocks'), value: 'light' },
			];
		return null;
	};

	const [, setDescVisibility] = useReducer(isVisible => {
		const blockDesc = document.querySelector(
			'.block-editor-block-card__description'
		);

		!isVisible
			? (blockDesc.style.display = 'block')
			: (blockDesc.style.display = 'none');

		return !isVisible;
	}, false);

	const getAllInnerBlocks = (id, blockStyle) => {
		const { getBlockOrder } = select('core/block-editor');
		const { updateBlockAttributes } = dispatch('core/block-editor');
		const innerBlockIds = id ? getBlockOrder(id) : getBlockOrder(clientId);
		const innerBlocksStyle = blockStyle || '';

		if (innerBlockIds) {
			innerBlockIds.forEach(innerBlockId => {
				if (!isEmpty(innerBlocksStyle))
					updateBlockAttributes(innerBlockId, {
						blockStyle: innerBlocksStyle,
					});

				getAllInnerBlocks(innerBlockId, blockStyle);
			});
		}
	};
	return (
		<>
			<div className='block-info-icon' onClick={setDescVisibility}>
				<span className='block-info-icon-span'>i</span>
			</div>
			{isFirstOnHierarchy ? (
				<SelectControl
					label={__('Block tone', 'maxi-blocks')}
					className={classes}
					value={blockStyle}
					options={getSelectorOptions()}
					onChange={blockStyle => {
						getAllInnerBlocks(clientId, blockStyle);

						onChange({
							blockStyle,
							...{ blockStyle },
						});
					}}
				/>
			) : (
				<div className='maxi-block-style-preview'>
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
