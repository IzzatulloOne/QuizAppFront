import { getMyTests } from "@/api/testApi";
import { useApi } from "@/hooks/useApi";
import { useEffect } from "react";

export default function ProfilePage() {
  const {exec, data, loading} = useApi(getMyTests)
  useEffect(() => {
    exec()
  }, []);
  
  return (
    <div className="flex h-[calc(100vh-270px)] bg-gray-50">
       <h2>hi profile</h2>
       {
        data && data.map(test => {
          return <p>{test.nomi}</p>
        })
       }
    </div>
  );
}
