import {
	isEligible as positionIsEligible,
	attributes as positionAttributes,
	migrate as positionMigrator,
} from './positionMigrator';
import {
	isEligible as fromFullWidthNonToResponsiveIsEligible,
	attributes as fromFullWidthNonToResponsiveAttributes,
	migrate as fromFullWidthNonToResponsiveMigrator,
} from './fullWidthNonToResponsive';

const v1 = ({ attributes, save, prefix, isContainer = false }) => {
	return {
		isEligible(blockAttributes) {
			return (
				positionIsEligible(blockAttributes, attributes) ||
				fromFullWidthNonToResponsiveIsEligible(blockAttributes)
			);
		},

		attributes: {
			...attributes,
			...positionAttributes,
			...fromFullWidthNonToResponsiveAttributes(isContainer),
		},

		migrate(oldAttributes) {
			debugger;
			const newAttributes = { ...oldAttributes };

			positionMigrator(newAttributes, attributes);
			fromFullWidthNonToResponsiveMigrator(newAttributes, prefix);

			return newAttributes;
		},

		save(props) {
			debugger;
			const { attributes } = props;
			const { fullWidth, blockFullWidth, ...restAttrs } = attributes;

			const newSave = save(
				{ ...props, attributes: restAttrs },
				{
					'data-align': blockFullWidth,
				},
				...(prefix && {
					'data-align': fullWidth,
				})
			);

			return newSave;
		},
	};
};

export default v1;
