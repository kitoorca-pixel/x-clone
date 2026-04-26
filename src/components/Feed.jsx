import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        setPosts(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) setPosts(data)
  }

  async function handlePost(e) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    await supabase.from('posts').insert({
      content: content.trim(),
      user_name: name.trim() || '匿名',
    })

    setContent('')
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>𝕏</h1>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>ホーム</h2>
        </div>

        <form onSubmit={handlePost} style={styles.postForm}>
          <input
            placeholder="名前（省略すると匿名）"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={30}
            style={styles.nameInput}
          />
          <textarea
            placeholder="いまどうしてる？"
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={280}
            style={styles.textarea}
          />
          <div style={styles.postActions}>
            <span style={styles.charCount}>{content.length}/280</span>
            <button type="submit" disabled={loading || !content.trim()} style={styles.postBtn}>
              {loading ? '投稿中...' : 'ポスト'}
            </button>
          </div>
        </form>

        <div style={styles.feed}>
          {posts.map(post => (
            <div key={post.id} style={styles.post}>
              <div style={styles.postHeader}>
                <span style={styles.postUser}>{post.user_name || '匿名'}</span>
                <span style={styles.postDate}>{new Date(post.created_at).toLocaleString('ja-JP')}</span>
              </div>
              <p style={styles.postContent}>{post.content}</p>
            </div>
          ))}
          {posts.length === 0 && (
            <p style={styles.empty}>まだ投稿がありません。最初の一言を！</p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  sidebar: {
    width: '240px',
    padding: '20px',
    borderRight: '1px solid #2f3336',
  },
  logo: {
    fontSize: '28px',
    margin: '0',
  },
  main: {
    flex: 1,
    borderRight: '1px solid #2f3336',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #2f3336',
    position: 'sticky',
    top: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(12px)',
  },
  headerTitle: {
    margin: '0',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  postForm: {
    padding: '16px',
    borderBottom: '1px solid #2f3336',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nameInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #2f3336',
    color: '#71767b',
    fontSize: '14px',
    padding: '4px 0',
    outline: 'none',
    width: '100%',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    background: 'transparent',
    border: 'none',
    color: '#e7e9ea',
    fontSize: '18px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  postActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
  },
  charCount: {
    color: '#71767b',
    fontSize: '14px',
  },
  postBtn: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    background: '#1d9bf0',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '15px',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
  },
  post: {
    padding: '16px',
    borderBottom: '1px solid #2f3336',
  },
  postHeader: {
    display: 'flex',
    gap: '8px',
    alignItems: 'baseline',
    marginBottom: '6px',
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: '15px',
  },
  postDate: {
    color: '#71767b',
    fontSize: '13px',
  },
  postContent: {
    margin: '0',
    fontSize: '15px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  empty: {
    color: '#71767b',
    textAlign: 'center',
    padding: '40px',
  },
}
