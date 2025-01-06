import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Monthly Budget Overview</h1>
      <div className="space-x-4">
        <Button 
          onClick={() => navigate("/createbudget")}
          className="bg-white text-indigo-600 hover:bg-gray-100"
        >
          Create New Budget
        </Button>
        <Button 
          onClick={() => navigate("/billreminders")}
          className="bg-white text-indigo-600 hover:bg-gray-100"
        >
          Manage Bill Reminders
        </Button>
      </div>
    </div>
  );
}