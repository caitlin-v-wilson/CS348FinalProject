import { useState, useEffect } from 'react'
import axios from 'axios'

function Profile({ userId, onLogout, onViewFeed, onViewHistory }) {
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [aboutText, setAboutText] = useState('')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostText, setNewPostText] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [editPostTitle, setEditPostTitle] = useState('')
  const [editPostText, setEditPostText] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/auth/users/${userId}/`)
        setUser(response.data)
        setAboutText(response.data.about || '')
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`/api/auth/posts/?user_owner=${userId}`)
        const posts = response.data.results || response.data
        // Sort by date_created descending
        const sortedPosts = posts.sort((a, b) => {
          return new Date(b.date_created) - new Date(a.date_created)
        })
        setUserPosts(sortedPosts)
      } catch (error) {
        console.error('Error fetching user posts:', error)
      }
    }

    fetchUser()
    fetchUserPosts()
  }, [userId])

  const handleSaveAbout = async () => {
    if (aboutText.length > 300) {
      alert('About section cannot exceed 300 characters')
      return
    }

    try {
      await axios.patch(`/api/auth/users/${userId}/`, {
        about: aboutText
      })
      setUser({ ...user, about: aboutText })
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveAbout()
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Do you want to delete your account?')
    
    if (confirmed) {
      try {
        await axios.delete(`/api/auth/users/${userId}/`)
        alert('Account deleted successfully')
        onLogout()
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Failed to delete account')
      }
    }
  }

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?')
    
    if (confirmed) {
      try {
        await axios.delete(`/api/auth/posts/${postId}/`)
        alert('Post deleted successfully')
        
        // Refresh user posts
        const response = await axios.get(`/api/auth/posts/?user_owner=${userId}`)
        const posts = response.data.results || response.data
        const sortedPosts = posts.sort((a, b) => {
          return new Date(b.date_created) - new Date(a.date_created)
        })
        setUserPosts(sortedPosts)
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Failed to delete post')
      }
    }
  }

  const handleStartEditPost = (post) => {
    setEditingPostId(post.post_id)
    setEditPostTitle(post.post_title)
    setEditPostText(post.post_text)
  }

  const handleSaveEditPost = async () => {
    if (!editPostTitle.trim() || !editPostText.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      await axios.patch(`/api/auth/posts/${editingPostId}/`, {
        post_title: editPostTitle,
        post_text: editPostText
      })
      alert('Post updated successfully')
      setEditingPostId(null)
      
      // Refresh user posts
      const response = await axios.get(`/api/auth/posts/?user_owner=${userId}`)
      const posts = response.data.results || response.data
      const sortedPosts = posts.sort((a, b) => {
        return new Date(b.date_created) - new Date(a.date_created)
      })
      setUserPosts(sortedPosts)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    }
  }

  const handleCancelEditPost = () => {
    setEditingPostId(null)
    setEditPostTitle('')
    setEditPostText('')
  }

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostText.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      await axios.post('/api/auth/posts/', {
        post_title: newPostTitle,
        post_text: newPostText,
        user_owner: userId,
        date_created: new Date().toISOString()
      })
      alert('Post created successfully!')
      setNewPostTitle('')
      setNewPostText('')
      setShowNewPostModal(false)
      
      // Refresh user posts
      const response = await axios.get(`/api/auth/posts/?user_owner=${userId}`)
      const posts = response.data.results || response.data
      const sortedPosts = posts.sort((a, b) => {
        return new Date(b.date_created) - new Date(a.date_created)
      })
      setUserPosts(sortedPosts)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ border: '1px solid black', padding: '20px', width: '300px' }}>
        <h2>Profile</h2>
        <p>Username: {user.username}</p>
        
        {isEditing ? (
          <div>
            <p>About:</p>
            <textarea
              value={aboutText}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setAboutText(e.target.value)
                }
              }}
              onKeyPress={handleKeyPress}
              maxLength="300"
              style={{ width: '100%', height: '100px' }}
            />
            <p>{aboutText.length}/300</p>
            <button onClick={handleSaveAbout}>OK</button>
            <button onClick={() => {
              setIsEditing(false)
              setAboutText(user.about || '')
            }}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>About: {user.about || 'No about info yet'}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        )}
        
        <h3>Your Posts</h3>
        {userPosts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          <div>
            {userPosts.map((post) => (
              <div key={post.post_id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
                {editingPostId === post.post_id ? (
                  <div>
                    <input
                      type="text"
                      value={editPostTitle}
                      onChange={(e) => setEditPostTitle(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                    />
                    <textarea
                      value={editPostText}
                      onChange={(e) => setEditPostText(e.target.value)}
                      style={{ width: '100%', height: '100px', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                    />
                    <button onClick={handleSaveEditPost}>Save</button>
                    <button onClick={handleCancelEditPost}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <h4>{post.post_title}</h4>
                    <p>{post.post_text}</p>
                    <p style={{ fontSize: '12px', color: 'gray' }}>
                      {new Date(post.date_created).toLocaleString()}
                    </p>
                    {isEditing && (
                      <div>
                        <button onClick={() => handleStartEditPost(post)}>Edit</button>
                        <button onClick={() => handleDeletePost(post.post_id)} style={{ color: 'red' }}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <button onClick={() => setShowNewPostModal(true)}>New Post</button>
        <button onClick={onViewFeed}>View Feed</button>
        <button onClick={onViewHistory}>View History</button>
        <button onClick={onLogout}>Logout</button>
        <button onClick={handleDeleteAccount}>Delete Account</button>

        {showNewPostModal && (
          <div style={{ border: '1px solid black', padding: '20px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
            <h3>Create New Post</h3>
            <input
              type="text"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            />
            <textarea
              placeholder="Post Text"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              style={{ width: '100%', height: '150px', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            />
            <button onClick={handleCreatePost}>Post</button>
            <button onClick={() => {
              setShowNewPostModal(false)
              setNewPostTitle('')
              setNewPostText('')
            }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile


