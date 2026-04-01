import { useState, useEffect } from 'react'
import axios from 'axios'

function Feed({ onBackToProfile }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/posts/')
      const allPosts = response.data.results || response.data
      
      // Sort by date_created descending (most recent first)
      const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.date_created) - new Date(a.date_created)
      })
      
      setPosts(sortedPosts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ width: '600px' }}>
        <h2>Feed</h2>
        <button onClick={onBackToProfile}>Back to Profile</button>
        
        {posts.length === 0 ? (
          <p>Nothing yet</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post.post_id} style={{ border: '1px solid black', padding: '15px', marginBottom: '15px' }}>
                <h3>{post.post_title}</h3>
                <p>{post.post_text}</p>
                <p style={{ fontSize: '12px', color: 'gray' }}>
                  {new Date(post.date_created).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed
