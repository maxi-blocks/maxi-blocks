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
import { isEmpty } from 'lodash';

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
	const { attributes, slidesWidth } = props;
	const { numberOfSlides, isEditView, isLoop } = attributes;

	const ALLOWED_BLOCKS = ['maxi-blocks/slide-maxi'];
	const wrapperRef = useRef(null);
	const editor = document.querySelector('#editor');
	let initPosition = 0;
	let dragPosition = 0;
	const [currentSlide, setCurrentSlide] = useState(0);
	const [wrapperTranslate, setWrapperTranslate] = useState(0);
	const [realFirstElOffset, setRealFirstElOffset] = useState(0);

	const getSlidePosition = currentSlide => {
		if (currentSlide < 0) return 0;
		return currentSlide === 0
			? realFirstElOffset
			: Object.values(slidesWidth)
					.slice(0, currentSlide)
					.reduce((acc, cur) => acc + cur) + realFirstElOffset ||
					realFirstElOffset;
	};

	const nextSlide = () => {
		if (currentSlide < numberOfSlides - 1 || isLoop) {
			wrapperRef.current.style.transition = 'transform 0.2s ease-out';
			setCurrentSlide(prev => {
				const newCurrentSlide = prev + 1;
				setWrapperTranslate(getSlidePosition(newCurrentSlide));
				return newCurrentSlide;
			});
		}
	};

	const prevSlide = () => {
		if (currentSlide >= 0 || isLoop) {
			wrapperRef.current.style.transition = 'transform 0.2s ease-out';
			setCurrentSlide(prev => {
				const newCurrentSlide = prev - 1;
				setWrapperTranslate(getSlidePosition(newCurrentSlide));
				return newCurrentSlide;
			});
		}
	};

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

		setWrapperTranslate(prev => {
			const newTranslate = prev + dragMove;
			if (newTranslate > 1000000) {
				setCurrentSlide(0);
				return newTranslate - getSlidePosition(numberOfSlides);
			}
			return newTranslate;
		});
	};

	const onDragEnd = e => {
		if (isEditView) return;
		if (dragPosition - initPosition < -100) {
			nextSlide();
		} else if (dragPosition - initPosition > 100) {
			prevSlide();
		} else {
			wrapperRef.current.style.transition = 'transform 0.2s ease-out';
			setWrapperTranslate(getSlidePosition(currentSlide));
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

	const handleTransitionEnd = () => {
		wrapperRef.current.style.transition = '';
		if (currentSlide > numberOfSlides - 1) {
			setWrapperTranslate(0);
			setCurrentSlide(0);
		}
		if (currentSlide < 0) {
			setWrapperTranslate(getSlidePosition(numberOfSlides - 1));
			setCurrentSlide(numberOfSlides - 1);
		}
	};

	const deleteSlideClones = () => {
		const clones = document.getElementsByClassName(
			'maxi-slide-block--clone'
		);

		Array.from(clones).forEach(clone => clone.remove());
	};

	const getSlideClone = slideIndex => {
		const cloneId = `block-${Object.keys(slidesWidth)[slideIndex]}`;
		const clone = document.getElementById(cloneId);
		clone.classList.add('maxi-slide-block--clone');
		clone.id = `clone-${cloneId} clone-first-slide`;
		return clone;
	};

	const updateSlideClones = () => {
		if (isEmpty(slidesWidth)) return;

		deleteSlideClones();

		const newFirstChildClone = getSlideClone(0);
		const newLastChildClone = getSlideClone(
			Object.keys(slidesWidth).length - 1
		);

		wrapperRef.current.append(newFirstChildClone);
		wrapperRef.current.prepend(newLastChildClone);
		setRealFirstElOffset(
			Object.values(slidesWidth)[Object.keys(slidesWidth).length - 1]
		);
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
	}, [currentSlide, slidesWidth, isEditView]);

	useEffect(() => {
		if (wrapperTranslate !== getSlidePosition(currentSlide)) {
			setWrapperTranslate(getSlidePosition(currentSlide));
		}
	}, [slidesWidth, isLoop]);

	useEffect(() => {
		if (isLoop) {
			updateSlideClones();
		} else {
			deleteSlideClones();
		}
	}, [isLoop, slidesWidth]);

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
						onTransitionEnd: handleTransitionEnd,
					},
					{
						allowedBlocks: ALLOWED_BLOCKS,
						orientation: 'horizontal',
						template: TEMPLATE,
						...(!isEditView && { renderAppender: false }),
					}
				)}
			/>
			<div className='maxi-slider-block__nav'>
				<span
					className='maxi-slider-block__arrow maxi-slider-block__arrow--next'
					onClick={!isEditView ? () => nextSlide() : undefined}
				>
					+
				</span>
				<span
					className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'
					onClick={!isEditView ? () => prevSlide() : undefined}
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
		const { attributes, clientId, maxiSetAttributes } = this.props;
		const { numberOfSlides: prevNumberOfSlides } = attributes;
		const numberOfSlides =
			select('core/block-editor').getBlockCount(clientId);
		if (numberOfSlides !== prevNumberOfSlides) {
			maxiSetAttributes({ numberOfSlides });
		}
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
						<SliderWrapper
							{...this.props}
							slidesWidth={this.state.slidesWidth}
						/>
					</div>
				</MaxiBlock>
			</SliderContext.Provider>,
		];
	}
}

export default compose(withInstanceId, withMaxiProps)(edit);
