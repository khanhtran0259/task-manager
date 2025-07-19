import React, { useEffect, useState } from 'react'
import DashboradLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import UserCard from '../../components/Card/UserCard'

const ManageUser = () => {
  const [allUsers, setAllUsers] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
      if (response.data?.length > 0) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleInvite = async () => {
    setLoading(true)
    setError("")
    setSuccessMessage("")
    try {
      await axiosInstance.post(API_PATHS.ADMIN.CREATE_INVITE_BY_ADMIN_CODE, {
        email: inviteEmail,
      })
      setSuccessMessage("Đã gửi thành công!")
      setInviteEmail("")

      // Đóng popup sau 2s
      setTimeout(() => {
        setShowInviteModal(false)
        setSuccessMessage("")
      }, 2000)

    } catch (err) {
      setError("Gửi thất bại. Vui lòng thử lại.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <DashboradLayout activeMenu="Team Members">
      <div className='mt-5 mb-10'>
        <div className='flex md:flex-row md:items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>Team members</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowInviteModal(true)}
          >
            + Add new member
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allUsers?.map((user) => (
            <UserCard key={user.id} userInfo={user} />
          ))}
        </div>

        {/* Invite Modal (no background overlay) */}
        {showInviteModal && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>

            <input
              type="email"
              placeholder="Enter email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
              disabled={loading || successMessage}
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>}

            <div className="flex justify-end gap-2">
              {!successMessage && (
                <>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading || !inviteEmail}
                  >
                    {loading ? "Adding..." : "Add"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboradLayout>
  )
}

export default ManageUser
