/**
 * WordPress dependencies
 */
import { createRef, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockResizer, Toolbar } from '../../components';
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';
import {
	getResizerSize,
	MaxiBlockComponent,
	withMaxiProps,
} from '../../extensions/maxi-block';
import Inspector from './inspector';

import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { getIsOverflowHidden } from '../../extensions/styles';
import { getBreakpoints } from '../../extensions/styles/helpers';
import { copyPasteMapping } from './data';
import getStyles from './styles';

/**
 * External dependencies
 */
import { round } from 'lodash';

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
				target: 'nc_w',
				breakpoint: this.props.deviceType || 'general',
				attributes: this.props.attributes,
			});
			const svgWidthUnit = getLastBreakpointAttribute({
				target: 'nc_w.u',
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
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: attributes,
		});

		const response = {
			number_counter: {
				[uniqueID]: {
					...getGroupAttributes(attributes, 'numberCounter'),
					breakpoints: { ...getBreakpoints(attributes) },
				},
			},
		};

		return response;
	}

	render() {
		const { attributes, maxiSetAttributes, deviceType, isSelected } =
			this.props;
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: attributes,
		});

		const classes = 'maxi-number-counter-block';

		const handleOnResizeStop = (event, direction, elt) => {
			const widthUnit = getLastBreakpointAttribute({
				target: 'nc_w.u',
				breakpoint: deviceType,
				attributes,
			});

			maxiSetAttributes({
				[`nc_w-${deviceType}`]: getResizerSize(
					elt,
					this.blockRef,
					widthUnit
				),
			});
		};

		const handleReset = () => this.resetNumberHelper();

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				prefix='nc-'
				{...this.props}
				resetNumberHelper={handleReset}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-number-counter--${uniqueID}`}
				ref={this.blockRef}
				className={classes}
				{...getMaxiBlockAttributes(this.props)}
			>
				<NumberCounter
					{...getGroupAttributes(attributes, [
						'numberCounter',
						'overflow',
					])}
					{...getGroupAttributes(attributes, 'size', false, 'nc-')}
					resizerProps={{
						onResizeStop: handleOnResizeStop,
						resizableObject: this.resizableObject,
						showHandle:
							isSelected &&
							!getLastBreakpointAttribute({
								target: 'nc_wa',
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
		nc_du: countDuration,
		nc_str: stroke,
		'nc_ci.s': circleStatus,
		nc_pr: preview,
		'nc_psi.s': usePercentage,
		nc_sta: startNumber,
		nc_e: endNumber,
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
	}, [count, replayStatus, preview, endCountValue]);

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replayStatus) {
			setCount(startCountValue);
			startTimeRef.current = Date.now();
			if (count >= endCountValue) {
				setReplayStatus(false);
			}
		}
	}, [
		startCountValue,
		replayStatus,
		endCountValue,
		countDuration,
		radius,
		stroke,
	]);

	const getResizerSize = () => {
		return {
			width: circleStatus
				? 'auto'
				: getLastBreakpointAttribute({
						target: 'nc_wa',
						breakpoint: deviceType,
						attributes,
				  })
				? '100%'
				: `${getLastBreakpointAttribute({
						target: 'nc_w',
						breakpoint: deviceType,
						attributes,
				  })}${getLastBreakpointAttribute({
						target: 'nc_w.u',
						breakpoint: deviceType,
						attributes,
				  })}`,
		};
	};

	const fontSize = getLastBreakpointAttribute({
		target: 'nc-ti_fs',
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
						strokeLinecap={attributes.ncrs ? 'round' : ''}
						strokeDasharray={`${Math.ceil(
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
						{`${round((count / 360) * 100)}`}
						{usePercentage && (
							<tspan baselineShift='super'>%</tspan>
						)}
					</text>
				</svg>
			)}
			{circleStatus && (
				<span className='maxi-number-counter__box__text'>
					{`${round((count / 360) * 100)}`}
					{usePercentage && <sup>%</sup>}
				</span>
			)}
		</BlockResizer>
	);
};

export default withMaxiProps(edit);
