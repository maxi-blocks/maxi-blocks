/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';

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
	const { blockStyle, onChange, isFirstOnHierarchy, className } = props;

	const classes = classnames('maxi-block-style-control', className);

	const { parentBlockStyle } = useSelect(select => {
		const { getSelectedBlockClientId, getBlockAttributes } =
			select('core/block-editor');

		const { parentBlockStyle } = getBlockAttributes(
			getSelectedBlockClientId()
		);

		return { parentBlockStyle };
	});

	const getSelectorOptions = () => {
		if (isFirstOnHierarchy)
			return [
				{ label: __('Dark', 'maxi-blocks'), value: 'maxi-dark' },
				{ label: __('Light', 'maxi-blocks'), value: 'maxi-light' },
			];
		return [{ label: __('Parent', 'maxi-blocks'), value: 'maxi-parent' }];
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
						className={`maxi-block-style-preview__${parentBlockStyle}`}
					>
						{__('Parent', 'maxi-blocks')} | {parentBlockStyle}
					</span>
				</div>
			)}
		</>
	);
};

export default BlockStylesControl;
