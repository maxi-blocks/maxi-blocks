/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	ResponsiveTabsControl,
	SelectControl,
	ToggleSwitch,
} from '../../components';
import MaxiModal from '../../editor/library/modal';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import {
	setSVGRatio,
	setSVGPosition,
	getSVGPosition,
	getSVGRatio,
} from '../../extensions/svg';

const ImageShapeResponsiveSettings = ({
	breakpoint,
	prefix = '',
	onChange,
	...attributes
}) => {
	const getLastShapeAttribute = target =>
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes,
		});

	const getProps = (rawTarget, component = 'AdvancedNumberControl') => {
		const dictionary = {
			AdvancedNumberControl: {
				value: 'value',
				onChange: 'onChangeValue',
			},
			ToggleSwitch: {
				value: 'selected',
				onChange: 'onChange',
			},
		};

		const getDictionaryValue = value => dictionary[component][value];

		const target = `${prefix}is_${rawTarget}`;
		const targetWithBreakpoint = `${target}-${breakpoint}`;

		return {
			[getDictionaryValue('value')]: getLastShapeAttribute(target) || '',
			[getDictionaryValue('onChange')]: value =>
				onChange({
					[targetWithBreakpoint]:
						value !== undefined && value !== '' ? value : '',
				}),
			...(component === 'AdvancedNumberControl' && {
				onReset: () =>
					onChange({
						[targetWithBreakpoint]:
							getDefaultAttribute(targetWithBreakpoint),
						isReset: true,
					}),
			}),
		};
	};

	return (
		<>
			<AdvancedNumberControl
				label={__('Scale shape', 'maxi-blocks')}
				min={0}
				max={500}
				step={1}
				initial={100}
				{...getProps('sc')}
			/>
			<AdvancedNumberControl
				label={__('Rotate shape', 'maxi-blocks')}
				min={-360}
				max={360}
				step={1}
				placeholder='0'
				{...getProps('rot')}
			/>
			<ToggleSwitch
				label={__('Flip shape horizontally', 'maxi-blocks')}
				{...getProps('fx', 'ToggleSwitch')}
			/>
			<ToggleSwitch
				label={__('Flip shape vertically', 'maxi-blocks')}
				{...getProps('fy', 'ToggleSwitch')}
			/>
		</>
	);
};

/**
 * ImageShape
 */
const ImageShape = props => {
	const {
		onChange,
		breakpoint,
		icon,
		disableModal = false,
		disableImagePosition = false,
		disableImageRatio = false,
	} = props;

	const shapePosition = getSVGPosition(icon);
	const shapeRatio = getSVGRatio(icon);

	return (
		<>
			{!disableModal && breakpoint === 'g' && (
				<MaxiModal
					type='image-shape'
					onSelect={obj => {
						const { SVGElement } = obj;

						const newSVGElement = SVGElement.replace(
							/class="(.*?)"/,
							`class="${
								SVGElement.match(/class="(.*?)"/)[1]
							} maxi-image-block__image"`
						);

						onChange({ ...obj, _se: newSVGElement });
					}}
					onRemove={obj => {
						onChange(obj);
					}}
					icon={icon}
				/>
			)}
			{icon && (
				<>
					{breakpoint === 'g' && (
						<>
							{!disableImageRatio && (
								<SelectControl
									label={__('Image ratio', 'maxi-blocks')}
									value={shapeRatio || ''}
									options={[
										{
											label: __('Fit', 'maxi-blocks'),
											value: 'meet',
										},
										{
											label: __('Fill', 'maxi-blocks'),
											value: 'slice',
										},
									]}
									onChange={val =>
										onChange({
											_se: setSVGRatio(icon, val),
										})
									}
								/>
							)}
							{!disableImagePosition && (
								<SelectControl
									label={__('Image position', 'maxi-blocks')}
									value={shapePosition || 'xMidYMid'}
									options={[
										{
											label: __(
												'Center center',
												'maxi-blocks'
											),
											value: 'xMidYMid',
										},
										{
											label: __(
												'Left center',
												'maxi-blocks'
											),
											value: 'xMinYMid',
										},
										{
											label: __(
												'Right center',
												'maxi-blocks'
											),
											value: 'xMaxYMid',
										},
										{
											label: __(
												'Center top',
												'maxi-blocks'
											),
											value: 'xMidYMax',
										},
										{
											label: __(
												'Center bottom',
												'maxi-blocks'
											),
											value: 'xMidYMin',
										},
										{
											label: __(
												'Left bottom',
												'maxi-blocks'
											),
											value: 'xMinYMin',
										},
										{
											label: __(
												'Right bottom',
												'maxi-blocks'
											),
											value: 'xMaxYMin',
										},
										{
											label: __(
												'Left top',
												'maxi-blocks'
											),
											value: 'xMinYMax',
										},
										{
											label: __(
												'Right top',
												'maxi-blocks'
											),
											value: 'xMaxYMax',
										},
									]}
									onChange={val =>
										onChange({
											_se: setSVGPosition(icon, val),
										})
									}
								/>
							)}
						</>
					)}
					<ResponsiveTabsControl breakpoint={breakpoint}>
						<ImageShapeResponsiveSettings {...props} />
					</ResponsiveTabsControl>
				</>
			)}
		</>
	);
};

export default ImageShape;
