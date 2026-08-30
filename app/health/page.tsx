async function getStatus() {
    // Placeholder for a real data fetch (e.g. database or AI API check).
    // Returns dummy data for now to confirm the fetch pipeline works end-to-end.
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "StudyBuddy API",
    };
  }
  
  export default async function HealthPage() {
    const data = await getStatus();
  
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-6">Health Check</h1>
        <div className="bg-gray-100 rounded-lg p-6 text-left font-mono text-sm">
          <p>Status: {data.status}</p>
          <p>Service: {data.service}</p>
          <p>Checked at: {data.timestamp}</p>
        </div>
      </main>
    );
  }