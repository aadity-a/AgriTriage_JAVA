/**
 * AgriTriage API Client
 */

export async function triageMessage({ message, senderName = 'Unknown', senderEmail = '', endpoint = '/api/triage' }) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sender_name: senderName,
      sender_email: senderEmail,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `Server error (${response.status})`);
  }

  return await response.json();
}

export async function checkHealth() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok';
  } catch (err) {
    return false;
  }
}
