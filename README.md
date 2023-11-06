## Summary
This repository contains a standalone typescript library for handling [date math expressions](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#date-math), like the ones used in Elasticsearch range queries.

The library relies on a lexer (tokenizer) and a parser for transforming a date math expression into a list of nodes which can be used for manipulating dates. The nodes are divided into 3 categories: operands (for adding or subtracting time), rounding nodes (for rounding to the given unit of time) and timestamp nodes (for fetching a date, for now, only the current date). The date math expressions are defined by the following grammar:
```
Expression -> Timestamp Operands RoundingNode
Operands -> epsilon | Operand Operands
Operand -> Operator Numeral UnitOfTime
Operator -> + | -
RoundingNode -> epsilon | / UnitOfTime
UnitOfTime -> y | M | w | d | h | m | s
Timestamp -> now
```

## How can I use it?
Check ``src/index.ts`` for an example on how to use the ``DateMathExpression`` class in the implementation of the ``parseAndApply`` function. This function applies a date math expression provided in a string to a given date, returning the resulting date. If you want to play around with this demo function:
- Download this repo and open it in your favorite terminal
- Execute ``npm install && npm test && npm run build``
- Go to the node console and import the function ``parseAndApply`` using 
``const { parseAndApply } = require('./dist/src/index');``
- Enjoy!
