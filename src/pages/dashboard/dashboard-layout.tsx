"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"

import DashboardHeader from "./dashboard-header"
import DashboardSidebar from "./dashboard-sidebar"
import { useMobile } from "@/hooks/useMobile"
import { cn } from "@/lib/utils"

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMobile()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className={cn("transition-all duration-300", sidebarOpen || !isMobile ? "lg:ml-72" : "")}>
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Outlet />
      </div>
    </div>
  )
}