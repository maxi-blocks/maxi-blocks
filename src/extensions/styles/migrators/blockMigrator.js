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
import {
	isEligible as shapeDividerIsEligible,
	deprecatedAttributes as shapeDividerAttributes,
	migrate as shapeDividerMigrator,
} from './shapeDividerMigrator';
import {
	isEligible as transformIsEligible,
	attributes as transformAttributes,
	migrate as transformMigrator,
} from './transformMigrator';

const blockMigrator = ({
	attributes,
	save,
	prefix,
	isContainer = false,
	selectors,
}) => {
	return {
		isEligible(blockAttributes) {
			return (
				positionIsEligible(blockAttributes, attributes) ||
				fromFullWidthNonToResponsiveIsEligible(blockAttributes) ||
				(isContainer && shapeDividerIsEligible(blockAttributes)) ||
				transformIsEligible(blockAttributes)
			);
		},

		attributes: {
			...attributes,
			...positionAttributes,
			...fromFullWidthNonToResponsiveAttributes(isContainer),
			...(isContainer && shapeDividerAttributes),
			...transformAttributes,
		},

		migrate(oldAttributes) {
			const newAttributes = { ...oldAttributes };

			positionMigrator(newAttributes, attributes);
			fromFullWidthNonToResponsiveMigrator(newAttributes, prefix);
			if (isContainer) shapeDividerMigrator(newAttributes);
			transformMigrator(newAttributes, selectors);

			return newAttributes;
		},

		save(props) {
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

export default blockMigrator;
