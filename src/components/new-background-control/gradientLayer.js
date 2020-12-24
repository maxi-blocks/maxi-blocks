/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import GradientControl from '../gradient-control/newGradientControl';
import ClipPath from '../clip-path-control';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';
import getAttributeKey from '../../extensions/styles/getAttributeKey';

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
		<Fragment>
			<GradientControl
				label={__('Background', 'maxi-blocks')}
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
								'background-clip-path',
								isHover,
								prefix
							)
						]
					}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-clip-path',
								isHover,
								prefix
							)]: val,
						})
					}
				/>
			)}
		</Fragment>
	);
};

export default GradientLayer;
