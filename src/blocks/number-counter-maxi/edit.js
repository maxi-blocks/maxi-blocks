/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { useState, useEffect, useRef, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	BlockResizer,
	Button,
	MaxiBlockComponent,
	Toolbar,
} from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

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
		deviceType,
		resizerProps,
	} = attributes;

	const countRef = useRef(null);

	const startCountValue = Math.ceil(
		(attributes['number-counter-start'] * 360) / 100
	);
	const endCountValue = Math.ceil(
		(attributes['number-counter-end'] * 360) / 100
	);
	const radius = 90;

	const [count, setCount] = useState(startCountValue);
	const [replyStatus, setReplyStatus] = useState(false);

	const circumference = 2 * Math.PI * radius;

	const frameDuration = countDuration / 60;

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replyStatus) {
			if (count >= endCountValue) {
				setCount(endCountValue);
				return;
			}

			countRef.current = setInterval(() => {
				setCount(count + 1);
			}, frameDuration);

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
				lockAspectRatio
				size={{
					width: `${getLastBreakpointAttribute(
						'width',
						deviceType,
						attributes
					)}${getLastBreakpointAttribute(
						'width-unit',
						deviceType,
						attributes
					)}`,
				}}
				defaultSize={{
					width: `${getLastBreakpointAttribute(
						'width',
						deviceType,
						attributes
					)}${getLastBreakpointAttribute(
						'width-unit',
						deviceType,
						attributes
					)}`,
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
					</svg>
				)}
				<span className='maxi-number-counter__box__text'>
					{`${parseInt((count / 360) * 100)}`}

					{attributes['number-counter-percentage-sign-status'] && (
						<sup>
							{attributes['number-counter-percentage-sign-status']
								? '%'
								: ''}
						</sup>
					)}
				</span>
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
			const svgWidth = getLastBreakpointAttribute(
				'width',
				this.props.deviceType || 'general',
				this.props.attributes
			);
			const svgWidthUnit = getLastBreakpointAttribute(
				'width-unit',
				this.props.deviceType || 'general',
				this.props.attributes
			);

			if (this.resizableObject.current.state.width !== `${svgWidth}%`)
				this.resizableObject.current.updateSize({
					width: `${svgWidth}${svgWidthUnit}`,
				});
		}
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;

		return {
			...{
				...getGroupAttributes(attributes, 'numberCounter'),
			},
		};
	}

	render() {
		const { attributes, setAttributes, deviceType, isSelected } =
			this.props;
		const { uniqueID, blockFullWidth } = attributes;

		const classes = 'maxi-number-counter-block';

		const handleOnResizeStart = event => {
			event.preventDefault();

			setAttributes({
				[`width-unit-${deviceType}`]: 'px',
			});
		};

		const handleOnResizeStop = (event, direction, elt) => {
			setAttributes({
				[`width-${deviceType}`]: elt.getBoundingClientRect().width,
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
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<NumberCounter
					{...getGroupAttributes(attributes, [
						'numberCounter',
						'size',
					])}
					resizerProps={{
						onResizeStart: handleOnResizeStart,
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

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

export default compose(editSelect)(edit);
