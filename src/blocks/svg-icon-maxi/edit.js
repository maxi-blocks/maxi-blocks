/**
 * WordPress dependencies
 */
import { createRef } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

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
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getLastBreakpointAttribute } from '../../extensions/attributes';
import { getIsOverflowHidden } from '../../extensions/styles';
import {
	getSVGWidthHeightRatio,
	togglePreserveAspectRatio,
} from '../../extensions/svg';
import MaxiModal from '../../editor/library/modal';
import getStyles from './styles';
import { copyPasteMapping } from './data';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, uniq, isArray } from 'lodash';

class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();

		this.state = {
			isOpen: this.props.attributes.openFirstTime,
		};
	}

	maxiBlockDidUpdate(prevProps) {
		const { updateBlockAttributes } = dispatch('core/block-editor');
		const svgCode = this.props.attributes._c;
		const blockId = this.props.attributes._uid;

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
							_c: newSvgCode,
						});
					}
				});
			}
		}

		if (prevProps.attributes._uid !== this.props.attributes._uid) {
			const svgClass = svgCode.match(/ class="(.+?(?=))"/)[1];
			const newSvgClass = `${svgClass}__${uniqueId()}`;
			const replaceIt = `${svgClass}`;

			const finalSvgCode = svgCode.replaceAll(replaceIt, newSvgClass);

			updateBlockAttributes(this.props.clientId, {
				_c: finalSvgCode,
			});
		}

		if (this.resizableObject.current) {
			const svgWidth = getLastBreakpointAttribute({
				target: 's_w',
				breakpoint: this.props.deviceType || 'g',
				attributes: this.props.attributes,
			});
			const svgWidthUnit = getLastBreakpointAttribute({
				target: 's_w.u',
				breakpoint: this.props.deviceType || 'g',
				attributes: this.props.attributes,
			});
			const fullWidthValue = `${svgWidth}${svgWidthUnit}`;

			if (this.resizableObject.current.state.width !== fullWidthValue) {
				this.resizableObject.current.updateSize({
					width: fullWidthValue,
				});

				let newContent = svgCode
					.replace('_h="64px"', '')
					.replace('width="64px"', '');

				if (newContent.indexOf('viewBox') === -1) {
					const changeTo = ' viewBox="0 0 64 64"><defs>';
					newContent = newContent.replace(/><defs>/, changeTo);
				}

				if (!isEmpty(newContent))
					this.props.maxiSetAttributes({
						_c: newContent,
					});
			}
		}
	}

	maxiBlockDidChangeUniqueID(newUniqueID) {
		/**
		 * Each svg icon content svg tag has unique class name, which should be changed
		 * when the block is duplicated.
		 */
		const svgClass =
			this.props.attributes._c.match(/ class="(.+?(?=))"/)?.[1];
		if (!svgClass) return;

		const newContent = this.props.attributes._c.replaceAll(
			svgClass.match(/__(\d)/)[0],
			`__${newUniqueID.match(/-(\d+)$/).pop()}`
		);
		this.props.attributes._c = newContent;
	}

	get getStylesObject() {
		return getStyles(
			this.props.attributes,
			getSVGWidthHeightRatio(
				this.blockRef.current?.querySelector(
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
		const {
			_c: content,
			openFirstTime,
			_bs: blockStyle,
			_uid: uniqueID,
		} = attributes;
		const { isOpen } = this.state;

		const isEmptyContent = isEmpty(content);

		const heightFitContent = getLastBreakpointAttribute({
			target: 's_wfc',
			breakpoint: deviceType,
			attributes,
		});

		const handleOnResizeStop = (event, direction, elt) => {
			// Return SVG element its CSS width
			elt.querySelector('svg').style.width = null;

			maxiSetAttributes({
				[`s_w-${deviceType}`]: getResizerSize(
					elt,
					this.blockRef,
					getLastBreakpointAttribute({
						target: 's_w.u',
						breakpoint: deviceType || 'g',
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
				const { content } = obj;

				if (content) {
					const disableHeightFitContent = getLastBreakpointAttribute({
						target: 's_wfc',
						breakpoint: deviceType,
						attributes,
					});

					if (disableHeightFitContent)
						obj.content = togglePreserveAspectRatio(content, true);
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
						prefix='s-'
						inlineStylesTargets={inlineStylesTargets}
						onModalOpen={() => this.setState({ isOpen: true })}
						{...this.props}
					/>,
					<MaxiPopoverButton
						key={`popover-${uniqueID}`}
						ref={this.blockRef}
						isOpen={isOpen}
						prefix='s-'
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
									target: 's_w',
									breakpoint: deviceType || 'g',
									attributes,
								})}${getLastBreakpointAttribute({
									target: 's_w.u',
									breakpoint: deviceType || 'g',
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

export default withMaxiProps(edit);
