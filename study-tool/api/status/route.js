export async function GET() {
  const currentTime = new Date();
  const responseData = {
    status: "Online",
    message: "Project is running",
    timestamp: currentTime.toISOString(),
  };

  return Response.json(responseData);
}
