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

    const tbody = document.querySelector('table tbody');
    const newPostBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('New Post'));
    let categoriesCache = [];

    function renderPosts(posts) {
        if (!tbody) return;
        tbody.innerHTML = posts.map(p => {
            const catName = p.category_name || '';
            const dateStr = new Date(p.created_at).toLocaleDateString();
            const statusBadge = p.status === 'published'
                ? '<span class="bg-green-100 text-green-700 px-3 py-1 rounded text-xs md:text-sm">Published</span>'
                : '<span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs md:text-sm">Draft</span>';
            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-3 px-2 md:px-4">${p.title}</td>
                <td class="py-3 px-2 md:px-4">${catName}</td>
                <td class="py-3 px-2 md:px-4">${dateStr}</td>
                <td class="py-3 px-2 md:px-4">${statusBadge}</td>
                <td class="py-3 px-2 md:px-4">
                    <button class="text-primary hover:text-primary-dark text-sm" data-action="edit" data-id="${p.id}">Edit</button>
                    <span class="text-gray-300 mx-2">/</span>
                    <button class="text-red-500 hover:text-red-700 text-sm" data-action="delete" data-id="${p.id}">Delete</button>
                </td>
            </tr>
            `;
        }).join('');
    }

    async function loadCategories() {
        try {
            categoriesCache = await API.apiGet('/categories');
        } catch (e) { categoriesCache = []; }
    }

    async function loadPosts() {
        try {
            const posts = await API.apiGet('/posts');
            renderPosts(posts);
        } catch (e) {
            if (tbody) tbody.innerHTML = '<tr><td class="py-3 px-4" colspan="5">Failed to load posts</td></tr>';
        }
    }

    function buildModal() {
        const modal = document.createElement('div');
        modal.id = 'postModal';
        modal.className = 'fixed inset-0 bg-black/50 hidden items-center justify-center';
        modal.innerHTML = `
        <div class="bg-white rounded-lg w-full max-w-xl p-6">
            <h3 class="text-xl font-bold mb-4" id="postModalTitle">New Post</h3>
            <div class="space-y-4">
                <input id="postTitle" type="text" class="form-input w-full" placeholder="Title">
                <select id="postCategory" class="form-input w-full"></select>
                <select id="postStatus" class="form-input w-full">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
                <textarea id="postContent" class="form-input w-full h-40" placeholder="Content"></textarea>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button id="postCancel" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button id="postSave" class="px-4 py-2 bg-primary text-white rounded">Save</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        return modal;
    }

    const modal = buildModal();
    function openModal(title, data) {
        document.getElementById('postModalTitle').textContent = title;
        const catSelect = document.getElementById('postCategory');
        catSelect.innerHTML = categoriesCache.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        document.getElementById('postTitle').value = data?.title || '';
        document.getElementById('postContent').value = data?.content || '';
        document.getElementById('postStatus').value = data?.status || 'draft';
        document.getElementById('postCategory').value = data?.category_id || (categoriesCache[0]?.id || '');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.dataset.editId = data?.id || '';
    }
    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.dataset.editId = '';
    }
    modal.querySelector('#postCancel').addEventListener('click', closeModal);
    modal.querySelector('#postSave').addEventListener('click', async () => {
        const payload = {
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            category_id: Number(document.getElementById('postCategory').value) || null,
            status: document.getElementById('postStatus').value
        };
        try {
            if (modal.dataset.editId) {
                await API.apiPut(`/posts/${modal.dataset.editId}`, payload);
            } else {
                await API.apiPost('/posts', payload);
            }
            closeModal();
            await loadPosts();
        } catch (e) {
            alert('Save failed');
        }
    });

    if (newPostBtn) newPostBtn.addEventListener('click', () => openModal('New Post'));
    if (tbody) tbody.addEventListener('click', async (e) => {
        const t = e.target;
        const action = t.getAttribute('data-action');
        const id = t.getAttribute('data-id');
        if (action === 'edit') {
            try {
                const post = await API.apiGet(`/posts/${id}`);
                openModal('Edit Post', post);
            } catch { alert('Failed to load post'); }
        }
        if (action === 'delete') {
            if (confirm('Delete this post?')) {
                try { await API.apiDelete(`/posts/${id}`); await loadPosts(); } catch { alert('Delete failed'); }
            }
        }
    });

    (async function init() { await loadCategories(); await loadPosts(); })();
});
