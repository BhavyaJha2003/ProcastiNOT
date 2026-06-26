export default function ActionPlan({ plan }) {
  return (
    <div style={styles.container}>
      <p style={styles.urgentMessage}>🔥 {plan.urgentMessage}</p>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>📋 Today's Actions</p>
        {plan.todayActions.map((action, i) => (
          <div key={i} style={styles.action}>
            <span style={styles.number}>{i + 1}</span>
            <span style={styles.actionText}>{action}</span>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>⏰ Time Required</span>
          <span style={styles.footerValue}>{plan.timeRequired}</span>
        </div>
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>💡 Pro Tip</span>
          <span style={styles.footerValue}>{plan.tip}</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#0f0f1a',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid #ff658444',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  urgentMessage: {
    color: '#ff6584',
    fontWeight: '700',
    fontSize: '0.95rem'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: '0.82rem',
    fontWeight: '600',
    marginBottom: '4px'
  },
  action: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: '#1a1a2e',
    padding: '8px 12px',
    borderRadius: '8px'
  },
  number: {
    background: '#6c63ff',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    flexShrink: 0
  },
  actionText: {
    fontSize: '0.88rem',
    color: '#ddd',
    lineHeight: '1.5'
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid #2a2a4a',
    paddingTop: '12px'
  },
  footerItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  footerLabel: {
    fontSize: '0.78rem',
    color: '#666',
    fontWeight: '600'
  },
  footerValue: {
    fontSize: '0.85rem',
    color: '#ccc',
    lineHeight: '1.5'
  }
}