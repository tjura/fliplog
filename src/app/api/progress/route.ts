import { getAuth } from "../../../server/auth";
import { readProgress, writeRating } from "../../../server/progress";
import { parseRatingChange } from "../../../features/progress/rules.ts";

function reply(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: Request) {
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      return reply({ error: "Sign in to read your progress." }, 401);
    return reply(readProgress(session.user.id));
  } catch (error) {
    console.error(
      "Progress read failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return reply(
      { error: "We couldn’t load your progress. Please retry." },
      503,
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      return reply(
        { error: "Your session ended. Sign in again to save." },
        401,
      );
    if (
      request.headers.get("origin") !==
      new URL(process.env.BETTER_AUTH_URL ?? "").origin
    )
      return reply({ error: "This request origin is not allowed." }, 403);
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return reply({ error: "Send a JSON rating change." }, 415);
    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return reply({ error: "Invalid JSON rating change." }, 400);
    }
    const change = parseRatingChange(input);
    if (!change)
      return reply(
        {
          error:
            "Choose a known skill and an integer rating from 1 to 5, or null to reset.",
        },
        422,
      );
    return reply(writeRating(session.user.id, change.skillId, change.rating));
  } catch (error) {
    console.error(
      "Progress write failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return reply(
      {
        error:
          "We couldn’t save. Your previous rating is unchanged. Please retry.",
      },
      503,
    );
  }
}
