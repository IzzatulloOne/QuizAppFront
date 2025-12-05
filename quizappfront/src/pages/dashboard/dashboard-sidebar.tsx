import { Link } from "react-router-dom"
import { GraduationCap, LayoutDashboard, LogOut, User } from "lucide-react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
    const {user, logout} = useAuth();

    const handleLogout = () => {
      logout()
    }
  
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6" />
              <span>Quizzy</span>
            </Link>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="flex flex-col gap-2 p-4 lg:p-6">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <Avatar>
                  <AvatarImage src={user?.avatar_url} alt="User" />
                  <AvatarFallback>{user?.username.toUpperCase()[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-sm font-medium text-primary hover:underline hover:text-primary/80 cursor-pointer"><Link to=".">@{user?.username}</Link></span>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
                  <Button variant="ghost" asChild className="justify-start gap-2">
                    <Link to=".">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" asChild className="justify-start gap-2">
                    <Link to="test">
                      <User className="h-4 w-4" />
                      My Tests
                    </Link>
                  </Button>

                  <Button variant="ghost" asChild className="justify-start gap-2">
                    <Link to="questions">
                      <User className="h-4 w-4" />
                      Questions
                    </Link>
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="mt-auto p-4 lg:p-6">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}