export async function GET() {
  const currentTime = new Date();
  const responseData = {
    status: "Online",
    message: "Project is running",
    timestamp: currentTime.toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
    }),
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
