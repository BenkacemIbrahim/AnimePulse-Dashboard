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
    const grid = document.getElementById('categoriesGrid');
    const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add Category'));
    let listCache = [];

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
        try { const list = await API.apiGet('/categories'); listCache = list || []; renderCategories(listCache); }
        catch { if (grid) grid.innerHTML = '<div class="p-6">Failed to load categories</div>'; }
    }

    function buildEditorModal() {
        const modal = document.createElement('div');
        modal.id = 'categoryEditorModal';
        modal.className = 'fixed inset-0 bg-black/60 hidden items-center justify-center z-[1000] p-4';
        modal.innerHTML = `
          <div class="bg-white rounded-lg w-full max-w-md p-6">
            <h3 class="text-xl font-bold mb-4" id="categoryEditorTitle">Add Category</h3>
            <div class="space-y-4">
              <input id="categoryName" type="text" class="form-input w-full" placeholder="Name">
              <input id="categorySlug" type="text" class="form-input w-full" placeholder="Slug">
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button id="categoryEditorCancel" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button id="categoryEditorSave" class="px-4 py-2 bg-primary text-white rounded">Save</button>
            </div>
          </div>`;
        document.body.appendChild(modal);
        return modal;
    }

    const editorModal = buildEditorModal();

    function openEditor(title, data) {
        document.getElementById('categoryEditorTitle').textContent = title;
        document.getElementById('categoryName').value = data?.name || '';
        document.getElementById('categorySlug').value = data?.slug || '';
        editorModal.dataset.editId = data?.id || '';
        editorModal.classList.remove('hidden'); editorModal.classList.add('flex');
    }

    function closeEditor() {
        editorModal.classList.add('hidden'); editorModal.classList.remove('flex');
        editorModal.dataset.editId = '';
    }

    const cancelBtn = editorModal.querySelector('#categoryEditorCancel');
    const saveBtn = editorModal.querySelector('#categoryEditorSave');
    if (cancelBtn) cancelBtn.addEventListener('click', closeEditor);
    if (saveBtn) saveBtn.addEventListener('click', async () => {
        const payload = {
            name: document.getElementById('categoryName').value,
            slug: document.getElementById('categorySlug').value
        };
        try {
            if (editorModal.dataset.editId) {
                await API.apiPut(`/categories/${editorModal.dataset.editId}`, payload);
            } else {
                await API.apiPost('/categories', payload);
            }
            closeEditor();
            await loadCategories();
        } catch {
            alert('Save failed');
        }
    });

    if (addBtn) addBtn.addEventListener('click', () => openEditor('Add Category'));
    if (grid) grid.addEventListener('click', async (e) => {
        const t = e.target;
        const action = t.getAttribute('data-action');
        const id = t.getAttribute('data-id');
        if (action === 'delete') {
            if (confirm('Delete category?')) { try { await API.apiDelete(`/categories/${id}`); await loadCategories(); } catch { alert('Delete failed'); } }
        }
        if (action === 'edit') {
            const cat = listCache.find(c => String(c.id) === String(id));
            if (cat) { openEditor('Edit Category', cat); }
        }
    });

    loadCategories();
});
