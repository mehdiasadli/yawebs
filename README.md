# YAWEBS


## Installation

```bash
npm install yawebs
```

## Usage

```js
import { local } from 'yawebs'

// GET
local.get('my-key')

// SET
local.set('my-new-key', 'hello world!')

// REMOVE
local.remove('my-new-key')

// CLEAR
local.clear()
```

## API

```ts
interface GetOptions {
  parse?: boolean // parses the value
  defaultValue?: any // returns the default value if no key is found
}
const DEFAULT_GETOPTIONS = {
  parse: true,
  defaultValue: null
}

local.get(key: string, options: GetOptions = DEFAULT_GETOPTIONS) // Gets the item with the specified key from the storage

interface SetOptions {
  stringify?: boolean // Stringifies the value before sending to the storage
  overwrite?: boolean // If true overwrites existing item, else does not add the new item if the key already exists
}
const DEFAULT_SETOPTIONS = {
  stringify: true,
  overwrite: true
}

local.set(key: string, options: SetOptions = DEFAULT_SETOPTIONS) // Sets the new key, value pair to the storage

local.remove(key: string) // Removes the item with the specified key from the storage
local.clear() // Removes all the items from the storage
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.