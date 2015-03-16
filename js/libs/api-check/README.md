# apiCheck.js

[![Build Status](https://travis-ci.org/kentcdodds/apiCheck.js.svg)](https://travis-ci.org/kentcdodds/apiCheck.js)
[![Coverage Status](https://coveralls.io/repos/kentcdodds/apiCheck.js/badge.svg?branch=master)](https://coveralls.io/r/kentcdodds/apiCheck.js?branch=master)
*<-- if that build is ever red or that number is ever less than 100% then I want you to
[flame me on twitter (@kentcdodds)](https://twitter.com/kentcdodds) and be sure to mention how disappointed
[@josepheames](https://twitter.com/josepheames) would be in me*

It's like [ReactJS `propTypes`](http://facebook.github.io/react/docs/reusable-components.html) without React. Actually,
it's very heavily inspired by this concept. It's purpose is for normal JavaScript functions rather than just React
Components.

![Demo Screenshot](other/screenshot.png)

## Installation

`$ npm i -S api-check` or `$bower i -S api-check`

apiCheck.js utilizes [UMD](https://github.com/umdjs/umd), so you can:

`var apiCheck = require('api-check')(/* your custom options and checkers*/);` (also available as AMD module or global)

## Example

Note, there are a bunch of tests. Those should be instructive as well.

```javascript
// given we have a function like this:
function foo(bar, foobar) {
  // we can define our api as the first argument to apiCheck.warn
  apiCheck.warn([apiCheck.number, apiCheck.arrayOf(apiCheck.string)], arguments);
  // do stuff
}
// the function above can be called like so:
foo(3, ['a','b','c']);

// if it were called like so, a descriptive warning would be logged to the console
foo('whatever', false);


// here's something a little more complex
function doSomething(person, options, callback) {
  apiCheck.warn([ // you can also do apiCheck.throw to throw an exception
    apiCheck.shape({
      name: apiCheck.shape({
        first: apiCheck.string,
        last: apiCheck.string
      }),
      age: apiCheck.number,
      isOld: apiCheck.bool,
      walk: apiCheck.func,
      childrenNames: apiCheck.arrayOf(apiCheck.string).optional
    }),
    apiCheck.any.optional,
    apiCheck.func
  ], arguments);

  // do stuff
}

// the function above can be called in the following ways:
var person = {
  name: {
    first: 'Matt',
    last: 'Meese'
  },
  age: 27,
  isOld: false,
  walk: function() {}
};
function callback() {}
var options = 'whatever I want because it is an "any" type';
doSomething(person, options, callback);
doSomething(person, callback); // <-- options is optional
doSomething(callback); // <-- this would fail because person is not optional


// if you only wish to check the first argument to a function, you don't need to supply an array.
function bar(a) {
  var errorMessage = apiCheck(apiCheck.string, arguments);
  if (!errorMessage) {
    // success
  } else if (typeof errorMessage === 'string') {
    // there was a problem and errorMessage would like to tell you about it
  }
}
bar('hello!'); // <-- success!
```

## Differences from React's propTypes

Differences in [Supported Types](#supported-types) noted below with a *

- All types are required by default, to set something as optional, append `.optional`
- checkApi.js does not support `element` and `node` types
- checkApi.js supports a few additional types
- `object` fails on null. Use `object.nullOk` if you don't want that

## Similarities to React's propTypes

This project was totally written from scratch, but it (should) support the same api as React's `propTypes` (with the
noted difference above). If you notice something that functions differently, please file an issue.

## apiCheck(), apiCheck.warn(), and apiCheck.throw()

These functions do the same thing, with minor differences. In both the `warn` and `throw` case, a message is generated
based on the arguments that the function was received and the api that was defined to describe what was wrong with the
invocation.

In all cases, an object is returned with the following properties:

### argTypes (arrayOf[Object])

This is an array of objects representing the types of the arguments passed.

### apiTypes (arrayOf[Object])

This is an object representing the types of the api. It's a whole language of its own that you'll hopefully get after
looking at it for a while.

### failed (boolean)

Will be false when the check passes, and true when it fails

### passed (boolean)

Will be true when the check passes, and false when it fails

### message (string)

If the check failed, this will be a useful message for display to the user. If it passed, this will be an empty string

Also note that if you only have one argument, then the first argument to the `apiCheck` function can simply be the
checker function. For example:

```javascript
apiCheck(apiCheck.bool, arguments);
```

The second argument can either be an arguments-like object or an array.

## Supported types

### array

```javascript
apiCheck.array([]); // <-- pass
apiCheck.array(23); // <-- fail
```

### bool

```javascript
apiCheck.bool(false); // <-- pass
apiCheck.bool('me bool too?'); // <-- fail
```

### func

```javascript
apiCheck.func(function() {}); // <-- pass
apiCheck.func(new RegExp()); // <-- fail
```

### func.withProperties *

*Not available in React's `propTypes`*

```javascript
var checker = apiCheck.func.withProperties({
  type: apiCheck.oneOfType([apiCheck.object, apiCheck.string]),
  help: apiCheck.string.optional
});
function winning(){}
winning.type = 'awesomeness';
checker(winning); // <--pass

function losing(){}
checker(losing); // <-- fail
```

### number

```javascript
apiCheck.number(423.32); // <-- pass
apiCheck.number({}); // <-- fail
```

### object *

`null` fails, use [`object.nullOk`](#objectnullok-) to allow null to pass

```javascript
apiCheck.object({}); // <-- pass
apiCheck.object([]); // <-- fail
apiCheck.object(null); // <-- fail
```

#### object.nullOk *

*Not available in React's `propTypes`*

``` javascript
apiCheck.object.nullOk({}); // <-- pass
apiCheck.object.nullOk([]); // <--- false
apiCheck.object.nullOk(null); // <-- pass
```

### string

```javascript
apiCheck.string('I am a string!'); // <-- pass
apiCheck.string([]); // <-- fail
```

### instanceOf

```javascript
apiCheck.instanceOf(RegExp)(new RegExp); // <-- pass
apiCheck.instanceOf(Date)('wanna go on a date?'); // <-- fail
```

### oneOf

```javascript
apiCheck.oneOf(['Treek', ' Wicket Wystri Warrick'])('Treek'); // <-- pass
apiCheck.oneOf(['Chewbacca', 'Snoova'])('Snoova'); // <-- fail
```

### oneOfType

```javascript
apiCheck.oneOfType([apiCheck.string, apiCheck.object])({}); // <-- pass
apiCheck.oneOfType([apiCheck.array, apiCheck.bool])('Kess'); // <-- fail
```

### arrayOf

```javascript
apiCheck.arrayOf(apiCheck.string)(['Huraga', 'Japar', 'Kahless']); // <-- pass
apiCheck.arrayOf(
  apiCheck.arrayOf(
    apiCheck.arrayOf(
      apiCheck.number
    )
  )
)([[[1,2,3], [4,5,6], [7,8,9]], [[1,2,3], [4,5,6], [7,8,9]]]); // <-- pass (for realz)
apiCheck.arrayOf(apiCheck.bool)(['a', 'b', 'c']); // <-- fail
```

### typeOrArrayOfType *

*Not available in React's `propTypes`*

Convenience checker that combines `oneOfType` with `arrayOf` and whatever you specify. So you could take this:

```javascript
apiCheck.oneOfType([
  apiCheck.string, apiCheck.arrayOf(apiCheck.string)
]);
```

with

```javascript
apiCheck.typeOrArrayOfType(apiCheck.string);
```

which is a common enough use case to justify the checker.

```javascript
apiCheck.typeOrArrayOfType(apiCheck.string)('string'); // <-- pass
apiCheck.typeOrArrayOfType(apiCheck.string)(['array', 'of strings']); // <-- pass
apiCheck.typeOrArrayOfType(apiCheck.bool)(['array', false]); // <-- fail
apiCheck.typeOrArrayOfType(apiCheck.object)(32); // <-- fail
```

### objectOf

```javascript
apiCheck.objectOf(apiCheck.arrayOf(apiCheck.bool))({a: [true, false], b: [false, true]}); // <-- pass
apiCheck.objectOf(apiCheck.number)({a: 'not a number?', b: 'yeah, me neither (◞‸◟；)'}); // <-- fail
```

### shape *

*Note: React `propTypes` __does__ support `shape`, however it __does not__ support the `strict` option*

If you add `strict = true` to the `shape`, then it will enforce that the given object does not have any extra properties
outside those specified in the `shape`. See below for an example...

```javascript
apiCheck.shape({
  name: checkers.shape({
    first: checkers.string,
    last: checkers.string
  }),
  age: checkers.number,
  isOld: checkers.bool,
  walk: checkers.func,
  childrenNames: checkers.arrayOf(checkers.string)
})({
  name: {
    first: 'Matt',
    last: 'Meese'
  },
  age: 27,
  isOld: false,
  walk: function() {},
  childrenNames: []
}); // <-- pass
apiCheck.shape({
  mint: checkers.bool,
  chocolate: checkers.bool
})({mint: true}); // <-- fail
```

Example of `strict`

```javascript
var strictShape = apiCheck.shape({
  cookies: apiCheck.bool,
  milk: apiCheck.bool,
  popcorn: apiCheck.bool.optional
});

strictShape.strict = true; // <-- that!

strictShape({
  cookies: true,
  milk: true,
  popcorn: true,
  candy: true
}); // <-- fail because the extra `candy` property

strictShape({
  cookies: true,
  milk: true
}); // <-- pass because it has no extra properties and `popcorn` is optional
```

#### shape.onlyIf *

*Not available in React's `propTypes`*

This can only be used in combination with `shape`

```javascript
apiCheck.shape({
  cookies: apiCheck.shape.onlyIf(['mint', 'chips'], apiCheck.bool)
})({cookies: true, mint: true, chips: true}); // <-- pass

apiCheck.shape({
  cookies: apiCheck.shape.onlyIf(['mint', 'chips'], apiCheck.bool)
})({chips: true}); // <-- pass (cookies not specified)

apiCheck.shape({
  cookies: apiCheck.shape.onlyIf('mint', apiCheck.bool)
})({cookies: true}); // <-- fail
```

#### shape.ifNot *

*Not available in React's `propTypes`*

This can only be used in combination with `shape`

```javascript
apiCheck.shape({
  cookies: apiCheck.shape.ifNot('mint', apiCheck.bool)
})({cookies: true}); // <-- pass

apiCheck.shape({
  cookies: apiCheck.shape.ifNot(['mint', 'chips'], apiCheck.bool)
})({cookies: true, chips: true}); // <-- fail
```

### args *

*Not available in React's `propTypes`*

This will check if the given item is an `arguments`-like object (non-array object that has a length property)

```javascript
function foo(bar) {
  apiCheck.args(arguments); // <-- pass
}
apiCheck.args([]); // <-- fail
apiCheck.args({}); // <-- fail
apiCheck.args({length: 3}); // <-- pass
apiCheck.args({length: 'not-number'}); // <-- fail
```

### any

```javascript
apiCheck.any({}); // <-- pass
apiCheck.any([]); // <-- pass
apiCheck.any(true); // <-- pass
apiCheck.any(false); // <-- pass
apiCheck.any(/* seriously, anything, except undefined */); // <-- fail
apiCheck.any.optional(/* unless you specify optional :-) */); // <-- pass
apiCheck.any(3); // <-- pass
apiCheck.any(3.1); // <-- pass
apiCheck.any(3.14); // <-- pass
apiCheck.any(3.141); // <-- pass
apiCheck.any(3.1415); // <-- pass
apiCheck.any(3.14159); // <-- pass
apiCheck.any(3.141592); // <-- pass
apiCheck.any(3.1415926); // <-- pass
apiCheck.any(3.14159265); // <-- pass
apiCheck.any(3.141592653); // <-- pass
apiCheck.any(3.1415926535); // <-- pass
apiCheck.any(3.14159265359); // <-- pass
apiCheck.any(jfio,.jgo); // <-- Syntax error.... ಠ_ಠ
```

## Custom Types

You can specify your own type. You do so like so:

```javascript
function foo(string, ipAddress) {
  apiCheck.warn([
    apiCheck.string,
    ipAddressChecker
  ], arguments);

  function ipAddressChecker(val, name, location) {
    if (!/(\d{1,3}\.){3}\d{1,3}/.test(val)) {
      return apiCheck.utils.getError(name, location, ipAddressChecker.type);
    }
  };
  ipAddressChecker.type = 'ipAddressString';
}
```

Then, if you invoked that function like this:

```javascript
foo('hello', 'not-an-ip-address');
```

It would result in a warning like this:

```
apiCheck failed! `Argument 1` passed, `value` at `Argument 2` must be `undefined`

You passed:
[
  "hello",
  "not-an-ip-address"
]

With the types of:
[
  "String",
  "String"
]

The API calls for:
[
  "String",
  "ipAddressChecker"
]
```

There's actually quite a bit of cool stuff you can do with custom types checkers. If you want to know what they are,
look at the tests or file an issue for me to go document them. :-)


## Customization

*Note, obviously, these things are specific to `apiCheck` and not part of React `propTypes`*

### config.output

You can specify some extra options for the output of the message.

```javascript
apiCheck.config.output = {
  prefix: 'Global prefix',
  suffix: 'global suffix',
  docsBaseUrl: 'https://example.com/errors-and-warnings#'
};
```

You can also specify an `output` object to each `apiCheck()`, `apiCheck.throw()`, and `apiCheck.warn()` request:

```javascript
apiCheck(apiCheck.bool, arguments, {
  prefix: 'instance prefix:',
  suffix: 'instance suffix',
  url: 'example-error-additional-info'
});
```

A failure with the above configuration would yield something like this:

```
Global prefix instance prefix {{error message}} instance suffix global suffix https://example.com/errors-and-warnings#example-error-additional-info
```


### getErrorMessage

This is the method that apiCheck uses to get the message it throws or console.warns. If you don't like it, feel free to
make a better one by simply: `apiCheck.getErrorMessage = function(api, args, output) {/* return message */}`

### handleErrorMessage

This is the method that apiCheck uses to throw or warn the message. If you prefer to do your own thing, that's cool.
Simply `apiCheck.handleErrorMessage = function(message, shouldThrow) { /* throw or warn */ }`

### Disable apiCheck

It's a good idea to disable the apiCheck in production. To do this, simply invoke `disable()`

```javascript
apiCheck.disable();

// to re-enable it
apiCheck.enable();
```

## Credits

This library was written by [Kent C. Dodds](https://twitter.com/kentcdodds). Again, big credits go to the team working
on React for thinking up the api. This library was written from scratch, but I'd be lying if I didn't say that I
referenced their functions a time or two.