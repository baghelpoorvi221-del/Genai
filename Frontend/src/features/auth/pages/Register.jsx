import React, { useState } from 'react'
import {useNavigate,Link} from 'react-router'
import  {useAuth} from '../hooks/useAuth'
const Register = () => { 


    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")


    const {loading,handleRegister} = useAuth()

    const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
     e.preventDefault()
     setError(null)
     try {
         await handleRegister({username,email,password})
         navigate("/interview")
     } catch (err) {
         setError(err.response?.data?.message || "Registration failed. Please try again.")
     }
 }

 if(loading){
    return(<main><h1>Loading.......</h1></main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Create Account</h1>
        {error && <div style={{ color: '#ff2d55', marginBottom: '20px', padding: '12px', background: 'rgba(255, 45, 85, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 45, 85, 0.2)', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              onChange={(e) => setUsername(e.target.value)}
              type="text" id="username" name='username' placeholder='Choose a username' required />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)}
              type="email" id="email" name='email' placeholder='name@example.com' required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              onChange={(e) => setpassword(e.target.value)}
              type="password" id="password" name='password' placeholder='••••••••' required />
          </div>

          <button type="submit" className='btn btn-primary' style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </main>
  )

}

export default Register