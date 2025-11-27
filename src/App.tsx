import { Button } from "@/components/ui/button"
import { useApi } from "./hooks/useApi"
import { getUsers } from "./api/userApi"
import AppRoutes from "./routes/AppRoutes"


function App() {
  // const {exec, data, loading} = useApi(getUsers)
  return (
    <AppRoutes />
  )
}

export default App