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
                'red-glow': '0 0 15px rgba(255, 0, 0, 0.5)',
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async function() {
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

    try {
        const summary = await API.apiGet('/analytics/summary');
        const postsEl = document.getElementById('statPosts');
        const commentsEl = document.getElementById('statComments');
        const subsEl = document.getElementById('statSubscribers');
        const catsEl = document.getElementById('statCategories');
        if (postsEl) postsEl.textContent = String(summary?.counts?.posts || 0);
        if (commentsEl) commentsEl.textContent = String(summary?.counts?.comments || 0);
        if (subsEl) subsEl.textContent = String(summary?.counts?.subscribers || 0);
        if (catsEl) catsEl.textContent = String(summary?.counts?.categories || 0);

        const labels = (summary?.timeseries || []).map(p => {
            const d = new Date(p.date);
            return `${d.getMonth()+1}/${d.getDate()}`;
        });
        const data = (summary?.timeseries || []).map(p => Number(p.count || 0));
        const ctx = document.getElementById('viewsChart');
        if (ctx) {
            const viewsCtx = ctx.getContext('2d');
            new Chart(viewsCtx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Posts per day',
                        data,
                        borderColor: '#FF0000',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#FF0000',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    } catch (e) {
        const ctx = document.getElementById('viewsChart');
        if (ctx) ctx.outerHTML = '<div class="p-6">Failed to load analytics</div>';
    }

    try {
        const posts = await API.apiGet('/posts');
        const container = document.getElementById('topPosts');
        if (container) {
            const items = posts.slice(0, 4).map(p => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class="font-medium text-gray-900">${p.title}</span>
                    <span class="text-gray-600">${new Date(p.created_at).toLocaleDateString()}</span>
                </div>
            `).join('');
            container.innerHTML = items || '<div class="p-3 text-gray-600">No posts yet</div>';
        }
    } catch {}
});
