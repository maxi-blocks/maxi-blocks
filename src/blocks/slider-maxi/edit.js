/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	useRef,
	useState,
	useEffect,
	RawHTML,
	createRef,
	forwardRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { Toolbar } from '../../components';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';

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

const IconWrapper = forwardRef((props, ref) => {
	const { children, className } = props;

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
});

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
	const {
		slidesWidth,
		isEditView,
		numberOfSlides,
		attributes,
		uniqueID,
		deviceType,
		clientId,
	} = props;

	const { isLoop, isAutoplay, isHovered, pauseOnHover, pauseOnInteraction } =
		attributes;

	const sliderTransition = attributes['slider-transition'];
	const sliderTransitionSpeed = attributes['slider-transition-speed'];
	const sliderAutoplaySpeed = attributes['slider-autoplay-speed'];

	const ALLOWED_BLOCKS = ['maxi-blocks/slide-maxi'];
	const wrapperRef = useRef(null);
	const iconRef = createRef(null);
	const editor = document.querySelector('#editor');
	let initPosition = 0;
	let dragPosition = 0;
	const [currentSlide, setCurrentSlide] = useState(0);
	const [wrapperTranslate, setWrapperTranslate] = useState(0);
	const [realFirstSlideOffset, setRealFirstSlideOffset] = useState(0);

	const getSliderEffect = () => {
		let effect = '';

		switch (sliderTransition) {
			case 'slide':
				effect += 'transform';
				break;
			case 'fade':
				effect += 'maxiFade';
				break;
			default:
				effect += 'maxiSlide';
		}

		effect += ` ${sliderTransitionSpeed / 1000}s ease-out`;

		return effect;
	};

	const getSlidePosition = currentSlide => {
		if (currentSlide < 0)
			return (
				realFirstSlideOffset -
				Object.values(slidesWidth)
					.slice(currentSlide)
					.reduce((acc, cur) => acc + cur)
			);
		return (
			Object.values(slidesWidth)
				.slice(0, currentSlide)
				.reduce((acc, cur) => acc + cur, realFirstSlideOffset) ||
			realFirstSlideOffset
		);
	};

	const setActiveDot = dotNumber => {
		const dots = document.querySelectorAll(
			`.${uniqueID} .maxi-slider-block__dot`
		);

		[].forEach.call(dots, function removeActiveClass(el) {
			el.classList.remove('maxi-slider-block__dot--active');
		});
		const activeDot = document.querySelectorAll(
			`.${uniqueID} .maxi-slider-block__dot--${dotNumber}`
		)[0];

		activeDot?.classList.add('maxi-slider-block__dot--active');
	};

	const nextSlide = () => {
		if (currentSlide + 1 < numberOfSlides || isLoop || isAutoplay) {
			if (sliderTransition !== 'slide')
				wrapperRef.current.style.animation = getSliderEffect();
			else wrapperRef.current.style.transition = getSliderEffect();

			setCurrentSlide(prev => {
				return prev + 1;
			});

			setActiveDot(currentSlide + 1);
		}
	};

	const prevSlide = () => {
		if (currentSlide - 1 >= 0 || isLoop) {
			if (sliderTransition !== 'slide')
				wrapperRef.current.style.animation = getSliderEffect();
			else wrapperRef.current.style.transition = getSliderEffect();
			setCurrentSlide(next => {
				return next - 1;
			});

			setActiveDot(currentSlide - 1);
		}
	};

	const exactSlide = slideNumber => {
		if (sliderTransition !== 'slide')
			wrapperRef.current.style.animation = getSliderEffect();
		else wrapperRef.current.style.transition = getSliderEffect();
		setCurrentSlide(slideNumber);
		setActiveDot(slideNumber);
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

		setWrapperTranslate(prev => prev + dragMove);
	};

	const onDragEnd = e => {
		if (isEditView) return;
		if (dragPosition - initPosition < -100) {
			nextSlide();
		} else if (dragPosition - initPosition > 100) {
			prevSlide();
		} else {
			if (sliderTransition !== 'slide')
				wrapperRef.current.style.animation = getSliderEffect();
			else wrapperRef.current.style.transition = getSliderEffect();
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

	const handleEnd = () => {
		wrapperRef.current.style.animation = '';
		wrapperRef.current.style.transition = '';
		if (currentSlide >= numberOfSlides) {
			setCurrentSlide(0);
		}
		if (currentSlide < 0) {
			setCurrentSlide(numberOfSlides - 1);
		}
	};

	const deleteSlideClones = () => {
		const clones = wrapperRef.current.querySelectorAll(
			':scope > .maxi-slide-block--clone'
		);

		clones.forEach(clone => {
			clone.remove();
		});

		setRealFirstSlideOffset(0);
	};

	const getSlideClone = slideIndex => {
		const slide = wrapperRef.current.querySelectorAll(
			':scope > .maxi-slide-block:not(.maxi-slide-block--clone)'
		)[slideIndex];

		if (!slide) {
			const clone = document.createElement('li');
			clone.classList.add('maxi-slide-block--clone');
			return clone;
		}

		const clone = slide.cloneNode(true);
		clone.classList.add('maxi-slide-block--clone');
		clone.id = `clone-${slide.id}`;
		clone.setAttribute(
			'uniqueid',
			`clone-${slide.getAttribute('uniqueid')}`
		);
		return clone;
	};

	const insertSlideClones = numberOfClones => {
		for (let i = 0; i < numberOfClones; i += 1) {
			const backClone = getSlideClone(numberOfSlides - 1 - i);
			const frontClone = getSlideClone(i);

			wrapperRef.current.append(frontClone);
			wrapperRef.current.prepend(backClone);

			setRealFirstSlideOffset(
				prev =>
					prev + Object.values(slidesWidth)[numberOfSlides - 1 - i] ||
					prev
			);
		}
	};

	const updateSlideClones = numberOfClones => {
		if (
			isEmpty(slidesWidth) ||
			(currentSlide !== 0 && currentSlide !== numberOfSlides - 1)
		)
			return;

		deleteSlideClones();
		insertSlideClones(numberOfClones);
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
		if (wrapperTranslate !== getSlidePosition(currentSlide))
			setWrapperTranslate(getSlidePosition(currentSlide));
	}, [slidesWidth, isLoop, currentSlide]);

	useEffect(() => {
		if (isLoop) {
			updateSlideClones(Math.min(2, numberOfSlides));
		} else {
			deleteSlideClones();
		}
	}, [currentSlide, isLoop, isEditView, slidesWidth]);

	useEffect(() => {
		if (currentSlide >= numberOfSlides && numberOfSlides > 0) {
			setCurrentSlide(numberOfSlides - 1);
		}
	}, [numberOfSlides]);

	useEffect(() => {
		const isPaused = () => {
			if (isHovered && pauseOnHover) return true;
			if (pauseOnInteraction) return true;

			return false;
		};

		if (isAutoplay && !isPaused()) {
			const autoplayInterval = setInterval(() => {
				nextSlide();
			}, sliderAutoplaySpeed);
			return () => clearInterval(autoplayInterval);
		}
		return null;
	}, [
		isAutoplay,
		sliderAutoplaySpeed,
		isHovered,
		pauseOnHover,
		pauseOnInteraction,
	]);

	const classes = classnames(
		'maxi-slider-block__wrapper',
		isEditView && 'maxi-slider-block__wrapper--edit-view'
	);

	const navigationType = attributes[`navigation-type-${deviceType}`];

	const innerBlockCount = wp.data
		.select('core/block-editor')
		.getBlock(clientId).innerBlocks.length;

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
						onAnimationEnd: handleEnd,
						onTransitionEnd: handleEnd,
					},
					{
						allowedBlocks: ALLOWED_BLOCKS,
						orientation: 'horizontal',
						template: TEMPLATE,
						...(!isEditView && { renderAppender: false }),
					}
				)}
			/>
			{navigationType !== 'none' && (
				<div className='maxi-slider-block__nav'>
					{navigationType?.includes('arrow') &&
						attributes['navigation-arrow-first-icon-content'] && (
							<span
								className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'
								onClick={
									!isEditView ? () => prevSlide() : undefined
								}
							>
								<IconWrapper
									ref={iconRef}
									uniqueID={uniqueID}
									className='maxi-navigation-arrow-first-icon-block__icon'
								>
									<RawHTML>
										{
											attributes[
												'navigation-arrow-first-icon-content'
											]
										}
									</RawHTML>
								</IconWrapper>
							</span>
						)}
					{navigationType?.includes('arrow') &&
						attributes['navigation-arrow-second-icon-content'] && (
							<span
								className='maxi-slider-block__arrow maxi-slider-block__arrow--next'
								onClick={
									!isEditView ? () => nextSlide() : undefined
								}
							>
								<IconWrapper
									ref={iconRef}
									uniqueID={uniqueID}
									className='maxi-navigation-arrow-second-icon-block__icon'
								>
									<RawHTML>
										{
											attributes[
												'navigation-arrow-second-icon-content'
											]
										}
									</RawHTML>
								</IconWrapper>
							</span>
						)}
					{navigationType?.includes('dot') &&
						attributes['navigation-dot-icon-content'] && (
							<div className='maxi-slider-block__dots'>
								{Array.from(Array(innerBlockCount).keys()).map(
									i => {
										return (
											<span
												className={classnames(
													'maxi-slider-block__dot',
													`maxi-slider-block__dot--${i}`,
													i === 0 &&
														' maxi-slider-block__dot--active'
												)}
												key={`maxi-slider-block__dot--${i}`}
												onClick={
													!isEditView
														? () => exactSlide(i)
														: undefined
												}
											>
												<IconWrapper
													ref={iconRef}
													uniqueID={uniqueID}
													className='maxi-navigation-dot-icon-block__icon'
												>
													<RawHTML>
														{
															attributes[
																'navigation-dot-icon-content'
															]
														}
													</RawHTML>
												</IconWrapper>
											</span>
										);
									}
								)}
							</div>
						)}
				</div>
			)}
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

		this.iconRef = createRef(null);
	}

	get getStylesObject() {
		return getStyles(
			this.props.attributes,
			this.props.deviceType,
			this.props.clientId
		);
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
				copyPasteMapping={copyPasteMapping}
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
						const newSlidesWidth = { ...this.state.slidesWidth };
						delete newSlidesWidth[id];
						this.setState({
							slidesWidth: newSlidesWidth,
						});
					},
				}}
			>
				<MaxiBlock
					key={`maxi-slider--${uniqueID}`}
					ref={this.blockRef}
					classes={emptySliderClass}
					{...getMaxiBlockAttributes(this.props)}
				>
					<div className='maxi-slider-block__tracker'>
						<SliderWrapper
							{...this.props}
							{...this.state}
							{...this.iconRef}
							uniqueID={uniqueID}
						/>
					</div>
				</MaxiBlock>
			</SliderContext.Provider>,
		];
	}
}

export default compose(withInstanceId, withMaxiProps)(edit);
