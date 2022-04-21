/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { createRef } from '@wordpress/element';

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
import { BlockResizer, Toolbar } from '../../components';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import getStyles from './styles';
import MaxiBlock from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

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
		if (this.resizableObject.current?.state) {
			this.resizableObject.current.updateSize({
				isResizing: this.resizableObject.current?.state?.isResizing,
			});
		}
	}

	render() {
		const {
			attributes,
			deviceType,
			isSelected,
			onDeviceTypeChange,
			maxiSetAttributes,
		} = this.props;
		const { uniqueID, lineOrientation, blockFullWidth, fullWidth } =
			attributes;

		onDeviceTypeChange();

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
				target: 'height-unit',
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
				target: 'height-unit',
				breakpoint: deviceType,
				attributes,
			});

			maxiSetAttributes({
				[`height-${deviceType}`]: getResizerSize(
					elt,
					this.blockRef,
					sizeUnit,
					'height'
				),
			});
		};

		const position = getLastBreakpointAttribute({
			target: 'position',
			breakpoint: deviceType,
			attributes,
		});

		// BlockResizer component comes with inherit styles where position is 'relative',
		// so we need to give style prop to change it when positioning is set 👌
		const style = {
			...(position && { position }),
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
			/>,
			<MaxiBlock
				key={`maxi-divider--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				classes={classes}
				resizableObject={this.resizableObject}
				{...getMaxiBlockAttributes(this.props)}
				tagName={BlockResizer}
				isOverflowHidden={getIsOverflowHidden()}
				size={{
					width: '100%',
					height: `${getLastBreakpointAttribute({
						target: 'height',
						breakpoint: deviceType,
						attributes,
					})}${getLastBreakpointAttribute({
						target: 'height-unit',
						breakpoint: deviceType,
						attributes,
					})}`,
				}}
				defaultSize={{
					width: '100%',
					height: `${getLastBreakpointAttribute({
						target: 'height',
						breakpoint: deviceType,
						attributes,
					})}${getLastBreakpointAttribute({
						target: 'height-unit',
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
				style={style}
			>
				{getLastBreakpointAttribute({
					target: 'divider-border-style',
					breakpoint: deviceType,
					attributes,
				}) !== 'none' && (
					<hr
						data-align={fullWidth}
						className='maxi-divider-block__divider'
					/>
				)}
			</MaxiBlock>,
		];
	}
}

const editDispatch = withDispatch((dispatch, ownProps, { select }) => {
	const {
		attributes: { uniqueID },
		deviceType,
	} = ownProps;

	const onDeviceTypeChange = () => {
		let newDeviceType = select('maxiBlocks').receiveMaxiDeviceType();
		newDeviceType = newDeviceType === 'Desktop' ? 'general' : newDeviceType;

		const allowedDeviceTypes = ['general', 'xl', 'l', 'm', 's'];

		if (
			allowedDeviceTypes.includes(newDeviceType) &&
			deviceType !== newDeviceType
		) {
			const node = document.querySelector(
				`.maxi-divider-block__resizer__${uniqueID}`
			);
			if (isNil(node)) return;
			node.style.height = `${
				ownProps.attributes[`height-${newDeviceType}`]
			}px`;
		}
	};

	return {
		onDeviceTypeChange,
	};
});

export default compose(editDispatch, withMaxiProps)(edit);
