// /api/me.ts
import { NextRequest, NextResponse } from "next/server";
import { getGraphQLClient } from "@/lib/graphql";

// Tipagem do retorno da query
interface ViewerData {
  viewer: {
    id: string;
    name: string;
    email: string;
    username: string;
  } | null;
}

const VIEWER_QUERY = `
  query Viewer {
    viewer {
      id
      name
      email
      username
    }
  }
`;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const client = getGraphQLClient(token);

    // Aqui informamos explicitamente que esperamos ViewerData
    const data = await client.request<ViewerData>(VIEWER_QUERY);

    return NextResponse.json({ user: data.viewer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
