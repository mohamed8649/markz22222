import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "مركز التدريب الاحترافي | بوابة التحقق والعضويات",
  description: "التحقق من الشهادات التدريبية وبطاقات العضوية رقمياً وبشكل آمن. استكشف دوراتنا وشهاداتنا الاحترافية.",
  keywords: ["مركز تدريب", "تحقق من الشهادات", "عضويات", "بطاقات العضوية", "دورات تدريبية", "Supabase", "Next.js"],
  authors: [{ name: "مركز التدريب" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
