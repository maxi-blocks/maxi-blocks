/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { compose, withInstanceId } from '@wordpress/compose';
import { useRef, useState, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';

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
import SliderContext from './context';

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
	const { slidesWidth, isEditView, numberOfSlides } = props;

	const ALLOWED_BLOCKS = ['maxi-blocks/slide-maxi'];
	const wrapperRef = useRef(null);
	const editor = document.querySelector('#editor');
	let initPosition = 0;
	let dragPosition = 0;
	const [slideWidth, setSlideWidth] = useState(Object.values(slidesWidth)[0]);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [wrapperTranslate, setWrapperTranslate] = useState(
		currentSlide * slideWidth
	);

	const onDragAction = e => {
		if (isEditView) return;

		let dragMove = 0;

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
		if (isEditView) return;
		if (
			dragPosition - initPosition < -100 &&
			currentSlide < numberOfSlides - 1
		) {
			setWrapperTranslate((currentSlide + 1) * slideWidth);
			setCurrentSlide(prev => prev + 1);
		} else if (dragPosition - initPosition > 100 && currentSlide > 0) {
			setWrapperTranslate((currentSlide - 1) * slideWidth);
			setCurrentSlide(prev => prev - 1);
		} else {
			setWrapperTranslate(currentSlide * slideWidth);
		}

		editor.removeEventListener('mousemove', onDragAction);
		editor.removeEventListener('mouseup', onDragEnd);
	};

	const onDragStart = e => {
		if (isEditView) return;
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
		const slider = wrapperRef.current;
		slider.addEventListener('mousedown', onDragStart);
		slider.addEventListener('touchstart', onDragStart);
		slider.addEventListener('touchmove', onDragAction);
		slider.addEventListener('touchend', onDragEnd);
		return () => {
			slider.removeEventListener('mousedown', onDragStart);
			slider.removeEventListener('touchstart', onDragStart);
			slider.removeEventListener('touchmove', onDragAction);
			slider.removeEventListener('touchend', onDragEnd);
		};
	}, [currentSlide, slideWidth, isEditView, numberOfSlides]);

	useEffect(() => {
		if (wrapperTranslate !== currentSlide * slideWidth) {
			setWrapperTranslate(currentSlide * slideWidth);
		}
	}, [currentSlide, slideWidth]);

	useEffect(() => {
		setSlideWidth(Object.values(slidesWidth)[0]);
	}, [slidesWidth]);

	useEffect(() => {
		if (currentSlide >= numberOfSlides) {
			setCurrentSlide(numberOfSlides - 1);
		}
	}, [numberOfSlides]);

	const classes = classnames(
		'maxi-slider-block__wrapper',
		isEditView && 'maxi-slider-block__wrapper--edit-view'
	);

	return (
		<>
			<ul
				{...useInnerBlocksProps(
					{
						className: classes,
						ref: wrapperRef,
						style: {
							transform: `translateX(-${wrapperTranslate}px)`,
						},
					},
					{
						allowedBlocks: ALLOWED_BLOCKS,
						orientation: 'horizontal',
						template: TEMPLATE,
					}
				)}
			/>
			<div className='maxi-slider-block__nav'>
				<span
					className='maxi-slider-block__arrow maxi-slider-block__arrow--next'
					onClick={
						!isEditView
							? () =>
									setCurrentSlide(
										currentSlide < numberOfSlides - 1
											? currentSlide + 1
											: currentSlide
									)
							: undefined
					}
				>
					+
				</span>
				<span
					className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'
					onClick={
						!isEditView
							? () =>
									setCurrentSlide(
										currentSlide > 0
											? currentSlide - 1
											: currentSlide
									)
							: undefined
					}
				>
					-
				</span>
			</div>
		</>
	);
};

class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state = {
			slidesWidth: {},
			isEditView: false,
			numberOfSlides: 0,
		};
	}

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

	maxiBlockDidUpdate() {
		const { numberOfSlides: prevNumberOfSlides, slidesWidth } = this.state;
		const numberOfSlides = Object.keys(slidesWidth).length;
		if (numberOfSlides !== prevNumberOfSlides) {
			this.setState({ numberOfSlides });
		}
	}

	render() {
		const { attributes, blockFullWidth, hasInnerBlocks } = this.props;
		const { uniqueID } = attributes;

		const emptySliderClass = !hasInnerBlocks
			? 'maxi-slider-block__empty'
			: 'maxi-slider-block__has-innerBlock';

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				{...this.state}
				setEditView={val => this.setState({ isEditView: val })}
			/>,
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
			<SliderContext.Provider
				key={`slider-content-${uniqueID}`}
				value={{
					slidesWidth: this.state.slidesWidth,
					setSlideWidth: (id, width) => {
						this.setState({
							slidesWidth: {
								...this.state.slidesWidth,
								[id]: width,
							},
						});
					},
					onRemoveSlide: id => {
						let slidesWidth = { ...this.state.slidesWidth };
						delete slidesWidth[id];
						this.setState({ slidesWidth });
					},
				}}
			>
				<MaxiBlock
					key={`maxi-slider--${uniqueID}`}
					ref={this.blockRef}
					blockFullWidth={blockFullWidth}
					classes={emptySliderClass}
					{...getMaxiBlockAttributes(this.props)}
				>
					<div className='maxi-slider-block__tracker'>
						<SliderWrapper {...this.props} {...this.state} />
					</div>
				</MaxiBlock>
			</SliderContext.Provider>,
		];
	}
}

export default compose(withInstanceId, withMaxiProps)(edit);
