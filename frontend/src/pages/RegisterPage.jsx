import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    })
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const { register, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/decks')
        return null
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear field error when user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const errors = {}

        if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
        }

        if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters'
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const { confirmPassword, ...registerData } = formData
            await register(registerData)
            // Redirect to login page with success message
            navigate('/login?registered=true')
        } catch (err) {
            if (err.response?.data?.errors) {
                setFieldErrors(err.response.data.errors)
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card auth-card-wide">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Start your learning journey today</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                {fieldErrors.firstName && (
                                    <span className="form-error">{fieldErrors.firstName}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                                {fieldErrors.lastName && (
                                    <span className="form-error">{fieldErrors.lastName}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.username && (
                                <span className="form-error">{fieldErrors.username}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.email && (
                                <span className="form-error">{fieldErrors.email}</span>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                {fieldErrors.password && (
                                    <span className="form-error">{fieldErrors.password}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                {fieldErrors.confirmPassword && (
                                    <span className="form-error">{fieldErrors.confirmPassword}</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
