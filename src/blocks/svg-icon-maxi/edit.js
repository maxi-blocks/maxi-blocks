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
	MaxiBlockComponent,
	Toolbar,
	BlockResizer,
	RawHTML,
} from '../../components';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
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
			const svgWidth = getLastBreakpointAttribute(
				'svg-width',
				this.props.deviceType || 'general',
				this.props.attributes
			);
			const svgWidthUnit = getLastBreakpointAttribute(
				'svg-width-unit',
				this.props.deviceType || 'general',
				this.props.attributes
			);

			if (this.resizableObject.current.state.width !== `${svgWidth}%`) {
				const fullWidthValue = `${svgWidth}${svgWidthUnit}`;
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
					this.props.setAttributes({
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
		const { attributes, clientId, deviceType, setAttributes, isSelected } =
			this.props;
		const {
			blockFullWidth,
			content,
			openFirstTime,
			parentBlockStyle,
			uniqueID,
		} = attributes;

		const isEmptyContent = isEmpty(content);

		const handleOnResizeStart = (event, direction, elt) => {
			event.preventDefault();

			elt.querySelector('svg').style.width = 'auto';

			setAttributes({
				[`svg-width-unit-${deviceType}`]: 'px',
			});
		};

		const handleOnResizeStop = (event, direction, elt) => {
			elt.querySelector('svg').style.width = null;

			setAttributes({
				[`svg-width-${deviceType}`]: elt.getBoundingClientRect().width,
			});
		};

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
					{...this.props}
				/>
			),
			<MaxiBlock
				key={`maxi-svg-icon--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<>
					<MaxiModal
						clientId={clientId}
						type='svg'
						empty={isEmptyContent}
						style={parentBlockStyle}
						openFirstTime={openFirstTime}
						onOpen={obj => setAttributes(obj)}
						onSelect={obj => setAttributes(obj)}
						onRemove={obj => setAttributes(obj)}
					/>
					{!isEmptyContent && (
						<BlockResizer
							className='maxi-svg-icon-block__icon'
							resizableObject={this.resizableObject}
							lockAspectRatio
							maxWidth={
								getLastBreakpointAttribute(
									'svg-responsive',
									deviceType,
									attributes
								)
									? '100%'
									: null
							}
							showHandle={isSelected}
							enable={{
								topRight: true,
								bottomRight: true,
								bottomLeft: true,
								topLeft: true,
							}}
							onResizeStart={handleOnResizeStart}
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
		setAttributes,
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

			setAttributes({
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

		setAttributes({ content: newContent });
	};

	const changeSVGContent = (color, type) => {
		const fillRegExp = new RegExp(`${type}:([^none])([^\\}]+)`, 'g');
		const fillStr = `${type}:${color}`;

		const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
		const fillStr2 = ` ${type}="${color}`;

		const newContent = ownProps.attributes.content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2);

		setAttributes({ content: newContent });
	};

	return {
		changeSVGStrokeWidth,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
	};
});

export default compose(editSelect, editDispatch)(edit);
