/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

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

/**
 * Component
 */
const BlockStylesControl = props => {
	const { blockStyle, onChange, isFirstOnHierarchy, className, clientId } =
		props;

	const classes = classnames('maxi-block-style-control', className);

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
					label={__('Block tone', 'maxi-blocks')}
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
					{__('Block style: ', 'maxi-blocks')}
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
