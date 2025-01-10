/* eslint-disable no-unused-vars */
import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className=' '>
         <LeftSidebar/>
        <div className='  '>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout