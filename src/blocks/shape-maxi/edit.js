/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { RawHTML } from '@wordpress/element';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import MaxiModal from '../../editor/library/modal';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		isOpen: false,
	};

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
		const { attributes, clientId } = this.props;
		const { uniqueID, parentBlockStyle, openFirstTime, shapeSVGElement } =
			attributes;

		return [
			!isEmpty(shapeSVGElement) && (
				<Inspector key={`block-settings-${uniqueID}`} {...this.props} />
			),
			!isEmpty(shapeSVGElement) && (
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
				/>
			),
			<MaxiBlock
				key={`maxi-shape--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<>
					<MaxiModal
						clientId={clientId}
						type='block-shape'
						empty={isEmpty(shapeSVGElement)}
						style={parentBlockStyle}
						openFirstTime={openFirstTime}
					/>
					{!isEmpty(shapeSVGElement) && (
						<RawHTML className='maxi-shape-block__icon'>
							{shapeSVGElement}
						</RawHTML>
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

export default compose(editSelect)(edit);
