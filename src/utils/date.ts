import type { Moment } from 'moment';
import moment from 'moment';
import { range } from './common';

export const disabledRangeTime = (current: Moment, type: 'start' | 'end', hour: string, minute: string) => {
	return current && current.format('DDMMYYYY') === moment().format('DDMMYYYY')
		? {
				disabledHours: () => range(0, Number(hour)),
				disabledMinutes: () => range(0, hour === current.format('HH') ? Number(minute) : 0),
				disabledSeconds: () => [55, 56],
		  }
		: {};
};
