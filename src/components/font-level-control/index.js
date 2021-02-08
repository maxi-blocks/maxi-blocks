/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;

/**
 * Internal dependencies
 */
import {
	pTypography,
	h1Typography,
	h2Typography,
	h3Typography,
	h4Typography,
	h5Typography,
	h6Typography,
} from './defaults';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FontLevelControl = props => {
	const { className, value, onChange } = props;

	const classes = classnames('maxi-font-level-control', className);

	const onChangeValue = (defaultTypography, textLevel) => {
		onChange({ ...defaultTypography, textLevel });
	};

	return (
		<div className={classes}>
			<Button
				className='maxi-font-level-control__button'
				aria-pressed={value === 'p'}
				onClick={() => onChangeValue(pTypography, 'p')}
			>
				{__('P', 'maxi-blocks')}
			</Button>
			<Button
				className='maxi-font-level-control__button'
				aria-pressed={value === 'h1'}
				onClick={() => onChangeValue(h1Typography, 'h1')}
			>
				{__('H1', 'maxi-blocks')}
			</Button>
			<Button
				className='maxi-font-level-control__button'
				aria-pressed={value === 'h2'}
				onClick={() => onChangeValue(h2Typography, 'h2')}
			>
				{__('H2', 'maxi-blocks')}
			</Button>
			<Button
				className='maxi-font-level-control__button'
				aria-pressed={value === 'h3'}
				onClick={() => onChangeValue(h3Typography, 'h3')}
			>
				{__('H3', 'maxi-blocks')}
			</Button>
			<Button
				className='maxi-font-level-control__button'
				aria-pressed={value === 'h4'}
				onClick={() => onChangeValue(h4Typography, 'h4')}
			>
				{__('H4', 'maxi-blocks')}
			</Button>
			<Button
				className='maxi-font-level-control__button'
				aria-pressed={value === 'h5'}
				onClick={() => onChangeValue(h5Typography, 'h5')}
			>
				{__('H5', 'maxi-blocks')}
			</Button>
			<Button
				className='maxi-font-level-control__button'
				aria-pressed={value === 'h6'}
				onClick={() => onChangeValue(h6Typography, 'h6')}
			>
				{__('H6', 'maxi-blocks')}
			</Button>
		</div>
	);
};

export default FontLevelControl;
