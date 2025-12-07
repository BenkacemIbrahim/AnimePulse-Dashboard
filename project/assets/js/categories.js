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
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
            mainContent.style.width = sidebar.classList.contains('collapsed') ? 'calc(100% - var(--sidebar-collapsed-width))' : 'calc(100% - var(--sidebar-width))';
        });
    }

    const grid = document.getElementById('categoriesGrid');
    const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add Category'));

    function renderCategories(list) {
        if (!grid) return;
        grid.innerHTML = list.map(c => `
        <div class="dashboard-card p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-bold text-base md:text-lg text-gray-900">${c.name}</h3>
                    <p class="text-sm text-gray-600 mt-1">${c.slug}</p>
                </div>
                <button class="text-gray-400 hover:text-primary"><i class="fas fa-ellipsis-v"></i></button>
            </div>
            <div class="flex gap-2 mt-4">
                <button class="flex-1 px-3 py-2 text-xs md:text-sm bg-primary text-white rounded hover:bg-primary-dark" data-action="edit" data-id="${c.id}">Edit</button>
                <button class="flex-1 px-3 py-2 text-xs md:text-sm bg-red-500 text-white rounded hover:bg-red-600" data-action="delete" data-id="${c.id}">Delete</button>
            </div>
        </div>`).join('');
    }

    async function loadCategories() {
        try { const list = await API.apiGet('/categories'); renderCategories(list); }
        catch { if (grid) grid.innerHTML = '<div class="p-6">Failed to load categories</div>'; }
    }

    function openCreateModal() {
        const wrapper = document.createElement('div');
        wrapper.className = 'fixed inset-0 bg-black/50 flex items-center justify-center';
        wrapper.innerHTML = `
          <div class="bg-white rounded-lg w-full max-w-md p-6">
            <h3 class="text-xl font-bold mb-4">Add Category</h3>
            <input id="catName" type="text" class="form-input w-full mb-3" placeholder="Name">
            <input id="catSlug" type="text" class="form-input w-full mb-3" placeholder="Slug">
            <div class="flex justify-end gap-2">
              <button id="cancel" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button id="save" class="px-4 py-2 bg-primary text-white rounded">Save</button>
            </div>
          </div>`;
        document.body.appendChild(wrapper);
        wrapper.querySelector('#cancel').onclick = () => wrapper.remove();
        wrapper.querySelector('#save').onclick = async () => {
            const name = wrapper.querySelector('#catName').value;
            const slug = wrapper.querySelector('#catSlug').value;
            try { await API.apiPost('/categories', { name, slug }); wrapper.remove(); await loadCategories(); }
            catch { alert('Create failed'); }
        };
    }

    if (addBtn) addBtn.addEventListener('click', openCreateModal);
    if (grid) grid.addEventListener('click', async (e) => {
        const t = e.target;
        const action = t.getAttribute('data-action');
        const id = t.getAttribute('data-id');
        if (action === 'delete') {
            if (confirm('Delete category?')) { try { await API.apiDelete(`/categories/${id}`); await loadCategories(); } catch { alert('Delete failed'); } }
        }
        if (action === 'edit') {
            const name = prompt('New name');
            const slug = prompt('New slug');
            if (name && slug) { try { await API.apiPut(`/categories/${id}`, { name, slug }); await loadCategories(); } catch { alert('Update failed'); } }
        }
    });

    loadCategories();
});
