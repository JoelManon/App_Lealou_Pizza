import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { login } from '../store/auth'
import './AdminLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = createSignal('')
  const [error, setError] = createSignal('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (login(password())) {
      navigate('/admin')
    } else {
      setError('Mot de passe incorrect.')
    }
  }

  return (
    <div class="admin-login">
      <div class="login-card">
        <h1>Espace Staff</h1>
        <p>Connectez-vous pour accéder au tableau de bord</p>

        <form onSubmit={handleSubmit}>
          <label>
            Mot de passe
            <input
              type="password"
              value={password()}
              onInput={e => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </label>
          {error() && <p class="error">{error()}</p>}
          <button type="submit" class="btn btn-primary">
            Connexion
          </button>
        </form>

      </div>
    </div>
  )
}
