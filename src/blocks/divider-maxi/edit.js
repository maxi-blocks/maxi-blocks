/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { BlockResizer, MaxiBlockComponent, Toolbar } from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'entrance',
					]),
				}),
			},
		};
	}

	render() {
		const {
			attributes,
			deviceType,
			isSelected,
			onDeviceTypeChange,
			setAttributes,
		} = this.props;
		const { uniqueID, lineOrientation } = attributes;

		onDeviceTypeChange();

		const classes = classnames(
			lineOrientation === 'vertical'
				? 'maxi-divider-block--vertical'
				: 'maxi-divider-block--horizontal',
			'maxi-divider-block__resizer',
			`maxi-divider-block__resizer__${uniqueID}`,
			{
				'is-selected': isSelected,
			}
		);

		const handleOnResizeStart = event => {
			event.preventDefault();
			setAttributes({
				[`height-unit-${deviceType}`]: 'px',
			});
		};

		const handleOnResizeStop = (event, direction, elt) => {
			setAttributes({
				[`height-${deviceType}`]: elt.getBoundingClientRect().height,
			});
		};

		const position = getLastBreakpointAttribute(
			'position',
			deviceType,
			attributes
		);

		// BlockResizer component comes with inherit styles where position is 'relative',
		// so we need to give style prop to change it when positioning is set 👌
		const style = {
			...(position && { position }),
		};

		console.log(this.blockRef);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,

			<MaxiBlock
				key={`maxi-divider--${uniqueID}`}
				ref={this.blockRef}
				classes={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
				tagName={BlockResizer}
				size={{
					width: '100%',
					height: `${attributes[`height-${deviceType}`]}${
						attributes[`height-unit-${deviceType}`]
					}`,
				}}
				defaultSize={{
					width: '100%',
					height: `${attributes[`height-${deviceType}`]}${
						attributes[`height-unit-${deviceType}`]
					}`,
				}}
				showHandle={isSelected}
				enable={{
					bottom: true,
				}}
				onResizeStart={handleOnResizeStart}
				onResizeStop={handleOnResizeStop}
				style={style}
				disableMotion
				// onClick={() => console.log('heeeey')}
			>
				{attributes['divider-border-style'] !== 'none' && (
					<hr className='maxi-divider-block__divider' />
				)}
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

export default compose(editSelect, editDispatch)(edit);
