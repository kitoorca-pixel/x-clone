import { useState } from 'react'
import { supabase } from '../supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>𝕏</h1>
        <h2 style={styles.title}>{isLogin ? 'ログイン' : 'アカウント作成'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? '処理中...' : isLogin ? 'ログイン' : '登録'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isLogin ? 'アカウントをお持ちでない方は' : '既にアカウントをお持ちの方は'}
          <button onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? ' 新規登録' : ' ログイン'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#000',
  },
  card: {
    background: '#111',
    borderRadius: '12px',
    padding: '40px',
    width: '360px',
    border: '1px solid #2f3336',
  },
  logo: {
    textAlign: 'center',
    fontSize: '36px',
    color: '#fff',
    margin: '0 0 16px',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #2f3336',
    background: '#000',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    borderRadius: '24px',
    border: 'none',
    background: '#1d9bf0',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: '#f4212e',
    fontSize: '13px',
    margin: '0',
  },
  toggle: {
    color: '#71767b',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#1d9bf0',
    cursor: 'pointer',
    fontSize: '14px',
  },
}
