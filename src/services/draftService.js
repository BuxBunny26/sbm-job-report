import { openDB } from 'idb'

const DB_NAME = 'sbm-job-report'
const STORE_NAME = 'drafts'
const DB_VERSION = 1

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export async function saveDraft(id, data) {
  const db = await getDB()
  const draft = {
    id,
    data,
    updatedAt: new Date().toISOString()
  }
  await db.put(STORE_NAME, draft)
  return draft
}

export async function getDraft(id) {
  const db = await getDB()
  return db.get(STORE_NAME, id)
}

export async function getAllDrafts() {
  const db = await getDB()
  const drafts = await db.getAll(STORE_NAME)
  return drafts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export async function deleteDraft(id) {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

export async function clearAllDrafts() {
  const db = await getDB()
  await db.clear(STORE_NAME)
}

export default {
  saveDraft,
  getDraft,
  getAllDrafts,
  deleteDraft,
  clearAllDrafts
}
