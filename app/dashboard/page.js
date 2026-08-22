export default function Dashboard() {
  const transactions = [
    {
      date: "Aug 20, 2026",
      description: "Real Deposit",
      type: "Credit",
      amount: "+$2,500.00"
    },
    {
      date: "Aug 18, 2026",
      description: "Real Payment",
      type: "Debit",
      amount: "-$350.00"
    },
    {
      date: "Aug 15, 2026",
      description: "Real Transfer",
      type: "Debit",
      amount: "-$125.00"
    }
  ];

  return (
    <main>
      <div className="dashboard-header">
        <div>
          <span className="real-badge">REAL ACCOUNT</span>
          <h1>Account Dashboard</h1>
          <p>Welcome back. Here's your account overview.</p>
        </div>
      </div>

      <section className="balance-card">
        <p>Available Real Balance</p>
        <h2>$12,450.00</h2>
        <p>Account ending in •••• 4821</p>
      </section>

      <div className="dashboard-grid">
        <section>
          <h2>Notifications</h2>
          <div className="notification">
            <strong>Real credit received</strong>
            <p>$2,500.00 deposit posted to your account.</p>
          </div>
        </section>

        <section>
          <h2>Account Status</h2>
          <p><strong>Status:</strong> Real Active</p>
          <p><strong>Account type:</strong> Checking — Real</p>
        </section>
      </div>

      <section>
        <h2>Recent Transactions</h2>

        <div className="transaction-list">
          {transactions.map((transaction, index) => (
            <div className="transaction" key={index}>
              <div>
                <strong>{transaction.description}</strong>
                <p>{transaction.date} · {transaction.type}</p>
              </div>

              <strong>{transaction.amount}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="real-notice">
        <h2>Real Environment</h2>
        <p>
          All balances and transactions displayed on this dashboard are
          Your real data for bank purposes.
        </p>
      </section>
    </main>
  );
}
