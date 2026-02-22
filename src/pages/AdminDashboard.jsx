import { createSignal, onMount } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { logout } from '../store/auth'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = createSignal({ total: 0, pending: 0, menuCount: 0 })

  onMount(async () => {
    try {
      const [menuRes, all, pending] = await Promise.all([
        fetch('/api/menu').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/orders?status=pending').then(r => r.json()),
      ])
      const today = new Date().toDateString()
      const todayCount = all.filter(o => new Date(o.created_at).toDateString() === today).length
      const menuCount = (menuRes.menuItems || []).length
      setStats({ total: todayCount, pending: pending.length, menuCount })
    } catch (e) {
      console.error(e)
    }
  })

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div class="admin-dashboard">
      <header class="admin-header">
        <div class="container admin-header-inner">
          <h1>Tableau de bord Staff</h1>
          <div class="admin-actions">
            <A href="/">Retour au site</A>
            <button class="btn btn-outline-sm" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main class="admin-main container">
        <section class="admin-section">
          <h2>Vue d'ensemble</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">{stats().menuCount}</span>
              <span class="stat-label">Articles au menu</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{stats().total}</span>
              <span class="stat-label">Commandes aujourd'hui</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{stats().pending}</span>
              <span class="stat-label">En attente</span>
            </div>
          </div>
        </section>

        <section class="admin-section">
          <h2>Actions rapides</h2>
          <div class="quick-actions">
            <A href="/admin/menu" class="action-card">
              <span class="action-icon">📋</span>
              <span>Gestion carte menu</span>
            </A>
            <A href="/admin/orders" class="action-card">
              <span class="action-icon">📦</span>
              <span>Gérer les commandes</span>
            </A>
            <A href="/admin/clients" class="action-card">
              <span class="action-icon">👥</span>
              <span>Gestion des clients</span>
            </A>
            <A href="/admin/scanner" class="action-card action-scanner">
              <span class="action-icon">📱</span>
              <span>Scanner Fidélité</span>
            </A>
          </div>
        </section>
      </main>
    </div>
  )
}
