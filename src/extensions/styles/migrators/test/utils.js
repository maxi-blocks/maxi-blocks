import { cloneElement, renderToString } from '@wordpress/element';

import { getMigratorsCombinations, migratorGenerator } from '../utils';

describe('getMigratorsCombinations', () => {
	it('Should return a one element array', () => {
		const mainMigrator = {
			isEligible: null,
			attributes: {},
			migrate: null,
		};

		const migrators = [
			{ ...mainMigrator, saveMigrator: 1 },
			{ ...mainMigrator, saveMigrator: 2 },
			{ ...mainMigrator, saveMigrator: 3 },
			{ ...mainMigrator, saveMigrator: 4 },
		];

		expect(getMigratorsCombinations(migrators)).toMatchSnapshot();
	});
});

const TestComponent = ({
	content = 'Testing',
	className = 'random',
	tagName: TagName = 'h1',
	...restProps
}) => (
	<TagName className={className} {...restProps}>
		{content}
	</TagName>
);

describe('migratorGenerator', () => {
	it('Should return a one element array', () => {
		const mainMigrator = {
			isEligible: null,
			attributes: {},
			migrate: null,
			save: () => null,
		};

		const migrators = [
			{
				...mainMigrator,
				// Modifies content
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						content: 'Modified content',
					});

					return newInstance;
				},
			},
			{
				...mainMigrator,
				// Add a new attribute
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						'data-align': 'full',
					});

					return newInstance;
				},
			},
			{
				...mainMigrator,
				// Add a new className
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						className: `${saveInstance.props.className} new-class`,
					});

					return newInstance;
				},
			},
			{
				...mainMigrator,
				// Change tagName
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						tagName: 'p',
					});

					return newInstance;
				},
			},
		];

		const saveMigrators = getMigratorsCombinations(migrators);

		const finalMigrators = migratorGenerator({
			mainMigrator,
			saveMigrators,
			save: props => (
				<TestComponent className='test-migrators' {...props} />
			),
		});

		const result = finalMigrators.map(migrator =>
			renderToString(migrator.save({ content: 'test' }))
		);

		expect(result).toMatchSnapshot();
	});
});
