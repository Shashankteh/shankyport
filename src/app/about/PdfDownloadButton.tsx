"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";

// Dynamically import PDFDownloadLink to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink),
  { ssr: false }
);

import PortfolioDocument from "./PortfolioDocument";

type PdfDownloadButtonProps = {
  profile: any;
  photos: any[];
};

export default function PdfDownloadButton({ profile, photos }: PdfDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <PDFDownloadLink
      document={<PortfolioDocument profile={profile} photos={photos} />}
      fileName={`${profile.name.replace(/\s+/g, '_')}_Portfolio.pdf`}
      className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-accent transition-colors"
    >
      {({ blob, url, loading, error }: any) => 
        loading ? 'Generating PDF...' : <><Download size={18} /> Download Portfolio PDF</>
      }
    </PDFDownloadLink>
  );
}
