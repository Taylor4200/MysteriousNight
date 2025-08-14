export type RunnerBook = { id: number; events: any[] };

const dollars = (n: number) => Math.round(n * 100); // 100 book units = $1.00

// Sample runner books with Knight's Favor; run counter targets base win, favor scales payout
const runnerBaseBooks: RunnerBook[] = [
	{
		id: 101,
		events: [
			{ index: 0, type: 'setKnightFavor', mult: 1 },
			// Total win 25x; run counter targets 25x
			{ index: 1, type: 'setTotalWin', amount: dollars(25) },
		],
	},
	{
		id: 102,
		events: [
			{ index: 0, type: 'setKnightFavor', mult: 2 },
			// Total win 50x; run counter should target 25x (base), then favor x2 -> 50x payout
			{ index: 1, type: 'setTotalWin', amount: dollars(50) },
		],
	},
	{
		id: 103,
		events: [
			{ index: 0, type: 'setKnightFavor', mult: 3 },
			// Total win 90x; run counter should target 30x (base), then favor x3 -> 90x payout
			{ index: 1, type: 'setTotalWin', amount: dollars(90) },
		],
	},
	{
		id: 104,
		events: [
			{ index: 0, type: 'setKnightFavor', mult: 5 },
			// Total win 250x; run counter should target 50x (base), then favor x5 -> 250x payout
			{ index: 1, type: 'setTotalWin', amount: dollars(250) },
		],
	},
	// 0x tease losses (stumble without collecting). setTotalWin 0 triggers tease logic in runner.
	{ id: 201, events: [ { index: 0, type: 'setTotalWin', amount: 0 } ] },
	{ id: 202, events: [ { index: 0, type: 'setTotalWin', amount: 0 } ] },
	{ id: 203, events: [ { index: 0, type: 'setTotalWin', amount: 0 } ] },
	{ id: 204, events: [ { index: 0, type: 'setTotalWin', amount: 0 } ] },
	{ id: 205, events: [ { index: 0, type: 'setTotalWin', amount: 0 } ] },
];

export default runnerBaseBooks;
