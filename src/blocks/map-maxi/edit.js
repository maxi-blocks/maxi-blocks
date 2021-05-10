/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import GoogleMapReact from 'google-map-react';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus = !isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, 'map'),
				}),
			},
		};
	}

	render() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const classes = 'maxi-map-block';

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MaxiBlock
				key={`maxi-amp--${uniqueID}`}
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<div className='maxi-map-container' style={{ height: '300px' }}>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: attributes['map-api-key'],
							language: 'en',
							region: 'US',
						}}
						defaultCenter={{
							lat: attributes['map-Latitude'],
							lng: attributes['map-longitude'],
						}}
						defaultZoom={4}
					></GoogleMapReact>
				</div>
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
