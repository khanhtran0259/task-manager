import React, { useState } from 'react'
import DashboradLayout from '../../components/layouts/DashboradLayout'
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPath'
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from '../../components/inputs/SelectDropdown';
import SelecUsers from '../../components/inputs/SelectUsers';

const CreateTask = () => {
  const location = useLocation();

  const { taskId } = location.state || {};

  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({

    title: "",

    description: "",

    priority: "Low",

    dueDate: "",

    assignedTo: [],
    todoCheckList: [],
    attachments: []
  })

  const [currentTask, setCurrentTask] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
  const handleChangeValue = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }))
  }

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoCheckList: [],
      attachments: []

    })

  }
  const createTask = () => { }
  const updateTask = () => { }
  const handleSubmit = () => { }
  const getTaskDetailsById = async () => { }
  const deleteTask = async () => { }



  return (
    <DashboradLayout activeMenu="CreateTask" >
      <div className="mt-5">

        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">

          <div className="form-card col-span-3">

            <div className="flex item-center justify-between">

              <h2 className="text-xl md:text-xl font-medium">

                {taskId ? "Update Task" : "Create Task"}

              </h2>

              {taskId && (

                <button

                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-500 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"

                  onClick={() => setOpenDeleteAlert(true)}
                >

                  <LuTrash2 className="text-base" /> Delete

                </button>
              )}
            </div>
            <div className='mt-4'>
              <label className="text-xs font-medium text-slate-600">
                Task title
              </label>
              <input
                placeholder='Create App UI'
                className='form-input'
                value={taskData.title}
                onChange={({ target }) =>
                  handleChangeValue("title", target.value)}
              />
            </div>
            <div className='mt-3'>
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea placeholder='Describe task'
                className='form-input'
                row={4}
                value={taskData.description}
                onChange={({ target }) => handleChangeValue("description", target.value)}

              ></textarea>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-2">

              <div className="col-span-6 md:col-span-4">

                <label className="text-xs font-medium text-slate-600">

                  Priority

                </label>

                <SelectDropdown

                  options={PRIORITY_DATA}

                  value={taskData.priority}

                  onChange={(value) => handleChangeValue("priority", value)}

                  placeholder="Select Priority"

                />

              </div>

              <div className='col-span-6 md:col-span-4'>
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input 
                  placeholder='Create app UI'
                  className='form-input'
                  value={taskData.dueDate}
                  onChange={({target}) => handleChangeValue("dueDate", target.value)}
                  type='date'
                />
              </div>

              <div className='col-span-12 md:col-span-3'>
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelecUsers
                selectedUsers = {taskData.assignedTo}
                setSelectedUsers = {(value) => {
                  handleChangeValue("assignedTo", value)
                }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboradLayout>
  )
}

export default CreateTask