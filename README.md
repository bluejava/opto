# Opto 

Another command line options parser. Small. Tested. 

Features:

- CommonJS/ES6 compatible
- Handles multiple value options
- detects numeric and boolean values and auto-casts
- supports both double-dash `--` and single dash `-` options

## Usage

```bash
npm install opto
# or
yarn add opto
```

Then, in your CLI app:

```javascript
const opto = require("opto")
// ...
const options = opto() // by default will grab process.argv
```

## Multiple Value Options

All options specified have a single value. If an option is used multiple times then it ALSO has `.multi` value with the array of values. So `-a one -a two -a three` will result in the following options object: `{ a: "three", "a.multi": ["one", "two", "three"]}`. 

This makes it easy to process options for which multiple values makes no sense - only the last value specified is used. No need to check the value type to see if it is an array.

## Example

```bash
node index -a -b -c 100 -d false -d hello --e "hello world" -b 3 -b foo bar "bing bang" boom
```

Returns the object

```javascript
 { a: true,
   b: 'foo',
   c: 100,
   d: 'hello',
   e: 'hello world',
   'b.multi': [ true, 3, 'foo' ],
   _: 'boom',
   '_.multi': [ 'bar', 'bing bang', 'boom' ] }
```

