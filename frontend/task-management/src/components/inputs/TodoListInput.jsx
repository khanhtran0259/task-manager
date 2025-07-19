import React, {useState} from 'react'
import {HiMiniPlus, HiOutlineTrash} from "react-icons/hi2";

const TodoListInput = ({todoList, setTodoList}) => {
  const [options, setOptions] = useState("");
  const handleAddOptions = () =>{
    if(options.trim()){
      setTodoList([...todoList, options.trim()]);
      setOptions("");

    }
  }
  const handleRemoveOptions = (index) =>{
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  }

  return (
    <div>
      {todoList.map((item, index) => (
          <div key={item}
              className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
          >
            <p className= "text-xs text-black">
              <span className="text-xs text-gray-400 font-semibold mr-2">
                {index <9 ? `0${index +1 }` : index +1}
              </span>
              {item}
            </p>
            <button className="cursor-pointer"
            onClick={() => handleRemoveOptions(index)}>
            <HiOutlineTrash  className="text-lg text-red-500"/>
            </button>

          </div>
      ))}
      <div className="flex items-center gap-5 mt-4">
        <input type="text"
        placeholder="Enter Task"
        value={options}
        onChange={({target}) => setOptions(target.value)}
               className="w-full text-[13px] text-black outline-nonebg-white border border-gray-100 px-3 py-2 rounded-md"
        />
        <button className="card-btn text-nowrap"
        onClick={handleAddOptions}>
        <HiMiniPlus className="text-lg"/> Add Task
        </button>
      </div>
    </div>
  )
}

export default TodoListInput