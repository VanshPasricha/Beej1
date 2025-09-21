export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui',padding:24}}>
          <div style={{textAlign:'center'}}>
            <h1 style={{fontSize:32,marginBottom:8}}>Page not found</h1>
            <p style={{color:'#555'}}>The page you requested does not exist.</p>
          </div>
        </div>
      </body>
    </html>
  )
}
