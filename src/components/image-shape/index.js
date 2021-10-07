/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import { SelectControl } from '../../components';
import MaxiModal from '../../editor/library/modal';

/**
 * ImageShape
 */
const ImageShape = props => {
	const { onChange, onSelect, onRemove, breakpoint, icon } = props;

	const shapeSize = props[`image-shape-size-${breakpoint}`];

	let newIcon = icon;

	const changeIcon = (attr, value) => {
		console.log(`value ${value}`);
		switch (attr) {
			case 'size': {
				const oldPreserveAspectRatio = icon
					.split('preserveaspectratio="')
					.pop()
					.split('"')[0];
				let newPreserveAspectRatio = '';
				value === 'fill'
					? (newPreserveAspectRatio = `${oldPreserveAspectRatio} slice`)
					: (newPreserveAspectRatio = `${oldPreserveAspectRatio} meet`);

				newIcon = icon
					.replaceAll(' meet', '')
					.replaceAll(' slice', '')
					.replace(oldPreserveAspectRatio, newPreserveAspectRatio);
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
				onSelect={obj => onSelect(obj)}
				onRemove={obj => {
					onRemove(obj);
				}}
				icon={icon}
			/>
			{!isNil(icon) && (
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
			)}
		</>
	);
};

export default ImageShape;
