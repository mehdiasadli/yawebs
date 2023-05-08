interface KeyOptions {
  defaultValue?: any
  defaultListValue?: any
}
interface GetOptions extends KeyOptions {
  parse?: boolean
}
interface SetOptions {
  stringify?: boolean
  overwrite?: boolean
}

const DEFAULT_GETOPTIONS: GetOptions = {
  parse: true,
  defaultValue: null,
  defaultListValue: null
}
const DEFAULT_SETOPTIONS: SetOptions = {
  stringify: true,
  overwrite: true
}
const DEFAULT_KEYOPTIONS: KeyOptions = {
  defaultValue: null
}

export class BrowserStorage {
  storage: Storage

  constructor(type = localStorage) {
    this.storage = type
  }

  private _get(key: string) {
    return this.storage.getItem(key)
  }
  private _set(key: string, value: any, stringify: boolean = true) {
    value = stringify ? JSON.stringify(value) : value
    this.storage.setItem(key, value)
  }
  private _remove(key: string) {
    this.storage.removeItem(key)
  }
  private _key(index: number) {
    return this.storage.key(index)
  }

  private _getList(keys: string[], defaultValue: any = null) {
    return keys.map((key) => this._get(key) || defaultValue)
  }
  private _keyList(indexes: number[], defaultValue: any = null) {
    return indexes.map((index) => this._key(index) || defaultValue)
  }
  private _removeList(keys: string[]) {
    keys.forEach((key) => this._remove(key))
  }

  private _getItemWithKey(key: string, defaultValue: any = null) {
    const item = this.get(key)
    if (!item) return defaultValue

    return { key, value: item }
  }
  private _getItemWithIndex(index: number, defaultValue: any = null) {
    const item = this.key(index)
    if (!item) return defaultValue

    const value = this.get(item)
    if (!value) return defaultValue

    return { key: item, value }
  }

  get(key: string | string[], options: GetOptions = DEFAULT_GETOPTIONS) {
    if (typeof key === 'string') {
      const item = this._get(key)
      return item ? (options.parse ? JSON.parse(item) : item) : options.defaultValue
    }

    const items = this._getList(key).filter((item) => item)
    return items.length === 0
      ? options.defaultListValue
      : options.parse
      ? items.map((item) => JSON.parse(item as string))
      : items
  }
  key(index: number | number[], options: KeyOptions = DEFAULT_KEYOPTIONS) {
    if (typeof index === 'number') {
      const item = this._key(index)
      return item || options.defaultValue
    }

    const items = this._keyList(index).filter((item) => item)
    return items.length === 0 ? options.defaultListValue : items
  }
  set(key: string, value: any, options: SetOptions = DEFAULT_SETOPTIONS) {
    const item = this._get(key)
    if (item && !options.overwrite) {
      return { success: false, message: 'Item already exists' }
    }

    this._set(key, value, options.stringify)
    return { success: true, message: 'Item added successfully', data: item }
  }
  update(key: string, value: any, stringify: boolean = true) {
    return this.set(key, value, { stringify, overwrite: true })
  }
  add(key: string, value: any, stringify: boolean = true) {
    return this.set(key, value, { stringify, overwrite: false })
  }
  getItem(key: string | number, defaultValue: any = null) {
    if (typeof key === 'string') {
      return this._getItemWithKey(key, defaultValue)
    }

    return this._getItemWithIndex(key, defaultValue)
  }
  remove(key: string | string[]) {
    if (typeof key === 'string') {
      const item = this.get(key)
      this._remove(key)
      return { success: true, message: 'Item removed successfully', data: item }
    }

    this._removeList(key)
    return { success: true, message: 'Items removed successfully' }
  }
  all() {
    let result = []

    for (let i = 0; i < this.storage.length; i++) {
      const item = this.getItem(i)
      result.push(item)
    }

    return result
  }
  clear() {
    this.storage.clear()
    return { success: true, message: 'Items deleted successfully' }
  }
}
