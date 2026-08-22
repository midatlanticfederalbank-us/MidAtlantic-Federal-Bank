export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        MidAtlantic Federal Bank
        <span>REAL</span>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/signup">Sign Up</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </nav>
  );
}
