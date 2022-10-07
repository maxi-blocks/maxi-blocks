/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const typeDefault = [
	{
		label: __('None', 'maxi-blocks'),
		value: 'false',
	},
	{
		label: __('numeric', 'maxi-blocks'),
		value: 'numeric',
	},
	{
		label: __('2-digit', 'maxi-blocks'),
		value: '2-digit',
	},
];

export const typeWeekday = [
	{
		label: __('None', 'maxi-blocks'),
		value: 'false',
	},
	{
		label: __('long', 'maxi-blocks'),
		value: 'long',
	},
	{
		label: __('short', 'maxi-blocks'),
		value: 'short',
	},
	{
		label: __('narrow', 'maxi-blocks'),
		value: 'narrow',
	},
];

export const typeMonth = [
	{
		label: __('None', 'maxi-blocks'),
		value: 'false',
	},
	{
		label: __('numeric', 'maxi-blocks'),
		value: 'numeric',
	},
	{
		label: __('2-digit', 'maxi-blocks'),
		value: '2-digit',
	},
	{
		label: __('narrow', 'maxi-blocks'),
		value: 'narrow',
	},
	{
		label: __('short', 'maxi-blocks'),
		value: 'short',
	},
	{
		label: __('long', 'maxi-blocks'),
		value: 'long',
	},
];
export const typeZone = [
	{
		label: __('en-US', 'maxi-blocks'),
		value: 'en-US',
	},
];
export const typeTimezoneName = [];

export const typeTimezone = [
	{
		label: __('GMT', 'maxi-blocks'),
		value: 'GMT',
	},
	{
		label: __('Offset', 'maxi-blocks'),
		value: 'Offset',
	},
	{
		label: __('UTC', 'maxi-blocks'),
		value: 'UTC',
	},
	{
		label: __('DST', 'maxi-blocks'),
		value: 'DST',
	},
];

export const DateOptions = {
	weekday: typeWeekday,
	year: typeDefault,
	month: typeMonth,
	day: typeDefault,
	hour: typeDefault,
	minute: typeDefault,
	second: typeDefault,
	timezoneName: typeTimezoneName,
	timezone: typeTimezone,
	zone: typeZone,
};
