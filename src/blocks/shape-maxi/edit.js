/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { RawHTML } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar } from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
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
		const { uniqueID, parentBlockStyle, content, openFirstTime } =
			attributes;

		const paletteClasses = getPaletteClasses(attributes, parentBlockStyle);

		const isEmptyContent = isEmpty(content);

		return [
			!isEmptyContent && (
				<Inspector key={`block-settings-${uniqueID}`} {...this.props} />
			),
			!isEmptyContent && (
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
				/>
			),
			<MaxiBlock
				key={`maxi-shape--${uniqueID}`}
				ref={this.blockRef}
				paletteClasses={paletteClasses}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<>
					<MaxiModal
						clientId={clientId}
						type='block-shape'
						empty={isEmptyContent}
						style={parentBlockStyle}
						openFirstTime={openFirstTime}
					/>
					{!isEmptyContent && (
						<RawHTML className='maxi-shape-block__icon'>
							{content}
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
