import { BrowserStorage } from '../storage'

class SessionStorage extends BrowserStorage {
  constructor() {
    super()
    this.storage = sessionStorage
  }
}

export default new SessionStorage()
