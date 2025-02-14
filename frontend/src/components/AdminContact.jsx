import React from 'react'

const AdminContact = () => {
  return (
    <div className='m-2'>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
             Emegency Contact
        </h3>
      
          <p className="text-gray-600 mb-4 text-sm dark:text-slate-200">
            We are here to help! If you have any questions, concerns, or feedback, please reach out to our customer care team. Your satisfaction is our priority.
          </p>

          <h2 className="text-lg font-semibold text-gray-800 mb-3 dark:text-slate-100">Contact Information</h2>
          <ul className="list-disc list-inside text-gray-600 mb-6 dark:text-slate-200 text-sm">
            <li><strong>Email:</strong> <a href="mailto:digitallab@slt.com.lk" className="text-blue-500 underline">digitallab@slt.com.lk</a></li>
            <li><strong>Phone:</strong> +94 11 2432755</li>
            <li><strong>Address:</strong> SLT Mobitel, Lotus Road, Colombo 1</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-800 mb-6 dark:text-slate-100">Support Hours</h2>
          <p className="text-gray-600 mb-6 text-sm dark:text-slate-200">
            <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM (PST)
            <br />
            <strong>Saturday:</strong> 10:00 AM - 12:00 PM (PST)
          </p>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">Feedback</h2>
          <p className="text-gray-600 mb-4 text-sm dark:text-slate-200">We value your feedback! Please let us know how we can improve your experience.</p>

    </div>
  )
}

export default AdminContact
