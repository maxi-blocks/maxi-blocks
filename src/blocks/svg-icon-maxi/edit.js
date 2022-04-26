/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { createRef } from '@wordpress/element';
import { withDispatch, dispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';

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
import {
	Toolbar,
	BlockResizer,
	RawHTML,
	MaxiPopoverButton,
} from '../../components';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import MaxiBlock from '../../components/maxi-block';
import MaxiModal from '../../editor/library/modal';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';

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

		this.state = { isOpen: this.props.attributes.openFirstTime };
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
		isOpen: true,
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
		const { isOpen } = this.state;

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

		const maxiModalProps = {
			clientId,
			type: 'svg',
			isOpen,
			style: parentBlockStyle,
			openFirstTime: isSelected ? openFirstTime : false,
			onOpen: obj => {
				maxiSetAttributes(obj);

				this.setState({ isOpen: true });
			},
			onSelect: obj => {
				maxiSetAttributes(obj);

				this.setState({ isOpen: false });
			},
			onRemove: obj => {
				maxiSetAttributes(obj);

				this.setState({ isOpen: false });
			},
			onClose: () => this.setState({ isOpen: false }),
		};

		return [
			...[
				!isEmptyContent && [
					<Inspector
						key={`block-settings-${uniqueID}`}
						{...this.props}
						resizableObject={this.resizableObject}
					/>,
					<Toolbar
						key={`toolbar-${uniqueID}`}
						ref={this.blockRef}
						propsToAvoid={['resizableObject']}
						resizableObject={this.resizableObject}
						copyPasteMapping={copyPasteMapping}
						prefix='svg-'
						{...this.props}
					/>,
					<MaxiPopoverButton
						key={`popover-${uniqueID}`}
						ref={this.blockRef}
						isOpen={isOpen}
						{...this.props}
					>
						<MaxiModal {...maxiModalProps} />
					</MaxiPopoverButton>,
				],
			],
			...[isEmptyContent && <MaxiModal {...maxiModalProps} forceHide />],
			<MaxiBlock
				key={`maxi-svg-icon--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				{...getMaxiBlockAttributes(this.props)}
			>
				<>
					{isEmptyContent && (
						<div className='maxi-svg-icon-block__placeholder'>
							<Button
								isPrimary
								key={`maxi-block-library__modal-button--${clientId}`}
								className='maxi-block-library__modal-button'
								onClick={() => this.setState({ isOpen: true })}
							>
								{__('Select SVG Icon', 'maxi-blocks')}
							</Button>
						</div>
					)}
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
								width: `${getLastBreakpointAttribute({
									target: 'svg-width',
									breakpoint: deviceType || 'general',
									attributes,
								})}${svgWidthUnit}`,
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

		const newContent = content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2)
			.replace(strokeRegExp, strokeStr)
			.replace(strokeRegExp2, strokeStr2);

		maxiSetAttributes({ content: newContent });
	};

	const changeSVGContent = (color, type) => {
		const fillRegExp = new RegExp(
			`(((?<!hover )\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))`,
			'g'
		);
		const fillStr = `$2{${type}:${color}`;

		const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
		const fillStr2 = ` ${type}="${color}`;

		const newContent = content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2);

		maxiSetAttributes({ content: newContent });
	};

	const changeSVGContentHover = (color, type) => {
		let newContent = content;

		const svgRegExp = new RegExp(`( ${type}=[^-]([^none])([^\\"]+))`, 'g');
		const svgStr = ` data-hover-${type}$1`;

		const cssRegExpOld = new RegExp(
			`((\.maxi-svg-icon-block__icon:hover \.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))(})`,
			'g'
		);
		const cssStrOld = '';

		const cssRegExp = new RegExp(
			`(((?<!hover)\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))`,
			'g'
		);
		const cssStr = `$1}.maxi-svg-icon-block__icon:hover $2{${type}:${color}`;

		newContent = newContent
			.replace(svgRegExp, svgStr)
			.replace(cssRegExpOld, cssStrOld)
			.replace(cssRegExp, cssStr);

		newContent !== content && maxiSetAttributes({ content: newContent });
	};

	return {
		changeSVGStrokeWidth,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
		changeSVGContentHover,
	};
});

export default compose(withMaxiProps, editDispatch)(edit);
