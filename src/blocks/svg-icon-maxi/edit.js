/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { createRef } from '@wordpress/element';
import { withSelect, withDispatch, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getResizerSize,
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { Toolbar, BlockResizer, RawHTML } from '../../components';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import MaxiBlock from '../../components/maxi-block';
import MaxiModal from '../../editor/library/modal';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty, uniqueId } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

	maxiBlockDidUpdate(prevProps) {
		const { updateBlockAttributes } = dispatch('core/block-editor');
		const svgCode = this.props.attributes.content;

		if (prevProps.attributes.uniqueID !== this.props.attributes.uniqueID) {
			const svgClass = svgCode.match(/ class="(.+?(?=))"/)[1];
			const newSvgClass = `${svgClass}__${uniqueId()}`;
			const replaceIt = `${svgClass}`;

			const finalSvgCode = svgCode.replaceAll(replaceIt, newSvgClass);

			updateBlockAttributes(this.props.clientId, {
				content: finalSvgCode,
			});
		}

		if (this.resizableObject.current) {
			const svgWidth = getLastBreakpointAttribute({
				target: 'svg-width',
				breakpoint: this.props.deviceType || 'general',
				attributes: this.props.attributes,
			});
			const svgWidthUnit = getLastBreakpointAttribute({
				target: 'svg-width-unit',
				breakpoint: this.props.deviceType || 'general',
				attributes: this.props.attributes,
			});
			const fullWidthValue = `${svgWidth}${svgWidthUnit}`;

			if (this.resizableObject.current.state.width !== fullWidthValue) {
				this.resizableObject.current.updateSize({
					width: fullWidthValue,
				});

				let newContent = svgCode
					.replace('height="64px"', '')
					.replace('width="64px"', '');

				if (newContent.indexOf('viewBox') === -1) {
					const changeTo = ' viewBox="0 0 64 64"><defs>';
					newContent = newContent.replace(/><defs>/, changeTo);
				}

				if (!isEmpty(newContent))
					this.props.maxiSetAttributes({
						content: newContent,
					});
			}
		}
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		isOpen: false,
	};

	render() {
		const {
			attributes,
			clientId,
			deviceType,
			maxiSetAttributes,
			isSelected,
		} = this.props;
		const {
			blockFullWidth,
			content,
			openFirstTime,
			parentBlockStyle,
			uniqueID,
			[`svg-width-unit-${deviceType}`]: svgWidthUnit,
		} = attributes;

		const isEmptyContent = isEmpty(content);
		const handleOnResizeStop = (event, direction, elt) => {
			// Return SVG element its CSS width
			elt.querySelector('svg').style.width = null;

			maxiSetAttributes({
				[`svg-width-${deviceType}`]: getResizerSize(
					elt,
					this.blockRef,
					svgWidthUnit
				),
			});
		};

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

		return [
			!isEmptyContent && (
				<Inspector
					key={`block-settings-${uniqueID}`}
					{...this.props}
					resizableObject={this.resizableObject}
				/>
			),
			!isEmptyContent && (
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					propsToAvoid={['resizableObject']}
					resizableObject={this.resizableObject}
					{...this.props}
				/>
			),
			<MaxiBlock
				key={`maxi-svg-icon--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				{...getMaxiBlockAttributes(this.props)}
			>
				<>
					<MaxiModal
						clientId={clientId}
						type='svg'
						empty={isEmptyContent}
						style={parentBlockStyle}
						openFirstTime={isSelected ? openFirstTime : false}
						onOpen={obj => maxiSetAttributes(obj)}
						onSelect={obj => maxiSetAttributes(obj)}
						onRemove={obj => maxiSetAttributes(obj)}
					/>
					{!isEmptyContent && (
						<BlockResizer
							className='maxi-svg-icon-block__icon'
							resizableObject={this.resizableObject}
							isOverflowHidden={getIsOverflowHidden()}
							lockAspectRatio
							maxWidth={
								getLastBreakpointAttribute({
									target: 'svg-responsive',
									breakpoint: deviceType,
									attributes,
								})
									? '100%'
									: null
							}
							size={{
								width: getLastBreakpointAttribute(
									'svg-width',
									deviceType || 'general',
									attributes
								),
							}}
							showHandle={isSelected}
							enable={{
								topRight: true,
								bottomRight: true,
								bottomLeft: true,
								topLeft: true,
							}}
							onResizeStop={handleOnResizeStop}
						>
							<RawHTML>{content}</RawHTML>
						</BlockResizer>
					)}
				</>
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

const editDispatch = withDispatch((dispatch, ownProps) => {
	const {
		attributes: { content },
		maxiSetAttributes,
	} = ownProps;

	const changeSVGStrokeWidth = width => {
		if (width) {
			const regexLineToChange = new RegExp('stroke-width:.+?(?=})', 'g');
			const changeTo = `stroke-width:${width}`;

			const regexLineToChange2 = new RegExp(
				'stroke-width=".+?(?=")',
				'g'
			);
			const changeTo2 = `stroke-width="${width}`;

			const newContent = content
				.replace(regexLineToChange, changeTo)
				.replace(regexLineToChange2, changeTo2);

			maxiSetAttributes({
				content: newContent,
			});
		}
	};

	const changeSVGContentWithBlockStyle = (fillColor, strokeColor) => {
		const fillRegExp = new RegExp('fill:([^none])([^\\}]+)', 'g');
		const fillStr = `fill:${fillColor}`;

		const fillRegExp2 = new RegExp('fill=[^-]([^none])([^\\"]+)', 'g');
		const fillStr2 = ` fill="${fillColor}`;

		const strokeRegExp = new RegExp('stroke:([^none])([^\\}]+)', 'g');
		const strokeStr = `stroke:${strokeColor}`;

		const strokeRegExp2 = new RegExp('stroke=[^-]([^none])([^\\"]+)', 'g');
		const strokeStr2 = ` stroke="${strokeColor}`;

		const newContent = ownProps.attributes.content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2)
			.replace(strokeRegExp, strokeStr)
			.replace(strokeRegExp2, strokeStr2);

		maxiSetAttributes({ content: newContent });
	};

	const changeSVGContent = (color, type) => {
		const fillRegExp = new RegExp(`${type}:([^none])([^\\}]+)`, 'g');
		const fillStr = `${type}:${color}`;

		const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
		const fillStr2 = ` ${type}="${color}`;

		const newContent = ownProps.attributes.content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2);

		maxiSetAttributes({ content: newContent });
	};

	return {
		changeSVGStrokeWidth,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
	};
});

export default compose(editSelect, withMaxiProps, editDispatch)(edit);
