import React, { useEffect, useState } from 'react'
import DashboradLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPath'
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from '../../components/inputs/SelectDropdown';
import SelecUsers from '../../components/inputs/SelectUsers';
import TodoListInput from '../../components/inputs/TodoListInput';
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';


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
        todoChecklist: [],
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
            todoChecklist: [],
            attachments: []

        })

    }
    const createTask = async () => {
        setLoading(true)
        try {
            const todoList = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false
            }))
            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todoList,
            })
            toast.success("Task created successfully")
            clearData()
        } catch (error) {
            console.error("Error creating task:", error)
            setLoading(false);

        } finally {
            setLoading(false)
        }
    }
    const updateTask = async () => {
        setLoading(true)
        try {
            const todolist = taskData.todoChecklist?.map((item)=>{
                const prevTodoChecklist = currentTask?.todoChecklist || []
                const matchedTask = prevTodoChecklist.find((task) => task.text === item)
                return {
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false,
                }
            })
            const response = await axiosInstance.put(
                API_PATHS.TASKS.UPDATE_TASK(taskId),
                {
                    ...taskData,
                    dueDate: new Date(taskData.dueDate).toISOString(),
                    todoChecklist: todolist,
                }
            )
            toast.success("Task Updated Successfully")
        } catch (error) {
            console.error("Error updating task", error)
            setLoading(false)
        } finally{
            setLoading(false)
        }
    }
    const handleSubmit = () => {
        setError(null)
        if (!taskData.title.trim()) {
            setError("Title is required.")
            return;
        }
        if (!taskData.description.trim()) {
            setError("Description is required.")
            return;
        }

        if (taskId) {
            updateTask()
            return;
        }
        createTask()
    }
    const getTaskDetailsById = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
            );

            if (response.data) {
                const taskInfo = response.data;
                setCurrentTask(taskInfo);

                setTaskData((prevState) => ({
                    title: taskInfo.title,
                    description: taskInfo.description,
                    priority: taskInfo.priority,
                    dueDate: taskInfo?.dueDate
                        ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
                        : null,
                    assignedTo: taskInfo?.assignedTo?.map((item) => item?.id) || [],
                    todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
                    attachments: taskInfo?.attachments || [],
                }));
            }
        } catch (error) {
            console.error("Failed to fetch task details:", error);
        }
    };

    const deleteTask = async () => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId))
            setOpenDeleteAlert(false)
            toast.success("Task deleted completelly")
            navigate('/admin/manage-tasks')
        } catch (error) {
            console.error(
                "Error deleting task",
                error.response?.data?.message || error.message
            )
        }
    }

    useEffect(() =>{
        if(taskId)
            getTaskDetailsById(taskId)
        return () => {}
    }, [taskId])
    return (
        <DashboradLayout activeMenu="Create Task">
            <div className="mt-5">

                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">

                    <div className="form-card col-span-3">

                        <div className="flex item-center justify-between">

                            <h2 className="text-xl md:text-xl font-medium">

                                {taskId ? "Update Task" : "Create Task"}

                            </h2>

                            {taskId && (

                                <button
                                    className="flex items-center gap-1.5 text-rose-500 bg-rose-100 rounded px-2 py-1 border border-rose-500 hover:bg-rose-200 text-[13px] font-medium"
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
                                    onChange={({ target }) => handleChangeValue("dueDate", target.value)}
                                    type='date'
                                />
                            </div>

                            <div className='col-span-12 md:col-span-3'>
                                <label className="text-xs font-medium text-slate-600">
                                    Assign To
                                </label>
                                <SelecUsers
                                    selectedUsers={taskData.assignedTo}
                                    setSelectedUsers={(value) => {
                                        handleChangeValue("assignedTo", value)
                                    }}
                                />
                            </div>

                        </div>

                        <div className='mt-3'>
                            <label className="text-xs font-medium text-slate-600">
                                TODO Checklist
                            </label>
                            <TodoListInput
                                todoList={taskData?.todoChecklist}
                                setTodoList={(value) =>
                                    handleChangeValue("todoChecklist", value)
                                }
                            />
                        </div>
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600 "></label>

                            <AddAttachmentsInput
                                attachments={taskData?.attachments}
                                setAttachments={(value) =>
                                    handleChangeValue("attachments", value)}
                            />
                        </div>
                        {error && (
                            <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
                        )}
                        <div className="flex justify-end mt-7">
                            <button className="add-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {taskId ? "Update Task" : "Create Task"}

                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={openDeleteAlert}
            onClose={() => setOpenDeleteAlert(false)}
                title="Delete task"
            >
                <DeleteAlert
                content="Are you sure delete this task?"
                onDelete={() => deleteTask()}
                />
            </Modal>
        </DashboradLayout>
    )
}

export default CreateTask