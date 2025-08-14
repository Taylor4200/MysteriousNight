import type { RunnerBook } from './runner_base_books';

const dollars = (n: number) => Math.round(n * 100); // 100 book units = $1.00

// Single book that ramps to ~x7500 (on $1 spin this is $7,500.00)
const runnerMaxBook: RunnerBook = {
  id: 7500,
  events: [
    // Server-provided Knight's Favor (meta multiplier)
    { index: 0, type: 'setKnightFavor', mult: 3 },
    // Final predetermined win amount (book units)
    { index: 1, type: 'setTotalWin', amount: dollars(7500) },
  ],
};

export default runnerMaxBook;


