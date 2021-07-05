# TestMe

Testing CLI tool to test javascript apps

## Getting Started

To install `testme`, type

```bash
$ git clone https://github.com/DevTMK/testme.git
$ cd testme
$ npm install
$ npm link
```

Then run this command inside a project folder

```bash
$ testme
```

## Usage

Let's get started by writing a test for a function that adds two numbers. First, create a add.js file:

```javascript
function add(a, b) {
	return a + b
}
module.exports = add
```

Then, create a file named add.test.js. This will contain our actual test:

```javascript
const add = require('./add')

test('adds 1 + 2 to equal 3', () => {
	expect(add(1, 2)).toBe(3)
})
```

Add the following section to your package.json:

```jsonc
"scripts": {
	// ...
	"test": "testme"
}
```

Finally, run `yarn test` or `npm run test` and it will print this message:

```bash
 RUNS  add.test.js
✔ adds 1 + 2 to equal 3
```
