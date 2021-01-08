/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;
const { useState } = wp.element;

/**
 * Internal dependencies
 */
import defaultTypography from '../../extensions/defaults/typography';
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
const FontLevelControl = props => {
	const { className, value, fontOptions, fontOptionsHover, onChange } = props;

	const [state, setState] = useState({
		lastLevel: value,
		p: {},
		pHover: {},
		h1: {},
		h1Hover: {},
		h2: {},
		h2Hover: {},
		h3: {},
		h3Hover: {},
		h4: {},
		h4Hover: {},
		h5: {},
		h5Hover: {},
		h6: {},
		h6Hover: {},
	});

	const classes = classnames('maxi-font-level-control', className);

	const saveOldies = value => {
		setState({
			[state.lastLevel]: fontOptions,
			[`${state.lastLevel}Hover`]: fontOptionsHover,
			lastLevel: value,
		});
	};

	const onChangeValue = value => {
		saveOldies(value);
		let fontOptResponse = {};
		let fontOptResponseHover = {};

		if (!isEmpty(state[value])) {
			fontOptResponse = state[value];
			fontOptResponseHover = state[`${value}Hover`];
		} else if (!isNil(fontOptions)) {
			const oldFontOptions = { ...fontOptions };

			fontOptResponse = {
				...oldFontOptions,
				...defaultTypography[value],
				customFormats: { ...oldFontOptions.customFormats },
			};
			fontOptResponseHover = getDefaultProp(null, 'typographyHover');
		}

		onChange({
			textLevel: value,
			typography: fontOptResponse,
			typographyHover: fontOptResponseHover,
		});
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
};

export default FontLevelControl;
