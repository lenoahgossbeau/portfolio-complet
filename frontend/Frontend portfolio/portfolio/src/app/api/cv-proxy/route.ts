import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const format = request.nextUrl.searchParams.get("format");

    if (!userId) {
      return NextResponse.json(
        { detail: "userId est requis" },
        { status: 400 }
      );
    }

    // Vérification explicite : l'ID doit être numérique
    const numericUserId = Number(userId);

    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      return NextResponse.json(
        { detail: "userId doit être un entier valide" },
        { status: 400 }
      );
    }

    const backendUrl =
      `${API_BASE_URL}/cv/view/${numericUserId}`;

    console.log("CV PROXY →", backendUrl);

    const response = await fetch(backendUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Erreur backend CV:",
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          detail:
            errorText ||
            `Erreur backend ${response.status}`,
        },
        {
          status: response.status,
        }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    /*
     * Mode viewer :
     * on renvoie le PDF sous forme Base64.
     * Le navigateur crée ensuite un Blob local
     * et l'affiche dans un iframe.
     */
    if (format === "json") {
      const base64 = Buffer.from(pdfBuffer).toString("base64");

      return NextResponse.json(
        {
          data: base64,
          contentType: "application/pdf",
        },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    /*
     * Mode PDF direct.
     */
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Erreur proxy CV:", error);

    return NextResponse.json(
      {
        detail: "Impossible de récupérer le CV",
      },
      {
        status: 500,
      }
    );
  }
}