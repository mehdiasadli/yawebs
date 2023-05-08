import { BrowserStorage } from '../storage'

class LocalStorage extends BrowserStorage {
  constructor() {
    super()
    this.storage = localStorage
  }
}

export default new LocalStorage()
