/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { createRef } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, uniq, isArray } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import BlockResizer from '@components/block-resizer';
import RawHTML from '@components/raw-html';
import MaxiPopoverButton from '@components/maxi-popover-button';
import MaxiModal from '@editor/library/modal';

import {
	getResizerSize,
	MaxiBlockComponent,
	withMaxiProps,
} from '@extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import {
	getIsOverflowHidden,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	shouldSetPreserveAspectRatio,
	getSVGWidthHeightRatio,
	togglePreserveAspectRatio,
	setSVGAriaLabel,
} from '@extensions/svg';
import { withMaxiContextLoopContext } from '@extensions/DC';
import getStyles from './styles';
import { copyPasteMapping } from './data';
import withMaxiDC from '@extensions/DC/withMaxiDC';

class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();

		this.state = {
			isOpen: this.getIsOpenFirstTime(),
		};
	}

	getIsOpenFirstTime() {
		if (this.props.repeaterStatus && this.props.attributes.openFirstTime) {
			const parentColumnClientId = select(
				'core/block-editor'
			).getBlockParentsByBlockName(
				this.props.clientId,
				'maxi-blocks/column-maxi'
			)[0];
			const innerBlockPositions = this.props.getInnerBlocksPositions();

			return (
				innerBlockPositions?.[[-1]]?.indexOf(parentColumnClientId) === 0
			);
		}

		return this.props.attributes.openFirstTime;
	}

	maxiBlockDidUpdate(prevProps) {
		const { updateBlockAttributes } = dispatch('core/block-editor');
		const svgCode = this.props.attributes.content;
		const blockId = this.props.attributes.uniqueID;

		if (svgCode) {
			const svgInsideIds = uniq(
				Array.from(svgCode.matchAll(/ xlink:href="#(.+?(?=))"/g)).map(
					match => match[1]
				)
			);

			if (isArray(svgInsideIds) && svgInsideIds.length > 0) {
				svgInsideIds.forEach(insideId => {
					if (!insideId.includes(blockId)) {
						const newInsideId = `${
							insideId.split('__')[0] // let's check for another 'svg-icon-max-X' part in case the block was duplicated, and remove the part
						}__${blockId}`;

						const newSvgCode = svgCode.replaceAll(
							insideId,
							newInsideId
						);
						this.props.maxiSetAttributes({
							content: newSvgCode,
						});
					}
				});
			}
		}

		if (prevProps.attributes.uniqueID !== this.props.attributes.uniqueID) {
			const svgClass = svgCode.match(/ class="(.+?(?=))"/)?.[1];
			const newSvgClass = `${svgClass}__${uniqueId()}`;
			const replaceIt = `${svgClass}`;

			const finalSvgCode = svgCode.replaceAll(replaceIt, newSvgClass);

			updateBlockAttributes(this.props.clientId, {
				content: finalSvgCode,
			});
		}

		const resizableInstance = this.resizableObject.current;
		if (resizableInstance) {
			const breakpoint = this.props.deviceType || 'general';
			const svgWidth = getLastBreakpointAttribute({
				target: 'svg-width',
				breakpoint,
				attributes: this.props.attributes,
			});
			const svgWidthUnit =
				getLastBreakpointAttribute({
					target: 'svg-width-unit',
					breakpoint,
					attributes: this.props.attributes,
				}) || 'px';

			if (
				svgWidth !== undefined &&
				svgWidth !== null &&
				svgWidth !== ''
			) {
				const fullWidthValue = `${svgWidth}${svgWidthUnit}`;

				if (resizableInstance.state.width !== fullWidthValue) {
					resizableInstance.updateSize({
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

				const resizableElement = resizableInstance.resizable;
				if (
					resizableElement &&
					resizableElement.style.width !== fullWidthValue
				) {
					resizableElement.style.width = fullWidthValue;
				}
			}
		}
	}

	maxiBlockDidChangeUniqueID(newUniqueID) {
		/**
		 * Each svg icon content svg tag has unique class name, which should be changed
		 * when the block is duplicated.
		 */
		const svgClass =
			this.props.attributes.content?.match(/ class="(.+?(?=))"/)?.[1];
		if (!svgClass) return;

		const svgClassMatch = svgClass.match(/__([a-f0-9]+)(?:-u)?$|-(\d+)$/);
		const newUniqueIDMatch = newUniqueID.match(
			/-([a-f0-9]+)(?:-u)?$|-(\d+)$/
		);

		if (svgClassMatch && newUniqueIDMatch) {
			const matchedSvgClass = svgClassMatch[0];
			const matchedID = newUniqueIDMatch[1];

			const newContent = this.props.attributes.content?.replaceAll(
				matchedSvgClass,
				`__${matchedID}`
			);
			this.props.attributes.content = newContent;
		}
	}

	get getStylesObject() {
		return getStyles(
			this.props.attributes,
			getSVGWidthHeightRatio(
				this.blockRef?.current?.querySelector(
					'.maxi-svg-icon-block__icon svg'
				)
			)
		);
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
		const { content, blockStyle, uniqueID, ariaLabels } = attributes;
		const { isOpen } = this.state;

		const isEmptyContent = isEmpty(content);

		const heightFitContent = getLastBreakpointAttribute({
			target: 'svg-width-fit-content',
			breakpoint: deviceType,
			attributes,
		});

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
			openFirstTime: isSelected ? this.getIsOpenFirstTime() : false,
			onOpen: obj => {
				maxiSetAttributes(obj);

				this.setState({ isOpen: true });
			},
			onSelect: obj => {
				const { content } = obj;

				if (
					content &&
					shouldSetPreserveAspectRatio(attributes, 'svg-')
				) {
					obj.content = togglePreserveAspectRatio(content, true);
				}
				if (content && ariaLabels?.svg) {
					obj.content = setSVGAriaLabel(
						ariaLabels.svg,
						() => content,
						'svg'
					);
				}

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
						onModalOpen={() => this.setState({ isOpen: true })}
						{...this.props}
					/>,
					<MaxiPopoverButton
						key={`popover-${uniqueID}`}
						ref={this.blockRef}
						isOpen={isOpen}
						prefix='svg-'
						{...this.props}
					>
						<MaxiModal {...maxiModalProps} />
					</MaxiPopoverButton>,
				],
			],
			<MaxiBlock
				key={`maxi-svg-icon--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
			>
				<>
					{isEmptyContent && (
						<MaxiModal
							{...maxiModalProps}
							forceHide
							key={`maxi-modal--${uniqueID}`}
						/>
					)}
					{!isEmptyContent && !heightFitContent && (
						<BlockResizer
							className='maxi-svg-icon-block__icon'
							key={`maxi-svg-icon-block__icon--${clientId}`}
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
					{!isEmptyContent && heightFitContent && (
						<div className='maxi-svg-icon-block__icon'>
							<RawHTML>{content}</RawHTML>
						</div>
					)}
				</>
			</MaxiBlock>,
		];
	}
}

export default withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)));
