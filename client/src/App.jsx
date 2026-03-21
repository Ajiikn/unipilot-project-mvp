import Dashboard from "./pages/Dashboard";

function App() {
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
