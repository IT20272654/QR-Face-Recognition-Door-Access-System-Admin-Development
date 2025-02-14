import React from 'react'

const AppInformation = () => {
  return (
    <div className='m-2'>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
              App Information
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-6 text-sm dark:text-slate-200">
          <li><strong>Version:</strong> 1.0.3</li>
          <li><strong>Developer:</strong> SLT Mobitel</li>
          <li><strong>Release Date:</strong> January 2025</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">Features</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-slate-200 mb-6 text-sm">
          <li>Simple and user-friendly interface</li>
          <li>Real-time updates and notifications</li>
          <li>Secure login with multiple authentication options</li>
          
        </ul>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">Contact Support</h2>
        <p className="text-gray-600 dark:text-slate-200 mb-6 text-sm">
          For any issues or inquiries, please reach out to our support team at{" "}
          <a href="mailto:support@sltmobitel.com" className="text-blue-500 underline">
            support@sltmobitel.com
          </a>.
        </p>

        <div className="text-center">
        <button
          onClick={() => window.open('https://www.sltdigitallab.lk/', '_blank', 'noopener,noreferrer')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Learn More
        </button>
    </div>
    </div>
  )
}

export default AppInformation
