import { Metadata } from "next";
import { TicketsClient } from "./client";

export const metadata: Metadata = {
  title: "Tickets - AppShade",
  description: "Gérez vos tickets de support",
};

export default async function TicketsPage() {
  return (
    <div className="container mx-auto py-10">
      <TicketsClient />
    </div>
  );
} 