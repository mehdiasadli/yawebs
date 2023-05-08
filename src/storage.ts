interface GetOptions {
  parse?: boolean
  defaultValue?: any
  defaultListValue?: any
}
interface SetOptions {
  stringify?: boolean
  overwrite?: boolean
}

const DEFAULT_GETOPTIONS = {
  parse: true,
  defaultValue: null,
  defaultListValue: null
}
const DEFAULT_SETOPTIONS = {
  stringify: true,
  overwrite: true
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

  private _getList(key: string[], defaultValue: any = null) {
    return key.map((k) => this._get(k) || defaultValue)
  }
  private _removeList(key: string[]) {
    key.forEach((k) => this._remove(k))
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
  set(key: string, value: any, options: SetOptions = DEFAULT_SETOPTIONS) {
    const item = this._get(key)
    if (item && !options.overwrite) {
      return { success: false, message: 'Item already exists' }
    }

    this._set(key, value, options.stringify)
    return { success: true, message: 'Item added successfully', data: item }
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
  clear() {
    this.storage.clear()
    return { success: true, message: 'Items deleted successfully' }
  }
}
