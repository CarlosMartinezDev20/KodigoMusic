import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'

const schema = yup.object({
  fullName: yup.string().required('Tu nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('Correo inválido').required('El correo es requerido'),
  password: yup.string()
    .required('La contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .matches(/[a-z]/, 'Debe tener al menos una minúscula')
    .matches(/[0-9]/, 'Debe tener al menos un número')
    .matches(/[!@#$%&*?.,_:<>"|\-]/, 'Debe tener al menos un carácter especial'),
  confirm: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña')
})

export default function Register() {
  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  })
  const auth = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 400))
    auth.register(data)
    navigate('/app')
  }

  return (
    <div className="auth-layout">
      <div className="card auth-card">
        <div className="brand">
          <img src="/logo.svg" alt="logo" />
          <h1>Crear cuenta</h1>
          <p className="muted">Tu música, un click de distancia</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label>Nombre completo</label>
            <input type="text" placeholder="Carlos Martínez" {...reg('fullName')} />
            {errors.fullName && <span className="error">{errors.fullName.message}</span>}
          </div>
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
          <div className="form-field">
            <label>Confirmar contraseña</label>
            <input type="password" placeholder="********" {...reg('confirm')} />
            {errors.confirm && <span className="error">{errors.confirm.message}</span>}
          </div>
          <button className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Registrarme'}
          </button>
          <p className="muted center">
            ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
