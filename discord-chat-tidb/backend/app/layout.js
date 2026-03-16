export const metadata = {
  title: 'Discord Chat Backend',
  description: 'API para la aplicación de chat',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
