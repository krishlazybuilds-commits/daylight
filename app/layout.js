import "./globals.css";
import "./refinements.css";
import "./loader.css";
import Providers from "./providers";
export const metadata={title:"Daylight — Todo List",description:"A calm, simple place to plan your day."};
export default function RootLayout({children}){return <html lang="en"><body><Providers>{children}</Providers></body></html>}
