import { useState, useEffect } from 'react'
import axios from 'axios'

function History({ onBackToProfile }) {
  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users/')
      const allUsers = response.data.results || response.data
      setUsers(allUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates')
      return
    }

    setLoading(true)
    try {
      let url = `/api/auth/statistics/?start_date=${startDate}&end_date=${endDate}`
      if (selectedUser) {
        url += `&user_owner=${selectedUser}`
      }

      const response = await axios.get(url)
      setStatistics(response.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      alert('Error generating report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '600px' }}>
        <h2>History & Statistics</h2>
        <button onClick={onBackToProfile}>Back to Profile</button>

        <div style={{ border: '1px solid black', padding: '20px', marginTop: '20px' }}>
          <h3>Generate Report</h3>
          
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginBottom: '15px', marginRight: '20px' }}
          />
          
          <label>End Date: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginBottom: '15px' }}
          />

          <br />

          <label>Filter by User (Optional): </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ marginBottom: '15px', marginLeft: '10px' }}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.username}
              </option>
            ))}
          </select>

          <br />

          <button onClick={handleGenerateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {statistics && (
          <div style={{ border: '1px solid green', padding: '20px', marginTop: '20px' }}>
            <h3>Report Results</h3>
            <p><strong>Total Posts:</strong> {statistics.post_count}</p>
            <p><strong>User with Most Posts:</strong> {statistics.top_user || 'N/A'} ({statistics.top_user_count} posts)</p>
            <p><strong>User with Longest Post:</strong> {statistics.longest_post_user || 'N/A'} ({statistics.longest_post_length} characters)</p>
            
            {statistics.posts.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Posts in Report:</h4>
                {statistics.posts.map((post) => (
                  <div key={post.post_id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
                    <h5>{post.post_title}</h5>
                    <p>{post.post_text}</p>
                    <p style={{ fontSize: '12px', color: 'gray' }}>
                      {new Date(post.date_created).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
