/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { compose, withInstanceId } from '@wordpress/compose';
import { useRef, useState, useEffect } from '@wordpress/element';
import { dispatch, select, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

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
 * External dependencies
 */
import classnames from 'classnames';

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

const SliderWrapper = props => {
	const { maxiSetAttributes, attributes, clientId } = props;
	const { currentSlide, numberOfSlides, isVertical } = attributes;

	const ALLOWED_BLOCKS = ['maxi-blocks/slide-maxi'];
	const wrapperRef = useRef(null);
	const editor = document.querySelector('#editor');
	let initPosition;
	let dragPosition;
	const slideWidth = useSelect(
		select =>
			select('core/block-editor').getBlocks(clientId)[0].attributes
				.slideWidth
	);
	const [wrapperTranslate, setWrapperTranslate] = useState(
		currentSlide * slideWidth
	);

	const onDragAction = e => {
		if (isVertical) return;

		e.preventDefault();

		let dragMove;

		if (e.type === 'touchmove') {
			dragMove = dragPosition - e.touches[0].clientX;
			dragPosition = e.touches[0].clientX;
		} else {
			dragMove = dragPosition - e.clientX;
			dragPosition = e.clientX;
		}

		setWrapperTranslate(prev => prev + dragMove);
	};

	const onDragEnd = e => {
		if (isVertical) return;

		e.preventDefault();

		if (
			dragPosition - initPosition < -100 &&
			currentSlide < numberOfSlides - 1
		) {
			setWrapperTranslate((currentSlide + 1) * slideWidth);
			maxiSetAttributes({
				currentSlide: currentSlide + 1,
			});
		} else if (dragPosition - initPosition > 100 && currentSlide > 0) {
			setWrapperTranslate((currentSlide - 1) * slideWidth);
			maxiSetAttributes({
				currentSlide: currentSlide - 1,
			});
		} else {
			setWrapperTranslate(currentSlide * slideWidth);
		}

		editor.removeEventListener('mousemove', onDragAction);
		editor.removeEventListener('mouseup', onDragEnd);
	};

	const onDragStart = e => {
		if (isVertical) return;
		if (e.type === 'touchstart') {
			initPosition = e.touches[0].clientX;
		} else {
			initPosition = e.clientX;
			editor.addEventListener('mousemove', onDragAction);
			editor.addEventListener('mouseup', onDragEnd);
		}

		dragPosition = initPosition;
	};

	useEffect(() => {
		wrapperRef.current.addEventListener('mousedown', onDragStart);
		wrapperRef.current.addEventListener('touchstart', onDragStart);
		wrapperRef.current.addEventListener('touchmove', onDragAction);
		wrapperRef.current.addEventListener('touchend', onDragEnd);
		return () => {
			wrapperRef.current.removeEventListener('mousedown', onDragStart);
			wrapperRef.current.removeEventListener('touchstart', onDragStart);
			wrapperRef.current.removeEventListener('touchmove', onDragAction);
			wrapperRef.current.removeEventListener('touchend', onDragEnd);
		};
	}, [currentSlide, slideWidth, isVertical]);

	useEffect(() => {
		if (wrapperTranslate !== currentSlide * slideWidth) {
			setWrapperTranslate(currentSlide * slideWidth);
		}
	}, [currentSlide, slideWidth]);

	const classes = classnames(
		'maxi-slider-block__wrapper',
		isVertical && 'maxi-slider-block__wrapper--vertical'
	);

	return (
		<ul
			{...useInnerBlocksProps(
				{
					className: classes,
					ref: wrapperRef,
					style: { transform: `translateX(-${wrapperTranslate}px)` },
				},
				{
					allowedBlocks: ALLOWED_BLOCKS,
					orientation: 'horizontal',
					template: TEMPLATE,
					renderAppender: false,
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

	maxiBlockDidUpdate(prevProps) {
		const { attributes, clientId } = this.props;
		const { numberOfSlides } = attributes;
		const { numberOfSlides: prevNumberOfSlides } = prevProps.attributes;

		if (numberOfSlides > prevNumberOfSlides) {
			dispatch('core/block-editor').replaceInnerBlocks(clientId, [
				...select('core/block-editor').getBlocks(clientId),
				createBlock('maxi-blocks/slide-maxi'),
			]);
		} else if (numberOfSlides < prevNumberOfSlides) {
			dispatch('core/block-editor').replaceInnerBlocks(
				clientId,
				[...select('core/block-editor').getBlocks(clientId)].slice(
					0,
					-1
				)
			);
		}
	}

	render() {
		const {
			attributes,
			blockFullWidth,
			hasInnerBlocks,
			maxiSetAttributes,
		} = this.props;
		const { uniqueID, currentSlide, numberOfSlides, isVertical } =
			attributes;

		const emptySliderClass = !hasInnerBlocks
			? 'maxi-slider-block__empty'
			: 'maxi-slider-block__has-innerBlock';

		const nextSlide = () => {
			maxiSetAttributes({
				currentSlide:
					currentSlide < numberOfSlides - 1
						? currentSlide + 1
						: currentSlide,
			});
		};

		const prevSlide = () => {
			maxiSetAttributes({
				currentSlide:
					currentSlide > 0 ? currentSlide - 1 : currentSlide,
			});
		};

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
					<SliderWrapper
						nextSlide={nextSlide}
						prevSlide={prevSlide}
						{...this.props}
					/>
					<div className='maxi-slider-block__nav'>
						<span
							className='maxi-slider-block__arrow maxi-slider-block__arrow--next'
							onClick={!isVertical ? nextSlide : undefined}
						>
							+
						</span>
						<span
							className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'
							onClick={!isVertical ? prevSlide : undefined}
						>
							-
						</span>
					</div>
				</div>
			</MaxiBlock>,
		];
	}
}

export default compose(withInstanceId, withMaxiProps)(edit);
