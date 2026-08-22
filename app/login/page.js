export default function Login() {
  return (
    <main>
      <h1>Account Login</h1>

      <form>
        <label>
          Email
          <input type="email" name="email" required />
        </label>

        <br />

        <label>
          Password
          <input type="password" name="password" required />
        </label>

        <br />

        <button type="submit">Log In</button>
      </form>

      <p>
        login. enter banking credentials.
      </p>

      <a href="/signup">Create an account</a>
    </main>
  );
}
