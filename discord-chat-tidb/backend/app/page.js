export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>Discord Chat API</h1>
      <p>El backend está funcionando correctamente.</p>
      <ul>
        <li><a href="/api/users">API Users</a></li>
        <li><a href="/api/conversations">API Conversations</a></li>
      </ul>
    </main>
  )
}
