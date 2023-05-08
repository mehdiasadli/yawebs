interface GetOptions {
  parse?: boolean
  defaultValue?: any
}
interface SetOptions {
  stringify?: boolean
  overwrite?: boolean
}

const DEFAULT_GETOPTIONS = {
  parse: true,
  defaultValue: null
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

  get(key: string, options: GetOptions = DEFAULT_GETOPTIONS) {
    const item = this._get(key)
    return item ? (options.parse ? JSON.parse(item) : item) : options.defaultValue
  }
  set(key: string, value: any, options: SetOptions = DEFAULT_SETOPTIONS) {
    const item = this._get(key)
    if (item && !options.overwrite) {
      return { success: false, message: 'Item already exists' }
    }

    this._set(key, value, options.stringify)
    return { success: true, message: 'Item added successfully', data: item }
  }
  remove(key: string) {
    const item = this.get(key)
    this._remove(key)
    return { success: true, message: 'Item removed successfully', data: item }
  }
  clear() {
    this.storage.clear()
    return { success: true, message: 'Items deleted successfully' }
  }
}
