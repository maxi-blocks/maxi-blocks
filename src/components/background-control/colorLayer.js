/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment  } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ClipPath from '../clip-path-control';
import { getDefaultAttribute, getAttributeKey } from '../../extensions/styles';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const colorLayer = props => {
	const { onChange, disableClipPath, isHover, prefix } = props;

	const colorOptions = cloneDeep(props.colorOptions);

	return (
		<Fragment>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={
					colorOptions[
						getAttributeKey('background-color', isHover, prefix)
					]
				}
				defaultColor={getDefaultAttribute(
					getAttributeKey('background-color', isHover, prefix)
				)}
				onChange={val => {
					colorOptions[
						getAttributeKey('background-color', isHover, prefix)
					] = val;

					onChange(colorOptions);
				}}
			/>
			{!disableClipPath && (
				<ClipPath
					clipPath={
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix
							)
						]
					}
					onChange={val => {
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix
							)
						] = val;

						onChange(colorOptions);
					}}
				/>
			)}
		</Fragment>
	);
};

export default colorLayer;
