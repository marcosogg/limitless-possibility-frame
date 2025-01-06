import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen gradient-bg text-white">
      <div className="container mx-auto px-4 py-16 md:py-32">
        <div className="flex justify-end mb-8">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-white border-white hover:bg-white hover:text-indigo-600"
          >
            Logout
          </Button>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Welcome to Your Amazing Project
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 leading-relaxed"
          >
            Start building something incredible with modern web technologies.
            This template gives you a perfect foundation to create beautiful
            and responsive applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;