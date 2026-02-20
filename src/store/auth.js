import { createSignal } from 'solid-js'
import { STAFF_PASSWORD } from '../config/auth'

export const [user, setUser] = createSignal(null)
export const [isStaff, setIsStaff] = createSignal(false)

export function login(password) {
  if (password === STAFF_PASSWORD) {
    setUser({ name: 'Staff', role: 'staff' })
    setIsStaff(true)
    return true
  }
  return false
}

export function logout() {
  setUser(null)
  setIsStaff(false)
}
