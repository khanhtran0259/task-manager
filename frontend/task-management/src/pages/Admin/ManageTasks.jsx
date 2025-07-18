import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskCard from '../../components/Card/TaskCard'

const ManageTask = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFillterStatus] = useState("All")
  const navigate = useNavigate()
  const getAllTasks = async (filterStatus) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status: filterStatus === "All" ? "" : filterStatus,
          },
        }
      )
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

      const statusSummary = response.data?.statusSummary || {}
      const statusArray = [
        { label: "All", count: statusSummary.allTasks || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ]
      setTabs(statusArray)

    } catch (error) {
      console.error("Error fetching user: ", error)
    }
  }

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData.id } })
  }

  useEffect(() => {
    getAllTasks(filterStatus)
    return () => { }

  }, [filterStatus])

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
            <button className='flex lg:hidden '

            >
              <LuFileSpreadsheet className='text-lg' />
              Download report
            </button>
          </div>
          {tabs?.[0]?.count > 0 && (
            <div className='flex items-center gap-3 '>
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFillterStatus}
              />
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allTasks?.map((item) => {
            const checklist = item.todoChecklist || [];
            const completedTodoCount = checklist.filter(todo => todo.completed).length;
            const totalTodos = checklist.length;
            const calculatedProgress = totalTodos > 0
              ? Math.floor((completedTodoCount / totalTodos) * 100)
              : 0;

            return (
              <TaskCard
                key={item.id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={calculatedProgress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={completedTodoCount}
                todoChecklist={checklist}
                onClick={() => handleClick(item)}
              />
            )
          })}
        </div>
      </div>
    </DashboardLayout >
  )
}

export default ManageTask