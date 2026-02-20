import { Navigate } from '@solidjs/router'
import { isStaff } from '../store/auth'

export default function AdminGuard(props) {
  return () => (isStaff() ? props.children : <Navigate href="/admin/login" />)
}
