"use client"
import { useQRCode } from 'next-qrcode';

export default function ClinicQr({ text }: { text: string }) {
  const { SVG } = useQRCode();

  return (
    <SVG
      text={text}
      options={{
        margin: 2,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ddeeff',
        },
      }}
    />
  );
}