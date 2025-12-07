tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        'primary-dark': '#CC0000',
        'primary-light': '#FF3333',
        sidebar: {
          DEFAULT: '#0F0F0F',
          foreground: '#FFFFFF',
          primary: '#FF0000',
          accent: '#1E1E1E',
        }
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('storiesGrid');
  const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add Story'));
  let categoriesCache = [];
  let currentImageDataUrl = '';

  function renderStories(posts) {
    if (!grid) return;
    grid.innerHTML = (posts || []).map(p => `
      <div class="dashboard-card overflow-hidden">
        <img src="${p.featured_image_url || '/placeholder.svg?height=200&width=300'}" alt="Story" class="w-full h-40 object-cover">
        <div class="p-6">
          <h3 class="font-bold text-lg text-gray-900 mb-2">${p.title}</h3>
          <p class="text-gray-600 text-sm mb-4">${(p.content || '').slice(0, 120)}${(p.content || '').length > 120 ? '…' : ''}</p>
          <div class="flex gap-2">
            <button class="flex-1 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary-dark" data-id="${p.id}" data-action="read">Read</button>
            <button class="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300" data-id="${p.id}" data-action="edit">Edit</button>
            <button class="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200" data-id="${p.id}" data-action="delete">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  async function loadCategories() {
    try { categoriesCache = await API.apiGet('/categories'); } catch { categoriesCache = []; }
  }

  async function loadStories() {
    try {
      const posts = await API.apiGet('/posts');
      renderStories(posts);
    } catch (e) {
      if (grid) grid.innerHTML = '<div class="p-6">Failed to load stories</div>';
    }
  }

  function buildEditorModal() {
    const modal = document.createElement('div');
    modal.id = 'storyEditorModal';
    modal.className = 'fixed inset-0 bg-black/60 hidden items-center justify-center z-[1000] p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[85vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4" id="storyEditorTitle">Add Story</h3>
        <div class="space-y-4">
          <input id="storyTitle" type="text" class="form-input w-full" placeholder="Title">
          <select id="storyCategory" class="form-input w-full"></select>
          <select id="storyStatus" class="form-input w-full">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <textarea id="storyContent" class="form-input w-full h-40" placeholder="Content"></textarea>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <input id="storyImageInput" type="file" accept="image/*" class="form-input w-full">
            <div class="mt-3">
              <img id="storyImagePreview" src="/placeholder.svg?height=160&width=280" class="w-full h-40 object-cover rounded border" alt="Preview">
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button id="storyEditorCancel" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button id="storyEditorSave" class="px-4 py-2 bg-primary text-white rounded">Save</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  function buildViewerModal() {
    const modal = document.createElement('div');
    modal.id = 'storyViewerModal';
    modal.className = 'fixed inset-0 bg-black/60 hidden items-center justify-center z-[1000] p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg w-full max-w-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <div class="h-48 bg-gray-100 flex-shrink-0">
          <img id="viewImage" src="/placeholder.svg?height=200&width=300" class="w-full h-48 object-cover" alt="Story image">
        </div>
        <div class="p-6 overflow-y-auto">
          <h3 id="viewTitle" class="text-2xl font-bold text-gray-900 mb-2"></h3>
          <p id="viewMeta" class="text-gray-500 text-sm mb-4"></p>
          <div id="viewContent" class="prose max-w-none text-gray-800"></div>
          <div class="flex justify-end mt-6">
            <button id="storyViewerClose" class="px-4 py-2 bg-gray-200 rounded">Close</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  const editorModal = buildEditorModal();
  const viewerModal = buildViewerModal();

  function openEditor(title, data) {
    document.getElementById('storyEditorTitle').textContent = title;
    const catSelect = document.getElementById('storyCategory');
    catSelect.innerHTML = categoriesCache.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    document.getElementById('storyTitle').value = data?.title || '';
    document.getElementById('storyContent').value = data?.content || '';
    document.getElementById('storyStatus').value = data?.status || 'draft';
    document.getElementById('storyCategory').value = data?.category_id || (categoriesCache[0]?.id || '');
    const preview = document.getElementById('storyImagePreview');
    currentImageDataUrl = data?.featured_image_url || '';
    preview.src = currentImageDataUrl || '/placeholder.svg?height=160&width=280';
    const input = document.getElementById('storyImageInput');
    input.value = '';
    editorModal.dataset.editId = data?.id || '';
    editorModal.classList.remove('hidden'); editorModal.classList.add('flex');
  }

  function closeEditor() {
    editorModal.classList.add('hidden'); editorModal.classList.remove('flex');
    editorModal.dataset.editId = '';
    currentImageDataUrl = '';
  }

  function openViewer(post) {
    document.getElementById('viewTitle').textContent = post.title || '';
    document.getElementById('viewImage').src = post.featured_image_url || '/placeholder.svg?height=200&width=300';
    const meta = [];
    if (post.category_id) meta.push(`Category #${post.category_id}`);
    if (post.status) meta.push(post.status);
    document.getElementById('viewMeta').textContent = meta.join(' • ');
    document.getElementById('viewContent').textContent = post.content || '';
    viewerModal.classList.remove('hidden'); viewerModal.classList.add('flex');
  }

  function closeViewer() {
    viewerModal.classList.add('hidden'); viewerModal.classList.remove('flex');
  }

  document.getElementById('storyViewerClose').addEventListener('click', closeViewer);
  document.getElementById('storyEditorCancel').addEventListener('click', closeEditor);
  document.getElementById('storyImageInput').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      try {
        const resp = await API.apiPost('/uploads', { data_url: dataUrl });
        currentImageDataUrl = resp.url;
      } catch {
        currentImageDataUrl = dataUrl;
      }
      const preview = document.getElementById('storyImagePreview');
      preview.src = currentImageDataUrl || '/placeholder.svg?height=160&width=280';
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('storyEditorSave').addEventListener('click', async () => {
    const payload = {
      title: document.getElementById('storyTitle').value,
      content: document.getElementById('storyContent').value,
      category_id: Number(document.getElementById('storyCategory').value) || null,
      status: document.getElementById('storyStatus').value,
      featured_image_url: currentImageDataUrl || undefined
    };
    try {
      if (editorModal.dataset.editId) {
        await API.apiPut(`/posts/${editorModal.dataset.editId}`, payload);
      } else {
        await API.apiPost('/posts', payload);
      }
      closeEditor();
      await loadStories();
    } catch (e) {
      alert('Save failed');
    }
  });

  if (addBtn) addBtn.addEventListener('click', () => openEditor('Add Story'));
  if (grid) grid.addEventListener('click', async (e) => {
    const t = e.target;
    const action = t.getAttribute('data-action');
    const id = t.getAttribute('data-id');
    if (!action || !id) return;
    if (action === 'read') {
      try { const post = await API.apiGet(`/posts/${id}`); openViewer(post); } catch { alert('Failed to load story'); }
    }
    if (action === 'edit') {
      try { const post = await API.apiGet(`/posts/${id}`); openEditor('Edit Story', post); } catch { alert('Failed to load story'); }
    }
    if (action === 'delete') {
      if (confirm('Delete this story?')) {
        try { await API.apiDelete(`/posts/${id}`); await loadStories(); } catch { alert('Delete failed'); }
      }
    }
  });

  (async function init() { await loadCategories(); await loadStories(); })();
});
