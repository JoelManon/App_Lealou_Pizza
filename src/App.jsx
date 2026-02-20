import { Router, Route } from '@solidjs/router'
import { useLocation } from '@solidjs/router'
import { Show } from 'solid-js'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Order from './pages/Order'
import Contact from './pages/Contact'
import Fidelity from './pages/Fidelity'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import AdminClients from './pages/AdminClients'
import AdminGuard from './components/AdminGuard'

function RootLayout(props) {
  const location = useLocation()
  const isAdmin = () =>
    location.pathname.startsWith('/admin')

  return (
    <div class={isAdmin() ? 'admin-app' : 'app'}>
      <Show when={!isAdmin()}>
        <Header />
      </Show>
      <main class={isAdmin() ? 'admin-main-wrap' : 'main'}>
        {props.children}
      </main>
      <Show when={!isAdmin()}>
        <Footer />
      </Show>
    </div>
  )
}

function App(appProps) {
  return (
    <Router url={appProps.url} root={RootLayout}>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/panier" component={Cart} />
      <Route path="/commande" component={Order} />
      <Route path="/contact" component={Contact} />
      <Route path="/fidelite" component={Fidelity} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminGuard}>
        <Route path="/" component={AdminDashboard} />
        <Route path="/orders" component={AdminOrders} />
        <Route path="/clients" component={AdminClients} />
      </Route>
    </Router>
  )
}

export default App
