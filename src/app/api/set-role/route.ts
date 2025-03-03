import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId et role sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que le rôle est valide
    if (role !== "admin" && role !== "client") {
      return NextResponse.json(
        { error: "Le rôle doit être 'admin' ou 'client'" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur pour obtenir ses rôles actuels
    const user = await clerkClient.users.getUser(userId);
    
    // Récupérer les rôles existants ou initialiser un tableau vide avec vérification de sécurité
    const metadata = user.publicMetadata || {};
    const currentRoles = (metadata.roles as string[]) || [];
    
    // Ajouter le nouveau rôle s'il n'existe pas déjà
    let updatedRoles = [...currentRoles];
    if (!updatedRoles.includes(role)) {
      updatedRoles.push(role);
    }
    
    // Mettre à jour les métadonnées publiques de l'utilisateur avec les rôles
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { 
        ...metadata,
        roles: updatedRoles 
      },
    });

    return NextResponse.json({ 
      success: true,
      message: `Rôle ${role} attribué à l'utilisateur`,
      roles: updatedRoles
    });
  } catch (error) {
    console.error("Erreur lors de la définition du rôle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la définition du rôle" },
      { status: 500 }
    );
  }
} 