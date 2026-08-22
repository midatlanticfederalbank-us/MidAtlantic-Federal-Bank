export default function Dashboard() {
  const transactions = [
    { date: "Aug 20, 2026", description: "Deposit", amount: "+$2,500.00" },
    { date: "Aug 18, 2026", description: "Payment", amount: "-$350.00" },
    { date: "Aug 15, 2026", description: "Transfer", amount: "-$125.00" }
  ];

  return (
    <main>
      <h1>Real Customer Dashboard</h1>

      <p>Welcome to your account.</p>

      <section>
        <h2>Available Balance</h2>
        <strong>$12,450.00</strong>
      </section>

      <section>
        <h2>Notifications</h2>
        <p>Real credit alert: $2,500.00 received.</p>
      </section>

      <section>
        <h2>Transaction History</h2>

        {transactions.map((transaction, index) => (
          <div key={index}>
            <p>
              <strong>{transaction.description}</strong>
              <br />
              {transaction.date}
              <br />
              {transaction.amount}
            </p>
          </div>
        ))}
      </section>

      <p>
        <a href="/">Back to Home</a>
      </p>
    </main>
  );
}
