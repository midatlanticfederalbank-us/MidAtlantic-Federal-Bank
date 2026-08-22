export default function Signup() {
  return (
    <main>
      <h1>Create a Account</h1>

      <p>
        This form is for bank purposes only. enter your
        banking information.
      </p>

      <form>
        <label>
          Full Name
          <input type="text" name="name" required />
        </label>

        <br />

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

        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have a account? <a href="/login">Log in</a>
      </p>

      <p>
        <a href="/">Back to Home</a>
      </p>
    </main>
  );
}
