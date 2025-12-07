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
  const tbody = document.getElementById('subscribersTableBody');
  const importBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Import List'));

  function render(list) {
    if (!tbody) return;
    tbody.innerHTML = list.map(s => {
      const dateStr = new Date(s.created_at).toLocaleDateString();
      const badge = s.status === 'active'
        ? '<span class="bg-green-100 text-green-700 px-3 py-1 rounded text-xs md:text-sm">Active</span>'
        : '<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs md:text-sm">Inactive</span>';
      return `
      <tr class="border-b border-gray-100 hover:bg-gray-50">
        <td class="py-3 px-2 md:px-4">${s.name || ''}</td>
        <td class="py-3 px-2 md:px-4">${s.email}</td>
        <td class="py-3 px-2 md:px-4">${dateStr}</td>
        <td class="py-3 px-2 md:px-4">${badge}</td>
        <td class="py-3 px-2 md:px-4"><button class="text-primary hover:text-primary-dark text-sm" data-action="remove" data-id="${s.id}">Remove</button></td>
      </tr>`;
    }).join('');
  }

  async function loadSubscribers() {
    try { const list = await API.apiGet('/subscribers'); render(list); }
    catch { if (tbody) tbody.innerHTML = '<tr><td class="py-3 px-4" colspan="5">Failed to load</td></tr>'; }
  }

  if (tbody) tbody.addEventListener('click', async (e) => {
    const t = e.target; const action = t.getAttribute('data-action'); const id = t.getAttribute('data-id');
    if (action === 'remove') { if (confirm('Remove subscriber?')) { try { await API.apiDelete(`/subscribers/${id}`); await loadSubscribers(); } catch { alert('Remove failed'); } } }
  });

  function buildImportModal() {
    const modal = document.createElement('div');
    modal.id = 'importModal';
    modal.className = 'fixed inset-0 bg-black/60 hidden items-center justify-center z-[1000] p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Import Subscriber</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input id="importName" type="text" class="form-input w-full" placeholder="Name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input id="importEmail" type="email" class="form-input w-full" placeholder="email@example.com">
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button id="importCancel" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button id="importStart" class="px-4 py-2 bg-primary text-white rounded">Add</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  const importModal = buildImportModal();

  function openImport() { importModal.classList.remove('hidden'); importModal.classList.add('flex'); }
  function closeImport() { importModal.classList.add('hidden'); importModal.classList.remove('flex'); }

  importModal.querySelector('#importCancel').addEventListener('click', closeImport);
  importModal.querySelector('#importStart').addEventListener('click', async () => {
    const name = document.getElementById('importName').value.trim() || null;
    const email = document.getElementById('importEmail').value.trim();
    if (!email || !/.+@.+\..+/.test(email)) { alert('Enter a valid email'); return; }
    try {
      await API.apiPost('/subscribers', { name, email });
      closeImport();
      await loadSubscribers();
    } catch { alert('Add failed'); }
  });

  if (importBtn) importBtn.addEventListener('click', openImport);

  loadSubscribers();
});
