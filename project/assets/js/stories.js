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
  async function loadPosts() {
    try {
      const posts = await API.apiGet('/posts');
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
            </div>
          </div>
        </div>
      `).join('');
    } catch (e) {
      if (grid) grid.innerHTML = '<div class="p-6">Failed to load stories</div>';
    }
  }
  loadPosts();
});
