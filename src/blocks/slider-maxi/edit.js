/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { compose, withInstanceId } from '@wordpress/compose';
import { useRef, useState, useEffect, RawHTML } from '@wordpress/element';
import { dispatch, select, useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import SliderContext from './context';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { withMaxiContextLoop } from '@extensions/DC';
import getStyles from './styles';
import { copyPasteMapping } from './data';
import TEMPLATE from './template';

/**
 * Edit
 */

const SliderWrapper = props => {
	const {
		slidesWidth,
		isEditView,
		attributes,
		clientId,
		isSelected,
		maxiSetAttributes,
		currentSlide,
		setCurrentSlide,
	} = props;
	const {
		isLoop,
		'slider-transition': sliderTransition,
		'slider-transition-speed': sliderTransitionSpeed,
	} = attributes;

	const numberOfClones = 2;
	const numberOfSlides = useSelect(
		select =>
			select('core/block-editor').getBlock(clientId).innerBlocks.length,
		[clientId]
	);

	const [wrapperTranslate, setWrapperTranslate] = useState(0);
	const [realFirstSlideOffset, setRealFirstSlideOffset] = useState(0);
	const ALLOWED_BLOCKS = ['maxi-blocks/slide-maxi'];
	const wrapperRef = useRef(null);
	const iconRef = useRef(null);
	const editor = document.querySelector('#editor');
	let initPosition = 0;
	let dragPosition = 0;

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

	const addSliderTransition = () => {
		const property =
			sliderTransition === 'slide' ? 'transition' : 'animation';
		wrapperRef.current.style[property] = getSliderEffect();
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

	const exactSlide = slideNumber => {
		addSliderTransition();
		setCurrentSlide(slideNumber);
	};

	const nextSlide = () => {
		if (currentSlide + 1 < numberOfSlides || isLoop) {
			exactSlide(currentSlide + 1);
			if (!isSelected)
				dispatch('core/block-editor').selectBlock(clientId);
		} else {
			setWrapperTranslate(getSlidePosition(currentSlide));
		}
	};

	const prevSlide = () => {
		if (currentSlide - 1 >= 0 || isLoop) {
			exactSlide(currentSlide - 1);
			if (!isSelected)
				dispatch('core/block-editor').selectBlock(clientId);
		} else {
			setWrapperTranslate(getSlidePosition(currentSlide));
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

		setWrapperTranslate(prev => prev + dragMove);
	};

	const onDragEnd = e => {
		if (isEditView) return;
		if (dragPosition - initPosition < -100) {
			nextSlide();
		} else if (dragPosition - initPosition > 100) {
			prevSlide();
		} else {
			addSliderTransition();
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

		clones.forEach(clone => clone.remove());

		setRealFirstSlideOffset(0);
	};

	const getSlideClone = slideIndex => {
		const slide = wrapperRef.current.querySelectorAll(
			':scope > .maxi-slide-block:not(.maxi-slide-block--clone)'
		)[slideIndex];

		if (!slide) {
			const clone = document.createElement('li');
			clone.classList.add('maxi-slide-block', 'maxi-slide-block--clone');
			return clone;
		}

		const clone = slide.cloneNode(true);
		clone.classList.add('maxi-slide-block--clone');
		clone.setAttribute('data-slide-active', true);

		const cleanClone = clone => {
			clone.removeAttribute('uniqueid');
			clone.removeAttribute('data-block');
			clone.id = `clone-${clone.id}`;
		};

		cleanClone(clone);
		Array.from(clone.children).forEach(child => {
			cleanClone(child);
		});

		return clone;
	};

	const insertSlideClones = numberOfClones => {
		for (let i = 0; i < numberOfClones; i += 1) {
			const backClone = getSlideClone(numberOfSlides - 1 - i);
			const frontClone = getSlideClone(i);
			backClone.id = `back-${backClone.id}`;
			frontClone.id = `front-${frontClone.id}`;

			wrapperRef.current.append(frontClone);
			wrapperRef.current.prepend(backClone);

			setRealFirstSlideOffset(
				prev => prev + backClone.offsetWidth || prev
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
	}, [
		currentSlide,
		slidesWidth,
		isEditView,
		realFirstSlideOffset,
		isSelected,
		numberOfSlides,
	]);

	useEffect(() => {
		if (wrapperTranslate !== getSlidePosition(currentSlide))
			setWrapperTranslate(getSlidePosition(currentSlide));
	}, [slidesWidth, isLoop, currentSlide, realFirstSlideOffset]);

	useEffect(() => {
		if (isLoop && !isEditView) {
			updateSlideClones(numberOfClones);
		} else {
			deleteSlideClones();
		}
	}, [currentSlide, isLoop, isEditView, slidesWidth]);

	useEffect(() => {
		maxiSetAttributes({ numberOfSlides });
	}, [numberOfSlides]);

	const classes = classnames(
		'maxi-slider-block__wrapper',
		isEditView && 'maxi-slider-block__wrapper--edit-view'
	);

	const navClasses = classnames(
		'maxi-slider-block__nav',
		isEditView && 'maxi-slider-block__nav--edit-view'
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
			<div className={navClasses}>
				{attributes['navigation-arrow-first-icon-content'] && (
					<span
						className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'
						onClick={!isEditView ? () => prevSlide() : undefined}
					>
						<div
							ref={iconRef}
							className='maxi-navigation-arrow-first-icon-block__icon'
						>
							<RawHTML>
								{
									attributes[
										'navigation-arrow-first-icon-content'
									]
								}
							</RawHTML>
						</div>
					</span>
				)}
				{attributes['navigation-arrow-second-icon-content'] && (
					<span
						className='maxi-slider-block__arrow maxi-slider-block__arrow--next'
						onClick={!isEditView ? () => nextSlide() : undefined}
					>
						<div
							ref={iconRef}
							className='maxi-navigation-arrow-second-icon-block__icon'
						>
							<RawHTML>
								{
									attributes[
										'navigation-arrow-second-icon-content'
									]
								}
							</RawHTML>
						</div>
					</span>
				)}
				{attributes['navigation-dot-icon-content'] && (
					<div className='maxi-slider-block__dots'>
						{Array.from(Array(numberOfSlides).keys()).map(i => {
							return (
								<span
									className={classnames(
										'maxi-slider-block__dot',
										`maxi-slider-block__dot--${i}`,
										i === currentSlide &&
											' maxi-slider-block__dot--active'
									)}
									key={`maxi-slider-block__dot--${i}`}
									onClick={
										!isEditView
											? () => exactSlide(i)
											: undefined
									}
								>
									<div
										ref={iconRef}
										className='maxi-navigation-dot-icon-block__icon'
									>
										<RawHTML>
											{
												attributes[
													'navigation-dot-icon-content'
												]
											}
										</RawHTML>
									</div>
								</span>
							);
						})}
					</div>
				)}
			</div>
		</>
	);
};

class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state = {
			slidesWidth: {},
			sliderWidth: null,
			isEditView: false,
			currentSlide: 0,
		};
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

	maxiBlockDidMount() {
		this.resizeObserver = new ResizeObserver(entries => {
			entries.forEach(entry => {
				const { width } = entry.contentRect;

				if (width !== this.state.width) {
					this.setState({ width });
				}
			});
		});

		this.resizeObserver.observe(this.blockRef.current);
	}

	maxiBlockWillUnMount() {
		this.resizeObserver.disconnect();
	}

	render() {
		const { attributes, hasInnerBlocks } = this.props;
		const { uniqueID } = attributes;

		const emptySliderClass = `maxi-slide-block__${
			hasInnerBlocks ? 'has-innerBlock' : 'empty'
		}`;
		const inlineStylesTargets = {
			dot: '.maxi-slider-block__dot:not(.maxi-slider-block__dot--active)',
			dotActive: '.maxi-slider-block__dot--active',
			arrow: '.maxi-slider-block__arrow',
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				{...this.state}
				inlineStylesTargets={inlineStylesTargets}
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
					selected: this.state.currentSlide,
					onSelect: clientId => {
						const { getBlockIndex } = select('core/block-editor');
						this.setState({
							currentSlide: getBlockIndex(clientId),
						});
					},
					// Used to force render on slides when slider width changes, to update slidesWidth
					sliderWidth: this.state.sliderWidth,
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
							setCurrentSlide={newCurrentSlide =>
								this.setState({ currentSlide: newCurrentSlide })
							}
							uniqueID={uniqueID}
						/>
					</div>
				</MaxiBlock>
			</SliderContext.Provider>,
		];
	}
}

export default withMaxiContextLoop(
	compose(withInstanceId, withMaxiProps)(edit)
);
