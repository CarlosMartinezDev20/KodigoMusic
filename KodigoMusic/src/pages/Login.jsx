import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'

const schema = yup.object({
  email: yup.string().email('Correo inválido').required('El correo es requerido'),
  password: yup.string().required('La contraseña es requerida')
})

export default function Login() {
  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  })
  const auth = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await auth.login(data.email, data.password)
      navigate('/app')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="auth-layout">
      <div className="card auth-card">
        <div className="brand">
          <img src="/logo.svg" alt="logo" />
          <h1>Kodigo Music</h1>
          <p className="muted">Explora y escucha previews de tus artistas favoritos</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label>Correo</label>
            <input type="email" placeholder="tucorreo@email.com" {...reg('email')} />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <div className="form-field">
            <label>Contraseña</label>
            <input type="password" placeholder="********" {...reg('password')} />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <button className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
          <p className="muted center">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
