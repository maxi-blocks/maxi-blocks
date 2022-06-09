/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { Button, ColorControl } from '..';

const prefix = 'title-';
const bgPrefix = 'title-background-';
const AccordionTitleSettings = props => {
	const { titleLevel, onChange, clientId } = props;
	const classes = 'maxi-font-level-control';

	const onChangeValue = obj => {
		const blocks = select('core/block-editor').getClientIdsOfDescendants([
			clientId,
		]);

		blocks.forEach(block => {
			if (
				select('core/block-editor').getBlockName(block) ===
				'maxi-blocks/pane-maxi'
			) {
				dispatch('core/block-editor').updateBlockAttributes(block, obj);
			}
		});
		onChange(obj);
	};
	return (
		<>
			<div className={classes}>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={titleLevel === 'p'}
					onClick={() => onChangeValue({ titleLevel: 'p' })}
				>
					{__('P', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={titleLevel === 'h1'}
					onClick={() => onChangeValue({ titleLevel: 'h1' })}
				>
					{__('H1', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={titleLevel === 'h2'}
					onClick={() => onChangeValue({ titleLevel: 'h2' })}
				>
					{__('H2', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={titleLevel === 'h3'}
					onClick={() => onChangeValue({ titleLevel: 'h3' })}
				>
					{__('H3', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={titleLevel === 'h4'}
					onClick={() => onChangeValue({ titleLevel: 'h4' })}
				>
					{__('H4', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={titleLevel === 'h5'}
					onClick={() => onChangeValue({ titleLevel: 'h5' })}
				>
					{__('H5', 'maxi-blocks')}
				</Button>
				<Button
					className='maxi-font-level-control__button'
					aria-pressed={titleLevel === 'h6'}
					onClick={() => onChangeValue({ titleLevel: 'h6' })}
				>
					{__('H6', 'maxi-blocks')}
				</Button>
			</div>
			<ColorControl
				label={__('Title', 'maxi-blocks')}
				color={props[`${prefix}color`]}
				prefix={prefix}
				paletteColor={props[`${prefix}palette-color`]}
				paletteOpacity={props[`${prefix}palette-opacity`]}
				paletteStatus={props[`${prefix}palette-status`]}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) =>
					onChange({
						[`${prefix}color`]: color,
						[`${prefix}palette-color`]: paletteColor,
						[`${prefix}palette-status`]: paletteStatus,
						[`${prefix}palette-opacity`]: paletteOpacity,
					})
				}
				clientId={clientId}
				disableGradient
			/>
			<ColorControl
				label={__('Title background', 'maxi-blocks')}
				color={props[`${bgPrefix}color`]}
				prefix={bgPrefix}
				paletteColor={props[`${bgPrefix}palette-color`]}
				paletteOpacity={props[`${bgPrefix}palette-opacity`]}
				paletteStatus={props[`${bgPrefix}palette-status`]}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) =>
					onChange({
						[`${bgPrefix}color`]: color,
						[`${bgPrefix}palette-color`]: paletteColor,
						[`${bgPrefix}palette-status`]: paletteStatus,
						[`${bgPrefix}palette-opacity`]: paletteOpacity,
					})
				}
				clientId={clientId}
				disableGradient
			/>
		</>
	);
};
export default AccordionTitleSettings;
