/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import { getLastBreakpointValue } from '../../utils';
import ColorControl from '../color-control';
import FontIconPicker from '../font-icon-picker';
import AxisControl from '../axis-control';
import BorderControl from '../border-control';

/**
 * Component
 */
const FontIconControl = props => {
	const {
		className,
		icon,
		onChange,
		breakpoint,
		disableSpacing = false,
		disablePosition = false,
		padding,
		onChangePadding,
		border,
		onChangeBorder,
	} = props;

	const value = !isObject(icon) ? JSON.parse(icon) : icon;

	const classes = classnames('maxi-font-icon-control', className);

	const defaultPadding = {
		label: 'Padding',
		general: {
			'padding-top': '',
			'padding-right': '',
			'padding-bottom': '',
			'padding-left': '',
			sync: false,
			unit: '',
		},
		xxl: {
			'padding-top': '',
			'padding-right': '',
			'padding-bottom': '',
			'padding-left': '',
			sync: true,
			unit: '',
		},
		xl: {
			'padding-top': '',
			'padding-right': '',
			'padding-bottom': '',
			'padding-left': '',
			sync: true,
			unit: '',
		},
		l: {
			'padding-top': '',
			'padding-right': '',
			'padding-bottom': '',
			'padding-left': '',
			sync: true,
			unit: '',
		},
		m: {
			'padding-top': '',
			'padding-right': '',
			'padding-bottom': '',
			'padding-left': '',
			sync: true,
			unit: '',
		},
		s: {
			'padding-top': '',
			'padding-right': '',
			'padding-bottom': '',
			'padding-left': '',
			sync: true,
			unit: '',
		},
		xs: {
			'padding-top': '',
			'padding-right': '',
			'padding-bottom': '',
			'padding-left': '',
			sync: true,
			unit: '',
		},
	};

	const defaultBorder = {
		label: 'Border',
		general: {
			'border-color': '#ffffff',
			'border-style': 'none',
		},
		xxl: {
			'border-color': '',
			'border-style': '',
		},
		xl: {
			'border-color': '',
			'border-style': '',
		},
		l: {
			'border-color': '',
			'border-style': '',
		},
		m: {
			'border-color': '',
			'border-style': '',
		},
		s: {
			'border-color': '',
			'border-style': '',
		},
		xs: {
			'border-color': '',
			'border-style': '',
		},
		borderWidth: {
			label: 'Border width',
			general: {
				'border-top-width': '',
				'border-right-width': '',
				'border-bottom-width': '',
				'border-left-width': '',
				sync: true,
				unit: 'px',
			},
			xxl: {
				'border-top-width': '',
				'border-right-width': '',
				'border-bottom-width': '',
				'border-left-width': '',
				sync: true,
				unit: '',
			},
			xl: {
				'border-top-width': '',
				'border-right-width': '',
				'border-bottom-width': '',
				'border-left-width': '',
				sync: true,
				unit: '',
			},
			l: {
				'border-top-width': '',
				'border-right-width': '',
				'border-bottom-width': '',
				'border-left-width': '',
				sync: true,
				unit: '',
			},
			m: {
				'border-top-width': '',
				'border-right-width': '',
				'border-bottom-width': '',
				'border-left-width': '',
				sync: true,
				unit: '',
			},
			s: {
				'border-top-width': '',
				'border-right-width': '',
				'border-bottom-width': '',
				'border-left-width': '',
				sync: true,
				unit: '',
			},
			xs: {
				'border-top-width': '',
				'border-right-width': '',
				'border-bottom-width': '',
				'border-left-width': '',
				sync: true,
				unit: '',
			},
		},
		borderRadius: {
			label: 'Border radius',
			general: {
				'border-top-left-radius': '',
				'border-top-right-radius': '',
				'border-bottom-right-radius': '',
				'border-bottom-left-radius': '',
				sync: false,
				unit: 'px',
			},
			xxl: {
				'border-top-left-radius': '',
				'border-top-right-radius': '',
				'border-bottom-right-radius': '',
				'border-bottom-left-radius': '',
				sync: true,
				unit: '',
			},
			xl: {
				'border-top-left-radius': '',
				'border-top-right-radius': '',
				'border-bottom-right-radius': '',
				'border-bottom-left-radius': '',
				sync: true,
				unit: '',
			},
			l: {
				'border-top-left-radius': '',
				'border-top-right-radius': '',
				'border-bottom-right-radius': '',
				'border-bottom-left-radius': '',
				sync: true,
				unit: '',
			},
			m: {
				'border-top-left-radius': '',
				'border-top-right-radius': '',
				'border-bottom-right-radius': '',
				'border-bottom-left-radius': '',
				sync: true,
				unit: '',
			},
			s: {
				'border-top-left-radius': '',
				'border-top-right-radius': '',
				'border-bottom-right-radius': '',
				'border-bottom-left-radius': '',
				sync: true,
				unit: '',
			},
			xs: {
				'border-top-left-radius': '',
				'border-top-right-radius': '',
				'border-bottom-right-radius': '',
				'border-bottom-left-radius': '',
				sync: true,
				unit: '',
			},
		},
	};

	return (
		<div className={classes}>
			<FontIconPicker
				iconClassName={value.icon}
				onChange={iconClassName => {
					value.icon = iconClassName;
					onChange(JSON.stringify(value));
				}}
			/>
			{value.icon && (
				<Fragment>
					<ColorControl
						label={__('Icon', 'maxi-blocks')}
						color={getLastBreakpointValue(
							value,
							'color',
							breakpoint
						)}
						defaultColor='#fff'
						onChange={val => {
							value[breakpoint].color = val;
							onChange(JSON.stringify(value));
						}}
					/>

					<ColorControl
						label={__('Background', 'maxi-blocks')}
						color={value['background-color']}
						defaultColor='#fff'
						onChange={val => {
							value['background-color'] = val;
							onChange(JSON.stringify(value));
						}}
					/>

					{!disablePosition && (
						<SelectControl
							label={__('Position', 'maxi-blocks')}
							value={value.position}
							options={[
								{
									label: __('Left', 'maxi-blocks'),
									value: 'left',
								},
								{
									label: __('Right', 'maxi-blocks'),
									value: 'right',
								},
							]}
							onChange={val => {
								value.position = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}

					<SizeControl
						label={__('Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'font-sizeUnit',
							breakpoint
						)}
						defaultUnit='px'
						onChangeUnit={val => {
							value[breakpoint]['font-sizeUnit'] = val;
							onChange(JSON.stringify(value));
						}}
						defaultValue=''
						value={getLastBreakpointValue(
							value,
							'font-size',
							breakpoint
						)}
						onChangeValue={val => {
							value[breakpoint]['font-size'] = val;
							onChange(JSON.stringify(value));
						}}
						minMaxSettings={{
							px: {
								min: 0,
								max: 99,
							},
							em: {
								min: 0,
								max: 99,
							},
							vw: {
								min: 0,
								max: 99,
							},
							'%': {
								min: 0,
								max: 100,
							},
						}}
					/>

					{!disableSpacing && (
						<SizeControl
							label={__('Spacing', 'maxi-blocks')}
							unit={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							disableUnit
							defaultValue=''
							value={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							onChangeValue={val => {
								value[breakpoint].spacing = val;
								onChange(JSON.stringify(value));
							}}
							min={0}
							max={99}
						/>
					)}

					<AxisControl
						values={padding}
						defaultValues={defaultPadding}
						onChange={padding => onChangePadding(padding)}
						breakpoint={breakpoint}
						disableAuto
					/>

					<BorderControl
						border={border}
						defaultBorder={defaultBorder}
						onChange={border => onChangeBorder(border)}
						breakpoint={breakpoint}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default FontIconControl;
