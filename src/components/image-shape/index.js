/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectControl, AdvancedNumberControl } from '../../components';
import MaxiModal from '../../editor/library/modal';

/**
 * ImageShape
 */
const ImageShape = props => {
	const { onChange, breakpoint, icon } = props;

	const shapeSize = props[`image-shape-size-${breakpoint}`];
	const shapeScale = props[`image-shape-scale-${breakpoint}`];
	const shapePosition = props[`image-shape-position-${breakpoint}`];

	let newIcon = icon;

	const changeIcon = (attr, value) => {
		switch (attr) {
			case 'size': {
				const oldPreserveAspectRatio = icon
					.split('preserveaspectratio="')
					.pop()
					.split('"')[0];
				let newPreserveAspectRatio;
				value === 'fill'
					? (newPreserveAspectRatio = `${oldPreserveAspectRatio} slice`)
					: (newPreserveAspectRatio = `${oldPreserveAspectRatio} meet`);

				newIcon = icon
					.replaceAll(' meet', '')
					.replaceAll(' slice', '')
					.replace(oldPreserveAspectRatio, newPreserveAspectRatio);
				return newIcon;
			}
			case 'scale': {
				const oldViewBox = icon.split('viewBox="').pop().split('"')[0];
				const newViewBoxValues = [0, 0, 36.1 / value, 36.1 / value];
				const newViewBox = newViewBoxValues.join(' ');
				newIcon = icon.replace(oldViewBox, newViewBox);
				return newIcon;
			}
			case 'position': {
				const oldPreserveAspectRatio = icon
					.split('preserveaspectratio="')
					.pop()
					.split('"')[0];
				let newPreserveAspectRatio;
				if (oldPreserveAspectRatio.includes('slice'))
					newPreserveAspectRatio = ' slice';
				if (oldPreserveAspectRatio.includes('meet'))
					newPreserveAspectRatio = ' meet';

				newPreserveAspectRatio = value + newPreserveAspectRatio;

				newIcon = icon.replace(
					oldPreserveAspectRatio,
					newPreserveAspectRatio
				);
				return newIcon;
			}
			default:
				return newIcon;
		}
	};

	return (
		<>
			<MaxiModal
				type='image-shape'
				onSelect={obj => onChange(obj)}
				onRemove={obj => {
					onChange(obj);
				}}
				icon={icon}
			/>
			{icon && (
				<>
					<SelectControl
						label={__('Size', 'maxi-blocks')}
						value={shapeSize || ''}
						options={[
							{
								label: __('Fit', 'maxi-blocks'),
								value: '',
							},
							{
								label: __('Fill', 'maxi-blocks'),
								value: 'fill',
							},
						]}
						onChange={shapeSize =>
							onChange({
								[`image-shape-size-${breakpoint}`]: shapeSize,
								SVGElement: changeIcon('size', shapeSize),
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Scale', 'maxi-blocks')}
						value={shapeScale || 1}
						min={0}
						max={5}
						step={0.01}
						initialPosition={1}
						onChangeValue={val => {
							onChange({
								[`image-shape-scale-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
								SVGElement: changeIcon('scale', val),
							});
						}}
						onReset={() =>
							onChange({
								[`image-shape-scale-${breakpoint}`]: 1,
								SVGElement: changeIcon('scale', 1),
							})
						}
					/>
					<SelectControl
						label={__('Position', 'maxi-blocks')}
						value={shapePosition || 'xMidYMid'}
						options={[
							{
								label: __('Center Center', 'maxi-blocks'),
								value: 'xMidYMid',
							},
							{
								label: __('Left Center', 'maxi-blocks'),
								value: 'xMinYMid',
							},
							{
								label: __('Right Center', 'maxi-blocks'),
								value: 'xMaxYMid',
							},
							{
								label: __('Center Top', 'maxi-blocks'),
								value: 'xMidYMax',
							},
							{
								label: __('Center Bottom', 'maxi-blocks'),
								value: 'xMidYMin',
							},
							{
								label: __('Left Bottom', 'maxi-blocks'),
								value: 'xMinYMin',
							},
							{
								label: __('Right Bottom', 'maxi-blocks'),
								value: 'xMaxYMin',
							},
							{
								label: __('Left Top', 'maxi-blocks'),
								value: 'xMinYMax',
							},
							{
								label: __('Right Top', 'maxi-blocks'),
								value: 'xMaxYMax',
							},
						]}
						onChange={shapePosition =>
							onChange({
								[`image-shape-position-${breakpoint}`]:
									shapePosition,
								SVGElement: changeIcon(
									'position',
									shapePosition
								),
							})
						}
					/>
				</>
			)}
		</>
	);
};

export default ImageShape;
