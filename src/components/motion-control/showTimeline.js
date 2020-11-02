/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, has, filter } from 'lodash';

/**
 * icons
 */
import { toolbarDelete } from '../../icons';

/**
 * Component
 */
const ShowTimeline = props => {
	const { interaction, onChange } = props;

	const removeTimeline = (type, time) => {
		if (has(interaction.timeline, time)) {
			const result = filter(interaction.timeline[time], o => {
				return o.type !== type;
			});

			interaction.timeline = {
				...interaction.timeline,
				[time]: [...result],
			};

			if (isEmpty(result)) {
				const newTimeline = { ...interaction.timeline };
				delete newTimeline[time];

				interaction.timeline = {
					...newTimeline,
				};
			}
		}

		onChange(interaction);
	};

	return (
		<div className='maxi-motion-control__timeline'>
			{isEmpty(interaction.timeline) && (
				<div className='maxi-motion-control__timeline__no-effects'>
					<p>
						{__(
							'Please enter your first interaction effect',
							'maxi-blocks'
						)}
					</p>
				</div>
			)}
			{Object.entries(interaction.timeline).map(
				([key, value], i, arr) => {
					const prevValue = !isNil(arr[i - 1]) ? arr[i - 1][0] : 0;
					return (
						<Fragment>
							<div
								className='maxi-motion-control__timeline__space'
								style={{
									flexGrow: `${parseFloat(
										(Number(key) - Number(prevValue)) / 100
									)}`,
								}}
							/>
							<div className='maxi-motion-control__timeline__group'>
								{value.map((item, i) => (
									<div
										className={classnames(
											'maxi-motion-control__timeline__group__item',
											interaction.activeTimeline.time ===
												Number(key) &&
												interaction.activeTimeline
													.index === i &&
												'maxi-motion-control__timeline__group__item--active-item'
										)}
										onClick={() => {
											interaction.activeTimeline = {
												time: Number(key),
												index: i,
											};
											onChange(interaction);
										}}
									>
										<span>{item.type}</span>
										<div className='maxi-motion-control__timeline__group__item__actions'>
											<i
												onClick={() =>
													removeTimeline(
														item.type,
														key
													)
												}
											>
												{toolbarDelete}
											</i>
										</div>
									</div>
								))}
								<div className='maxi-motion-control__timeline__group__position'>
									{key}%
								</div>
							</div>
						</Fragment>
					);
				}
			)}
		</div>
	);
};
export default ShowTimeline;
