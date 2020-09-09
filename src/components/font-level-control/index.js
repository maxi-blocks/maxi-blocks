/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;
const { Component } = wp.element;

/**
 * Internal dependencies
 */
import defaultTypography from '../../extensions/defaults/typography';
import defaultMargin from '../../extensions/defaults/margin';
import { getDefaultProp } from '../../utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
export default class FontLevelControl extends Component {
	state = {
		target: this.props.target ? this.props.target : '',
		lastLevel: this.props.value,
		p: {},
		pHover: {},
		pMargin: {},
		h1: {},
		h1Hover: {},
		h1Margin: {},
		h2: {},
		h2Hover: {},
		h2Margin: {},
		h3: {},
		h3Hover: {},
		h3Margin: {},
		h4: {},
		h4Hover: {},
		h4Margin: {},
		h5: {},
		h5Hover: {},
		h5Margin: {},
		h6: {},
		h6Hover: {},
		h6Margin: {},
	};

	render() {
		const {
			className,
			value,
			fontOptions,
			fontOptionsHover,
			marginOptions,
			onChange,
		} = this.props;

		const { lastLevel } = this.state;

		const classes = classnames('maxi-font-level-control', className);

		const saveOldies = value => {
			this.setState({
				[lastLevel]:
					typeof fontOptions === 'object'
						? fontOptions
						: JSON.parse(fontOptions),
				[`${lastLevel}Hover`]:
					typeof fontOptionsHover === 'object'
						? fontOptionsHover
						: JSON.parse(fontOptionsHover),
				[`${lastLevel}Margin`]:
					typeof marginOptions === 'object'
						? marginOptions
						: JSON.parse(marginOptions),
				lastLevel: value,
			});
		};

		const onChangeValue = value => {
			saveOldies(value);
			let fontOptResponse = {};
			let fontOptResponseHover = {};
			let marginOptResponse = {};
			if (!isEmpty(this.state[value])) {
				fontOptResponse = this.state[value];
				fontOptResponseHover = this.state[`${value}Hover`];
				marginOptResponse = this.state[`${value}Margin`];
			} else if (!isNil(fontOptions)) {
				const oldFontOptions =
					typeof fontOptions === 'object'
						? fontOptions
						: JSON.parse(fontOptions);
				fontOptResponse.label = oldFontOptions.label;
				Object.assign(fontOptResponse, defaultTypography[value]);
				fontOptResponseHover = JSON.parse(
					getDefaultProp(null, 'typographyHover')
				);
				marginOptResponse = defaultMargin[value];
			}

			onChange(
				value,
				JSON.stringify(fontOptResponse),
				JSON.stringify(fontOptResponseHover),
				JSON.stringify(marginOptResponse)
			);
		};

		return (
			<div className={classes}>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={value === 'p'}
					onClick={() => onChangeValue('p')}
				>
					{__('P', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={value === 'h1'}
					onClick={() => onChangeValue('h1')}
				>
					{__('H1', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={value === 'h2'}
					onClick={() => onChangeValue('h2')}
				>
					{__('H2', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={value === 'h3'}
					onClick={() => onChangeValue('h3')}
				>
					{__('H3', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={value === 'h4'}
					onClick={() => onChangeValue('h4')}
				>
					{__('H4', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={value === 'h5'}
					onClick={() => onChangeValue('h5')}
				>
					{__('H5', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={value === 'h6'}
					onClick={() => onChangeValue('h6')}
				>
					{__('H6', 'maxi-blocks')}
				</Button>
			</div>
		);
	}
}
