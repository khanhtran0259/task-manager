import React from 'react'

const Progress = ({progress, status}) => {
  const getColor = () =>{
      switch (status) {
            case 'In Progress':
                  return 'text-cyan-500 bg-cyan-500 border border-cyan-500/10'
            case 'Completed':
                  return 'text-indigo-500 bg-indigo-500 border border-indigo-500/10'
            default:
                  return 'text-violet-500 bg-violet-500 border border-violet-500/10'
      }
  }
  return (
        <div className='w-full bg-gray-200 rounded-full h-4'>
              <div
                    className={`${getColor()} h-4 rounded-full flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${progress}%` }}
              >
                    {progress}%
              </div>
        </div>
  )
}

export default Progress