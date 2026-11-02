import React, { Suspense } from "react";
import OrderDetailClient from "./OrderDetailClient";

export function generateStaticParams() {
  return [
    { id: "VST-774912" },
    { id: "VST-892104" },
    { id: "order-demo-01" },
    { id: "demo" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#C5A880]/30 border-t-[#C5A880] animate-spin" />
        </div>
      }
    >
      <OrderDetailClient orderId={resolvedParams.id} />
    </Suspense>
  );
}

