tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        'primary-dark': '#CC0000',
        'primary-light': '#FF3333',
        secondary: '#000000',
        'secondary-light': '#333333',
        accent: '#FF6B6B',
        'accent-dark': '#800000',
        sidebar: {
          DEFAULT: '#0F0F0F',
          foreground: '#FFFFFF',
          primary: '#FF0000',
          'primary-foreground': '#FFFFFF',
          accent: '#1E1E1E',
          'accent-foreground': '#FFFFFF',
          border: 'rgba(255, 0, 0, 0.2)',
          ring: 'rgba(255, 0, 0, 0.4)'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('commentsList');
  async function loadComments() {
    try {
      const list = await API.apiGet('/comments');
      const html = list.map(c => {
        const dateStr = new Date(c.created_at).toLocaleString();
        return `
        <div class="p-4 border-b border-gray-200">
          <div class="flex justify-between">
            <div>
              <p class="font-semibold">${c.author_name} • ${c.post_title || ''}</p>
              <p class="text-gray-600">${c.content}</p>
              <p class="text-gray-400 text-sm">${dateStr}</p>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-1 bg-primary text-white rounded" data-action="approve" data-id="${c.id}">Approve</button>
              <button class="px-3 py-1 bg-gray-200 rounded" data-action="spam" data-id="${c.id}">Spam</button>
              <button class="px-3 py-1 bg-red-500 text-white rounded" data-action="delete" data-id="${c.id}">Delete</button>
            </div>
          </div>
        </div>`;
      }).join('');
      if (listContainer) listContainer.innerHTML = html;
    } catch { if (listContainer) listContainer.innerHTML = '<div class="p-6">Failed to load comments</div>'; }
  }

  document.addEventListener('click', async (e) => {
    const t = e.target; const action = t.getAttribute('data-action'); const id = t.getAttribute('data-id');
    if (!action || !id) return;
    if (action === 'approve') { try { await API.apiPut(`/comments/${id}`, { status: 'approved' }); await loadComments(); } catch { alert('Update failed'); } }
    if (action === 'spam') { try { await API.apiPut(`/comments/${id}`, { status: 'spam' }); await loadComments(); } catch { alert('Update failed'); } }
    if (action === 'delete') { if (confirm('Delete comment?')) { try { await API.apiDelete(`/comments/${id}`); await loadComments(); } catch { alert('Delete failed'); } } }
  });

  loadComments();
});
