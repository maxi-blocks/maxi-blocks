/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useReducer } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';
import { getBlockStyle } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

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

	const getAllInnerBlocks = (id = clientId, blockStyle) => {
		const { getBlockOrder } = select('core/block-editor');
		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
			updateBlockAttributes,
		} = dispatch('core/block-editor');

		function getAllInnerBlocksHelper(innerId) {
			const innerBlockIds = getBlockOrder(innerId);

			if (innerBlockIds) {
				innerBlockIds.forEach(innerBlockId => {
					updateBlockAttributes(innerBlockId, {
						blockStyle,
					});
					markNextChangeAsNotPersistent(innerBlockId);

					getAllInnerBlocksHelper(innerBlockId);
				});
			}
		}

		getAllInnerBlocksHelper(id);
	};

	return (
		<>
			<div className='block-info-icon' onClick={setDescVisibility}>
				<span className='block-info-icon-span'>i</span>
			</div>
			{isFirstOnHierarchy ? (
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Block tone', 'maxi-blocks')}
					className={classes}
					value={blockStyle}
					options={getSelectorOptions()}
					onChange={blockStyle => {
						getAllInnerBlocks(clientId, blockStyle);

						onChange({
							blockStyle,
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
