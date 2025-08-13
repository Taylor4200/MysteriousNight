import type { requestBet } from './rgs-requests';

type BaseBet = Awaited<ReturnType<typeof requestBet>>['round'];
type NoUndefinedBaseBet = Exclude<BaseBet, undefined>;
type BaseBetWithoutEvents = Omit<NoUndefinedBaseBet, 'events'>;

export type BetType<TBookEvent extends object> = BaseBetWithoutEvents & {
	events: TBookEvent[];
};
