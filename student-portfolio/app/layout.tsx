import type { Metadata } from "next";
import "./globals.css";
import "./journey-theme.css";
import "./water-journey.css";
import "./mobile.css";
export const metadata: Metadata = {
 title: "まさ — 学びと制作の軌跡",
 description: "学んだことを活かして、身の回りの不便を解決する。東洋大学情報連携学部・まさのポートフォリオ。INIAD-CONNECT、MOOCs Checkと、2026年からの学びと制作の記録。",
 icons: { icon: "/favicon.svg" }
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>){return <html lang="ja"><body>{children}</body></html>}
