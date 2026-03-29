import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";

function App() {
  const { username, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!username) {
    return <Login onLoginSuccess={login} />;
  }

  // Show dashboard if authenticated
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">UniPilot - CGPA Planner</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
