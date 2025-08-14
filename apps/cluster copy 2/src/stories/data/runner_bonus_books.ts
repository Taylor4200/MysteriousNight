// Bonus-mode runner books: no stumbles (every spin collects) and increased meat.

export type RunnerBonusBook = {
  id: number;
  events: Array<
    | { index: number; type: 'freeSpinTrigger'; totalFs: number; positions: any[] }
    | { index: number; type: 'setTotalWin'; amount: number }
  >;
};

const dollars = (n: number) => Math.round(n * 100);

const books: RunnerBonusBook[] = [
  { id: 101, events: [
    { index: 0, type: 'freeSpinTrigger', totalFs: 10, positions: [] },
    { index: 1, type: 'setTotalWin', amount: dollars(6.00) },
  ]},
  { id: 102, events: [
    { index: 0, type: 'freeSpinTrigger', totalFs: 10, positions: [] },
    { index: 1, type: 'setTotalWin', amount: dollars(12.00) },
  ]},
  { id: 103, events: [
    { index: 0, type: 'freeSpinTrigger', totalFs: 10, positions: [] },
    { index: 1, type: 'setTotalWin', amount: dollars(20.00) },
  ]},
];

export default books;


