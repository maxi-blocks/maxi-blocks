/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getResizerSize,
	MaxiBlockComponent,
	withMaxiProps,
	getMaxiBlockAttributes,
} from '../../extensions/maxi-block';
import { BlockResizer, Button, Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';

import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { round } from 'lodash';

/**
 * Icons
 */
import { replay } from '../../icons';

/**
 * NumberCounter
 */

const NumberCounter = attributes => {
	const {
		'number-counter-duration': countDuration,
		'number-counter-stroke': stroke,
		'number-counter-circle-status': circleStatus,
		'number-counter-preview': preview,
		'number-counter-title-font-size': fontSize,
		'number-counter-percentage-sign-status': usePercentage,
		'number-counter-start': startNumber,
		'number-counter-end': endNumber,
		deviceType,
		resizerProps,
	} = attributes;

	const countRef = useRef(null);

	const startCountValue = Math.ceil((startNumber * 360) / 100);
	const endCountValue = Math.ceil((endNumber * 360) / 100);
	const radius = 90;

	const [count, setCount] = useState(startCountValue);
	const [replyStatus, setReplyStatus] = useState(false);

	const circumference = 2 * Math.PI * radius;

	const frameDuration =
		(1 / ((endCountValue - startCountValue) / countDuration)) * 1000;

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replyStatus) {
			if (count >= endCountValue) {
				setCount(endCountValue);
				return;
			}

			countRef.current = setInterval(() => {
				setCount(count + 1);
			}, frameDuration);

			// eslint-disable-next-line consistent-return
			return () => clearInterval(countRef.current);
		}
	}, [count, replyStatus, preview, endCountValue]);

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replyStatus) {
			if (count >= endCountValue) {
				setCount(startCountValue);
				setReplyStatus(false);
				clearInterval(countRef.current);
			}
		}
	}, [
		startCountValue,
		replyStatus,
		endCountValue,
		countDuration,
		radius,
		stroke,
	]);

	const getIsOverflowHidden = () =>
		getLastBreakpointAttribute({
			target: 'overflow-y',
			breakpoint: deviceType,
			attributes,
		}) === 'hidden' &&
		getLastBreakpointAttribute({
			target: 'overflow-x',
			breakpoint: deviceType,
			attributes,
		}) === 'hidden';

	return (
		<>
			<Button
				className='maxi-number-counter__replay'
				onClick={() => {
					setCount(startCountValue);
					setReplyStatus(true);
					clearInterval(countRef.current);
				}}
				icon={replay}
			/>
			<BlockResizer
				className='maxi-number-counter__box'
				isOverflowHidden={getIsOverflowHidden()}
				lockAspectRatio
				defaultSize={{
					width: `${getLastBreakpointAttribute({
						target: 'number-counter-width',
						breakpoint: deviceType,
						attributes,
					})}${getLastBreakpointAttribute({
						target: 'number-counter-width-unit',
						breakpoint: deviceType,
						attributes,
					})}`,
				}}
				maxWidth='100%'
				minWidth={
					!circleStatus
						? `${
								fontSize * (endCountValue.toString().length - 1)
						  }px`
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
							strokeDasharray={`${parseInt(
								(count / 360) * circumference
							)} ${circumference}`}
						/>
						<text
							className='maxi-number-counter__box__text'
							textAnchor='middle'
							x='50%'
							y='50%'
							dy={`${round(fontSize / 4, 2)}px`}
						>
							{`${parseInt((count / 360) * 100)}`}
							{usePercentage && (
								<tspan baselineShift='super'>%</tspan>
							)}
						</text>
					</svg>
				)}
				{circleStatus && (
					<span className='maxi-number-counter__box__text'>
						{`${parseInt((count / 360) * 100)}`}
						{usePercentage && <sup>%</sup>}
					</span>
				)}
			</BlockResizer>
		</>
	);
};

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

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
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			number_counter: {
				[uniqueID]: {
					...getGroupAttributes(attributes, 'numberCounter'),
				},
			},
		};

		return response;
	}

	render() {
		const { attributes, maxiSetAttributes, deviceType, isSelected } =
			this.props;
		const { uniqueID, blockFullWidth } = attributes;

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

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-number-counter--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				className={classes}
				{...getMaxiBlockAttributes(this.props)}
			>
				<NumberCounter
					{...getGroupAttributes(attributes, [
						'numberCounter',
						'size',
					])}
					resizerProps={{
						onResizeStop: handleOnResizeStop,
						resizableObject: this.resizableObject,
						showHandle: isSelected,
					}}
					deviceType={deviceType}
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
