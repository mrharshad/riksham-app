import { cookies } from "next/headers";

export async function POST(req) {
  try {
    console.log("api called");
    cookies().delete(process.env.COOKIE_TOKEN_NAME);

    return new Response(
      JSON.stringify({ success: true, message: "Logged Out Successful " }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 200,
      }
    );
  }
}
