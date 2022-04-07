/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { compose, withInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import getStyles from './styles';

/**
 * Edit
 */
const slideTemplate = {
	type: 'color',
	isHover: false,
	'display-general': 'block',
	'background-palette-status-general': true,
	'background-palette-color-general': 1,
	'background-color-clip-path-status-general': false,
	order: 1,
	id: 1,
};

const TEMPLATE = [
	[
		'maxi-blocks/slide-maxi',
		{
			'background-layers': [slideTemplate],
			'height-general': 150,
		},
	],
	[
		'maxi-blocks/slide-maxi',
		{
			'background-layers': [
				{
					...slideTemplate,
					'background-palette-color-general': 2,
				},
			],
			'height-general': 150,
		},
	],
	[
		'maxi-blocks/slide-maxi',
		{
			'background-layers': [
				{
					...slideTemplate,
					'background-palette-color-general': 3,
				},
			],
			'height-general': 150,
		},
	],
	[
		'maxi-blocks/slide-maxi',
		{
			'background-layers': [
				{
					...slideTemplate,
					'background-palette-color-general': 4,
				},
			],
			'height-general': 150,
		},
	],
	[
		'maxi-blocks/slide-maxi',
		{
			'background-layers': [
				{
					...slideTemplate,
					'background-palette-color-general': 5,
				},
			],
			'height-general': 150,
		},
	],
	[
		'maxi-blocks/slide-maxi',
		{
			'background-layers': [
				{
					...slideTemplate,
					'background-palette-color-general': 6,
				},
			],
			'height-general': 150,
		},
	],
];

const SliderWrapper = () => {
	const ALLOWED_BLOCKS = ['maxi-blocks/slide-maxi'];

	return (
		<ul
			{...useInnerBlocksProps(
				{ className: 'maxi-slider-block__wrapper' },
				{
					allowedBlocks: ALLOWED_BLOCKS,
					orientation: 'horizontal',
					template: TEMPLATE,
				}
			)}
		/>
	);
};

class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	// eslint-disable-next-line class-methods-use-this
	get getMaxiCustomData() {
		const response = {
			slider: true,
		};

		return response;
	}

	render() {
		const { attributes, blockFullWidth, hasInnerBlocks } = this.props;
		const { uniqueID } = attributes;

		const emptySliderClass = !hasInnerBlocks
			? 'maxi-slider-block__empty'
			: 'maxi-slider-block__has-innerBlock';

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				toggleHandlers={() => {
					this.setState({
						displayHandlers: !this.state.displayHandlers,
					});
				}}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-slider--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				classes={emptySliderClass}
				{...getMaxiBlockAttributes(this.props)}
			>
				<div className='maxi-slider-block__tracker'>
					<SliderWrapper />
					<div className='maxi-slider-block__nav'>
						<span className='maxi-slider-block__arrow maxi-slider-block__arrow--next'>
							+
						</span>
						<span className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'>
							-
						</span>
					</div>
				</div>
			</MaxiBlock>,
		];
	}
}

export default compose(withInstanceId, withMaxiProps)(edit);
