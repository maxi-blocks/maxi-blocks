/**
 * WordPress dependencies
 */
import { createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getResizerSize,
	MaxiBlockComponent,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { BlockResizer, Toolbar } from '../../components';
import { getLastBreakpointAttribute } from '../../extensions/attributes';
import { getIsOverflowHidden } from '../../extensions/styles';
import getStyles from './styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { copyPasteMapping } from './data';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	maxiBlockDidUpdate() {
		if (this.resizableObject.current) {
			const width = getLastBreakpointAttribute({
				target: '_w',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			});
			const widthUnit = getLastBreakpointAttribute({
				target: '_w-unit',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			});
			const height = `${getLastBreakpointAttribute({
				target: '_h',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			})}${getLastBreakpointAttribute({
				target: '_h-unit',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			})}`;

			const forceAspectRatio = getLastBreakpointAttribute({
				target: '_far',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			});

			const { width: resizerWidth, height: resizerHeight } =
				this.resizableObject.current.state;

			if (
				resizerWidth !== `${width}${widthUnit}` ||
				resizerHeight !== height
			) {
				this.resizableObject.current.updateSize({
					width: width ? `${width}${widthUnit}` : '100%',
					height: forceAspectRatio ? 'auto' : height,
				});
			}
		}
	}

	maxiBlockDidMount() {
		if (this.resizableObject.current) {
			const width = getLastBreakpointAttribute({
				target: '_w',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			});
			const widthUnit = getLastBreakpointAttribute({
				target: '_w-unit',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			});
			const height = `${getLastBreakpointAttribute({
				target: '_h',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			})}${getLastBreakpointAttribute({
				target: '_h-unit',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			})}`;

			const forceAspectRatio = getLastBreakpointAttribute({
				target: '_far',
				breakpoint: this.props.deviceType,
				attributes: this.props.attributes,
			});

			this.resizableObject.current.updateSize({
				width: width ? `${width}${widthUnit}` : '100%',
				height: forceAspectRatio ? 'auto' : height,
			});
		}
	}

	render() {
		const { attributes, deviceType, isSelected, maxiSetAttributes } =
			this.props;
		const { uniqueID, lineOrientation } = attributes;

		const classes = classnames(
			lineOrientation === 'vertical'
				? 'maxi-divider-block--vertical'
				: 'maxi-divider-block--horizontal',
			'maxi-divider-block__resizer',
			`maxi-divider-block__resizer__${uniqueID}`
		);
		const handleOnResizeStart = event => {
			event.preventDefault();

			const sizeUnit = getLastBreakpointAttribute({
				target: '_h-unit',
				breakpoint: deviceType,
				attributes,
			});

			if (sizeUnit === 'em')
				maxiSetAttributes({
					[`height-unit-${deviceType}`]: 'px',
				});
		};

		const handleOnResizeStop = (event, direction, elt) => {
			const sizeUnit = getLastBreakpointAttribute({
				target: '_h-unit',
				breakpoint: deviceType,
				attributes,
			});

			maxiSetAttributes({
				[`height-${deviceType}`]: getResizerSize(
					elt,
					this.blockRef,
					sizeUnit,
					'_h'
				),
			});
		};

		const inlineStylesTargets = {
			dividerColor: '.maxi-divider-block__divider',
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				inlineStylesTargets={inlineStylesTargets}
				{...this.props}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				prefix='divider-'
				inlineStylesTargets={inlineStylesTargets}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-divider--${uniqueID}`}
				ref={this.blockRef}
				classes={classes}
				resizableObject={this.resizableObject}
				{...getMaxiBlockAttributes(this.props)}
				tagName={BlockResizer}
				isOverflowHidden={getIsOverflowHidden(attributes, deviceType)}
				defaultSize={{
					width: '100%',
					height: `${getLastBreakpointAttribute({
						target: '_h',
						breakpoint: deviceType,
						attributes,
					})}${getLastBreakpointAttribute({
						target: '_h-unit',
						breakpoint: deviceType,
						attributes,
					})}`,
				}}
				showHandle={isSelected}
				enable={{
					bottom: true,
				}}
				onResizeStart={handleOnResizeStart}
				onResizeStop={handleOnResizeStop}
				cleanStyles
			>
				{getLastBreakpointAttribute({
					target: 'divider-border-style',
					breakpoint: deviceType,
					attributes,
				}) !== 'none' && <hr className='maxi-divider-block__divider' />}
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
