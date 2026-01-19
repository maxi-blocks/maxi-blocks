/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef, createRef } from '@wordpress/element';

/**
 * External dependencies
 */
import { round } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';

import {
	getResizerSize,
	MaxiBlockComponent,
	withMaxiProps,
} from '@extensions/maxi-block';
import { BlockResizer, Toolbar } from '@components';
import { getMaxiBlockAttributes, MaxiBlock } from '@components/maxi-block';

import {
	getGroupAttributes,
	getIsOverflowHidden,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import getStyles from './styles';
import { getBreakpoints } from '@extensions/styles/helpers';
import { copyPasteMapping } from './data';
import withMaxiDC from '@extensions/DC/withMaxiDC';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

	resetNumberHelper;

	maxiBlockDidUpdate() {
		if (this.resizableObject.current) {
			const svgWidth = getLastBreakpointAttribute({
				target: 'number-counter-width',
				breakpoint: this.props.deviceType || 'general',
				attributes: this.props.attributes,
			});
			const svgWidthUnit = getLastBreakpointAttribute({
				target: 'number-counter-width-unit',
				breakpoint: this.props.deviceType || 'general',
				attributes: this.props.attributes,
			});
			const fullWidthValue = `${svgWidth}${svgWidthUnit}`;

			if (this.resizableObject.current.state.width !== fullWidthValue)
				this.resizableObject.current.updateSize({
					width: fullWidthValue,
				});
		}

		if (!this.resetNumberHelper) this.forceUpdate();
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			[uniqueID]: {
				...getGroupAttributes(attributes, 'numberCounter'),
				breakpoints: { ...getBreakpoints(attributes) },
			},
		};

		return response;
	}

	render() {
		const { attributes, maxiSetAttributes, deviceType, isSelected } =
			this.props;
		const { uniqueID } = attributes;

		const classes = 'maxi-number-counter-block';

		const handleOnResizeStop = (event, direction, elt) => {
			const widthUnit = getLastBreakpointAttribute({
				target: 'number-counter-width-unit',
				breakpoint: deviceType,
				attributes,
			});

			maxiSetAttributes({
				[`number-counter-width-${deviceType}`]: getResizerSize(
					elt,
					this.blockRef,
					widthUnit
				),
			});
		};

		const handleReset = () => this.resetNumberHelper();

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				setShowLoader={value => this.setState({ showLoader: value })}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				prefix='number-counter-'
				{...this.props}
				resetNumberHelper={handleReset}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-number-counter--${uniqueID}`}
				ref={this.blockRef}
				className={classes}
				showLoader={this.state.showLoader}
				{...getMaxiBlockAttributes(this.props)}
			>
				<NumberCounter
					{...getGroupAttributes(attributes, 'numberCounter')}
					{...getGroupAttributes(attributes, 'overflow')}
					{...getGroupAttributes(
						attributes,
						'size',
						false,
						'number-counter-'
					)}
					resizerProps={{
						onResizeStop: handleOnResizeStop,
						resizableObject: this.resizableObject,
						showHandle:
							isSelected &&
							!getLastBreakpointAttribute({
								target: 'number-counter-width-auto',
								breakpoint: deviceType,
								attributes,
							}),
					}}
					deviceType={deviceType}
					blockRef={this.blockRef}
					isSelected={isSelected}
					uniqueID={uniqueID}
					replayCounter={fn => {
						this.resetNumberHelper = fn;
					}}
				/>
			</MaxiBlock>,
		];
	}
}

/**
 * NumberCounter
 */
const NumberCounter = attributes => {
	const {
		'number-counter-duration': countDuration,
		'number-counter-stroke': stroke,
		'number-counter-circle-status': circleStatus,
		'number-counter-preview': preview,
		'number-counter-percentage-sign-status': usePercentage,
		'number-counter-percentage-sign-position-status': centeredPercentage,
		'number-counter-start': startNumber,
		'number-counter-end': endNumber,
		deviceType,
		resizerProps,
		replayCounter,
	} = attributes;
	const startTimeRef = useRef(Date.now());
	const startCountValue = Math.ceil((startNumber * 360) / 100);
	const endCountValue = Math.ceil((endNumber * 360) / 100);
	const radius = 90;

	const [count, setCount] = useState(startCountValue);
	const [replayStatus, setReplayStatus] = useState(false);

	const circumference = 2 * Math.PI * radius;

	const frameDuration =
		(1 / ((endCountValue - startCountValue) / countDuration)) * 1000;

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replayStatus) {
			if (count >= endCountValue) {
				setCount(endCountValue);
			} else {
				requestAnimationFrame(function animate() {
					const newCount =
						startCountValue +
						parseInt(
							(Date.now() - startTimeRef.current) / frameDuration
						);
					newCount === count
						? requestAnimationFrame(animate)
						: setCount(
								newCount > endCountValue
									? endCountValue
									: newCount
						  );
				});
			}
		}
	}, [
		count,
		replayStatus,
		preview,
		endCountValue,
		frameDuration,
		startCountValue,
	]);

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replayStatus) {
			setCount(startCountValue);
			startTimeRef.current = Date.now();
			if (count >= endCountValue) {
				setReplayStatus(false);
			}
		}
	}, [startCountValue, replayStatus, endCountValue, preview, count]);

	const getResizerSize = () => {
		return {
			width: circleStatus
				? 'auto'
				: getLastBreakpointAttribute({
						target: 'number-counter-width-auto',
						breakpoint: deviceType,
						attributes,
				  })
				? '100%'
				: `${getLastBreakpointAttribute({
						target: 'number-counter-width',
						breakpoint: deviceType,
						attributes,
				  })}${getLastBreakpointAttribute({
						target: 'number-counter-width-unit',
						breakpoint: deviceType,
						attributes,
				  })}`,
		};
	};

	const fontSize = getLastBreakpointAttribute({
		target: 'number-counter-title-font-size',
		breakpoint: deviceType,
		attributes,
	});

	replayCounter(() => {
		setCount(startCountValue);
		startTimeRef.current = Date.now();
		setReplayStatus(true);
	});
	return (
		<BlockResizer
			className='maxi-number-counter__box'
			isOverflowHidden={getIsOverflowHidden(attributes, deviceType)}
			lockAspectRatio
			deviceType={deviceType}
			size={getResizerSize()}
			maxWidth='100%'
			minWidth={
				!circleStatus
					? `${fontSize * (endCountValue.toString().length - 1)}px`
					: `${fontSize}px`
			}
			minHeight={circleStatus && `${fontSize}px`}
			enable={{
				topRight: true,
				bottomRight: true,
				bottomLeft: true,
				topLeft: true,
			}}
			{...resizerProps}
			showHandle={!circleStatus ? resizerProps.showHandle : false}
		>
			{!circleStatus && (
				<div className='maxi-number-counter__box__container'>
					<svg
						viewBox={`0 0 ${radius * 2 + stroke} ${
							radius * 2 + stroke
						}`}
					>
						<circle
							className='maxi-number-counter__box__background'
							strokeWidth={stroke}
							fill='none'
							cx={radius + stroke / 2}
							cy={radius + stroke / 2}
							r={radius}
						/>
						<circle
							className='maxi-number-counter__box__circle'
							strokeWidth={stroke}
							fill='none'
							cx={radius + stroke / 2}
							cy={radius + stroke / 2}
							r={radius}
							strokeLinecap={
								attributes['number-counter-rounded-status']
									? 'round'
									: ''
							}
							strokeDasharray={`${Math.ceil(
								(count / 360) * circumference
							)} ${circumference}`}
						/>
					</svg>
					<span className='maxi-number-counter__box__text'>
						{`${round((count / 360) * 100)}`}
						{usePercentage &&
							(centeredPercentage ? '%' : <sup>%</sup>)}
					</span>
				</div>
			)}
			{circleStatus && (
				<span className='maxi-number-counter__box__text circle-hidden'>
					{`${round((count / 360) * 100)}`}
					{usePercentage && (centeredPercentage ? '%' : <sup>%</sup>)}
				</span>
			)}
		</BlockResizer>
	);
};

export default withMaxiDC(withMaxiProps(edit));
