/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import GradientControl from '../gradient-control';
import ClipPath from '../clip-path-control';
import { getDefaultAttribute, getAttributeKey } from '../../extensions/styles';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const GradientLayer = props => {
	const { onChange, disableClipPath, isHover, prefix } = props;
	const gradientOptions = cloneDeep(props.gradientOptions);

	return (
		<>
			<GradientControl
				label={__('Background Gradient', 'maxi-blocks')}
				gradient={
					gradientOptions[
						getAttributeKey('background-gradient', isHover, prefix)
					]
				}
				gradientOpacity={
					gradientOptions[
						getAttributeKey(
							'background-gradient-opacity',
							isHover,
							prefix
						)
					]
				}
				defaultGradient={getDefaultAttribute(
					getAttributeKey('background-gradient', isHover, prefix)
				)}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-gradient',
							isHover,
							prefix
						)]: val,
					})
				}
				onChangeOpacity={val =>
					onChange({
						[getAttributeKey(
							'background-gradient-opacity',
							isHover,
							prefix
						)]: val,
					})
				}
			/>
			{!disableClipPath && (
				<ClipPath
					clipPath={
						gradientOptions[
							getAttributeKey(
								'background-gradient-clip-path',
								isHover,
								prefix
							)
						]
					}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-gradient-clip-path',
								isHover,
								prefix
							)]: val,
						})
					}
				/>
			)}
		</>
	);
};

export default GradientLayer;
