/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createRef } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getResizerSize,
	MaxiBlockComponent,
	withMaxiProps,
} from '../../extensions/maxi-block';
import {
	Toolbar,
	BlockResizer,
	RawHTML,
	MaxiPopoverButton,
} from '../../components';
import {
	getIsOverflowHidden,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import MaxiModal from '../../editor/library/modal';
import getStyles from './styles';
import { copyPasteMapping } from './data';

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
		const { content, openFirstTime, blockStyle, uniqueID } = attributes;
		const { isOpen } = this.state;

		const isEmptyContent = isEmpty(content);

		const handleOnResizeStop = (event, direction, elt) => {
			// Return SVG element its CSS width
			elt.querySelector('svg').style.width = null;

			maxiSetAttributes({
				[`svg-width-${deviceType}`]: getResizerSize(
					elt,
					this.blockRef,
					getLastBreakpointAttribute({
						target: 'svg-width-unit',
						breakpoint: deviceType || 'general',
						attributes,
					})
				),
			});
		};

		const maxiModalProps = {
			clientId,
			type: 'svg',
			isOpen,
			style: blockStyle,
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

		const inlineStylesTargets = {
			background: '.maxi-svg-icon-block__icon',
		};

		return [
			...[
				!isEmptyContent && [
					<Inspector
						key={`block-settings-${uniqueID}`}
						{...this.props}
						resizableObject={this.resizableObject}
						inlineStylesTargets={inlineStylesTargets}
					/>,
					<Toolbar
						key={`toolbar-${uniqueID}`}
						ref={this.blockRef}
						propsToAvoid={['resizableObject']}
						resizableObject={this.resizableObject}
						copyPasteMapping={copyPasteMapping}
						prefix='svg-'
						inlineStylesTargets={inlineStylesTargets}
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
								{__('Select icon', 'maxi-blocks')}
							</Button>
						</div>
					)}
					{!isEmptyContent && (
						<BlockResizer
							className='maxi-svg-icon-block__icon'
							resizableObject={this.resizableObject}
							isOverflowHidden={getIsOverflowHidden(
								attributes,
								deviceType
							)}
							lockAspectRatio
							deviceType={deviceType}
							defaultSize={{
								width: `${getLastBreakpointAttribute({
									target: 'svg-width',
									breakpoint: deviceType || 'general',
									attributes,
								})}${getLastBreakpointAttribute({
									target: 'svg-width-unit',
									breakpoint: deviceType || 'general',
									attributes,
								})}`,
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

export default withMaxiProps(edit);
