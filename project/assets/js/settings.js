tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#FF0000',
                'primary-dark': '#CC0000',
                sidebar: { DEFAULT: '#0F0F0F', foreground: '#FFFFFF', primary: '#FF0000', accent: '#1E1E1E' }
            },
            boxShadow: {
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
  const notif = document.getElementById('notificationsToggle');
  const dark = document.getElementById('darkModeToggle');
  const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Save Changes'));
  async function loadSettings() {
    try { const s = await API.apiGet('/settings'); if (notif) notif.checked = !!s.notifications_enabled; if (dark) dark.checked = s.theme === 'dark'; }
    catch {}
  }
  async function saveSettings() {
    try { await API.apiPut('/settings', { site_name: 'AnimePulse', theme: dark && dark.checked ? 'dark' : 'light', notifications_enabled: notif && notif.checked }); alert('Saved'); }
    catch { alert('Save failed'); }
  }
  if (saveBtn) saveBtn.addEventListener('click', saveSettings);
  loadSettings();
});
