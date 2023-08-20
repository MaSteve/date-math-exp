## Summary
This zip file contains a typescript project with the solution to the proposed task. The functions ``parse`` and ``stringify`` are implemented in ``src/index.ts``.

The first function relies on a lexer (tokenizer) and a parser for transforming a date math expression into a list of nodes which can be used for manipulating dates. The nodes are divided into 3 categories: operands (for adding or subtracting time), rounding nodes (for rounding to given unit of time) and timestamp nodes (for fetching a date, for now, only the current date). The date math expressions are defined by the following grammar:
```
Expression -> Timestamp Operands RoundingNode
Operands -> epsilon | Operand Operands
Operand -> Operator Numeral UnitOfTime
Operator -> + | -
RoundingNode -> epsilon | / UnitOfTime
UnitOfTime -> y | M | w | d | h | m | s
Timestamp -> now
```

The second function relies on a simple implementation that computes the deltas between the different fields in the given date and the current date, and use that to generate a date math expression. Some particular approach is used for dealing with the months as they don't have always the same number of days (30, 31, 28 or 29) so first we go to the first day of the month, compute the delta for the month and lastly jump to the day in the given date. There could be better approaches but this is valid.

## How can I use it?
- Unzip the file into a folder and open it in a console
- Execute ``npm install && npm test && npm run build``
- Go to the node console and import the functions using 
``const { parse, stringify } = require('./dist/src/index');``
- Enjoy!
