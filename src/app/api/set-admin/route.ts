import { NextResponse } from "next/server";

// API simplifiée pour attribuer le rôle admin
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true,
      message: "API set-admin fonctionnelle",
      info: "Cette API a été simplifiée pour le développement"
    });
  } catch (error) {
    console.error("Erreur dans l'API set-admin:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 