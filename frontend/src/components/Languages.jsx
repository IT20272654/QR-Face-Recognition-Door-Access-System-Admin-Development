import React from 'react'

const Languages = () => {
  return (
    <div className='m-2'>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
              Languages
        </h3>

        <div className="flex flex-col space-y-3"></div>
        <button
          className={`flex items-center w-full p-3 rounded-md cursor-pointer bg-blue-200 dark:bg-slate-800 dark:text-slate-200`}>
          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center bg-blue-400`}>
            
          </div>
          Englsh
        </button>
    </div>
  )
}

export default Languages
