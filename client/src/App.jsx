import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ScrollToTop from "./components/scrollToTop";
import Home from './pages/Home'
import Auth from './pages/auth'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import ResumeAnalyserPage from "./pages/ResumeAnalyserPage";
import Navbar from './components/Navbar'
import Footer from './components/Footer'
export const ServerUrl  = import.meta.env.VITE_API_URL;

const HIDE_LAYOUT_PATHS = ['/interview', '/history']

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const hideLayout = HIDE_LAYOUT_PATHS.includes(location.pathname) || location.pathname.startsWith('/report/')

  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  },[dispatch])

  return (
    <>
      {!hideLayout && <Navbar/>}
      <ScrollToTop />  
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/interview' element={<InterviewPage/>}/>
        <Route path='/history' element={<InterviewHistory/>}/>
        <Route path='/pricing' element={<Pricing/>}/>
        <Route path='/report/:id' element={<InterviewReport/>}/>
        <Route path="/resume-analyser" element={<ResumeAnalyserPage />} />
      </Routes>
      {!hideLayout && <Footer/>}
    </>
  )
}

export default App
