import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import PaymentHistory from './components/payment/PaymentHistory'
import PaymentDetails from './components/payment/PaymentDetails'
import WageDashboard from './components/wage/WageDashboard'
import BankUpiSetup from './components/wage/BankUpiSetup'
import Chatbot from './components/Chatbot'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  // Payment routes
  {
    path:"/payments",
    element:<PaymentHistory/>
  },
  {
    path:"/payments/:id",
    element:<PaymentDetails/>
  },
  // Wage routes
  {
    path:"/wage-dashboard",
    element:<WageDashboard/>
  },
  {
    path:"/bank-upi-setup",
    element:<BankUpiSetup/>
  },

], {
  future: {
    v7_startTransition: true,
  },
})
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
      <Chatbot />
    </div>
  )
}

export default App


// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Navbar from './components/shared/Navbar';
// import Login from './components/auth/Login';
// import Signup from './components/auth/Signup';
// import Home from './components/Home';
// import Jobs from './components/Jobs';
// import Browse from './components/Browse';
// import Profile from './components/Profile';
// import JobDescription from './components/JobDescription';
// import Companies from './components/admin/Companies';
// import CompanyCreate from './components/admin/CompanyCreate';
// import CompanySetup from './components/admin/CompanySetup';
// import AdminJobs from './components/admin/AdminJobs';
// import PostJob from './components/admin/PostJob';
// import Applicants from './components/admin/Applicants';
// import ProtectedRoute from './components/admin/ProtectedRoute';

// const appRouter = createBrowserRouter([
//   {
//     path: '/',
//     element: <Home />
//   },
//   {
//     path: '/login',
//     element: <Login />
//   },
//   {
//     path: '/signup',
//     element: <Signup />
//   },
//   {
//     path: '/jobs',
//     element: <Jobs />
//   },
//   {
//     path: '/description/:id',
//     element: <JobDescription />
//   },
//   {
//     path: '/browse',
//     element: <Browse />
//   },
//   {
//     path: '/profile',
//     element: <Profile />
//   },
//   // Admin routes
//   {
//     path: '/admin/companies',
//     element: <ProtectedRoute><Companies /></ProtectedRoute>
//   },
//   {
//     path: '/admin/companies/create',
//     element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
//   },
//   {
//     path: '/admin/companies/:id',
//     element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
//   },
//   {
//     path: '/admin/jobs',
//     element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
//   },
//   {
//     path: '/admin/jobs/create',
//     element: <ProtectedRoute><PostJob /></ProtectedRoute>
//   },
//   {
//     path: '/admin/jobs/:id/applicants',
//     element: <ProtectedRoute><Applicants /></ProtectedRoute>
//   }
// ]);

// function App() {
//   return (
//     <div>
//       <Navbar />
//       <RouterProvider router={appRouter} />
//     </div>
//   );
// }

// export default App;
