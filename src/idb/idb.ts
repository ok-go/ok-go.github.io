import { Session } from "../imodels/session";

enum Stores {
  Sessions = 'sessions'
}

export class IDB {
  static name = 'larc'
  static version = 1

  private db!: IDBDatabase

  private init = async () => new Promise<boolean>((ok, ko) => {
    const r = indexedDB.open(IDB.name, IDB.version)
    r.onerror = () => {
      console.error('idb initialization failed', r.result.name, r.result.version)
      ko(false)
    }
    r.onsuccess = () => {
      this.db = r.result
      this.db.onclose = () => console.info('idb closed', r.result.name, r.result.version)
      console.info('idb initialization success', this.db.name, this.db.version)
      ok(true)
    }
    r.onupgradeneeded = () => {
      const db = r.result
      if (!db.objectStoreNames.contains(Stores.Sessions)) {
        console.info('idb create sessions store');
        const s = db.createObjectStore(Stores.Sessions, {keyPath: 'id', autoIncrement: true});
        s.createIndex('ind_happensAt', 'happensAt', {unique: false})
      }
    }
  })

  clear = async () => new Promise<boolean>(async (ok, ko) => {
    if (!this.db) {
      await this.init()
    }

    const t = this.db.transaction(Stores.Sessions, 'readwrite', {durability: 'strict'})
    t.oncomplete = () => ok(true)
    t.onerror = (ev) => {
      console.error('idb failed save session', this.db.name, this.db.version, ev)
      ko(false)
    }
    t.objectStore(Stores.Sessions).clear()
  })

  set = async (s: Session) => new Promise<boolean>(async (ok, ko) => {
    if (!this.db) {
      await this.init()
    }

    s.happensAt.setUTCHours(0, 0, 0, 0)

    const t = this.db.transaction(Stores.Sessions, 'readwrite', {durability: 'strict'})
    t.oncomplete = () => ok(true)
    t.onerror = (ev) => {
      console.error('idb failed save session', this.db.name, this.db.version, ev)
      ko(false)
    }
    t.objectStore(Stores.Sessions).put(s)
  })

  add = async (s: Omit<Session, 'id'>) => new Promise<boolean>(async (ok, ko) => {
    if (!this.db) {
      await this.init()
    }

    s.happensAt.setUTCHours(0, 0, 0, 0)

    const t = this.db.transaction(Stores.Sessions, 'readwrite', {durability: 'strict'})
    t.oncomplete = () => ok(true)
    t.onerror = (ev) => {
      console.error('idb failed save session', this.db.name, this.db.version, ev)
      ko(false)
    }
    t.objectStore(Stores.Sessions).add(s)
  })

  del = async (s: Session) => new Promise<boolean>(async (ok, ko) => {
    if (!this.db) {
      await this.init()
    }

    const t = this.db.transaction(Stores.Sessions, 'readwrite', {durability: 'strict'})
    t.oncomplete = () => ok(true)
    t.onerror = (ev) => {
      console.error('idb failed remove session', this.db.name, this.db.version, ev)
      ko(false)
    }
    t.objectStore(Stores.Sessions).delete(s.id)
  })

  getSessions = async () => new Promise<Session[]>(async (ok, ko) => {
    if (!this.db) {
      await this.init()
    }

    const result: Session[] = []
    const t = this.db.transaction(Stores.Sessions, 'readonly')
    t.oncomplete = () => ok(result)
    t.onerror = () => {
      console.error('idb failed load sessions', this.db.name, this.db.version)
      ko()
    }
    const c = t.objectStore(Stores.Sessions).index('ind_happensAt').openCursor(null, 'prev')
    c.onsuccess = () => {
      if (c.result) {
        result.push(c.result.value as Session)
        c.result.continue()
      }
    }
  })
}
