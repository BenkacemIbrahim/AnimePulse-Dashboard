(function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (window.innerWidth >= 1025) {
        mainContent.style.marginLeft = 'var(--sidebar-width)';
        mainContent.style.width = 'calc(100% - var(--sidebar-width))';
    } else {
        mainContent.style.marginLeft = '0';
        mainContent.style.width = '100%';
        sidebar.style.display = 'none';
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainContent = document.getElementById('mainContent');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function updateSidebarState() {
        if (window.innerWidth >= 1025) {
            sidebar.classList.remove('mobile-open');
            sidebar.classList.remove('collapsed');
            sidebar.style.display = 'block';
            mainContent.style.marginLeft = 'var(--sidebar-width)';
            mainContent.style.width = 'calc(100% - var(--sidebar-width))';
            sidebarOverlay.classList.remove('active');
        } else {
            sidebar.classList.remove('mobile-open');
            sidebar.style.display = 'none';
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
            sidebarOverlay.classList.remove('active');
        }
    }

    sidebarToggle.addEventListener('click', function () {
        if (window.innerWidth >= 1025) {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            mainContent.style.marginLeft = isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
            mainContent.style.width = isCollapsed ? 'calc(100% - var(--sidebar-collapsed-width))' : 'calc(100% - var(--sidebar-width))';
            sidebar.style.transition = 'width 0.3s ease-in-out';
            mainContent.style.transition = 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out';
            setTimeout(() => {
                sidebar.style.transition = '';
                mainContent.style.transition = '';
            }, 300);
        }
    });

    mobileMenuToggle.addEventListener('click', function () {
        if (window.innerWidth < 1025) {
            sidebar.classList.toggle('mobile-open');
            sidebar.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
            sidebarOverlay.classList.toggle('active');
        }
    });

    sidebarOverlay.addEventListener('click', function () {
        if (window.innerWidth < 1025) {
            sidebar.classList.remove('mobile-open');
            sidebar.style.display = 'none';
            sidebarOverlay.classList.remove('active');
        }
    });

    window.addEventListener('resize', updateSidebarState);
    updateSidebarState();

    function animateNumber(el, target) {
        if (!el) return;
        const duration = 800;
        const step = target / (duration / 16);
        let current = 0;
        const tick = () => {
            current += step;
            if (current < target) { el.textContent = String(Math.ceil(current)); requestAnimationFrame(tick); }
            else { el.textContent = String(target); }
        };
        tick();
    }

    (async function loadStats() {
        try {
            const [posts, comments, subscribers, summary] = await Promise.all([
                API.apiGet('/posts'),
                API.apiGet('/comments'),
                API.apiGet('/subscribers'),
                API.apiGet('/analytics/summary')
            ]);
            animateNumber(document.getElementById('statStories'), (posts || []).length);
            animateNumber(document.getElementById('statComments'), (comments || []).length);
            animateNumber(document.getElementById('statSubscribers'), (subscribers || []).length);
            animateNumber(document.getElementById('statVisitors'), (subscribers || []).length);

            const labels = (summary?.timeseries || []).map(p => {
                const d = new Date(p.date); return `${d.getMonth() + 1}/${d.getDate()}`;
            });
            const data = (summary?.timeseries || []).map(p => Number(p.count || 0));

            const userEntriesCtxEl = document.getElementById('userEntriesChart');
            if (userEntriesCtxEl) {
                const userEntriesCtx = userEntriesCtxEl.getContext('2d');
                new Chart(userEntriesCtx, {
                    type: 'line',
                    data: { labels, datasets: [{ label: 'Posts per day', data, backgroundColor: 'rgba(255,0,0,0.1)', borderColor: '#FF0000', borderWidth: 3, tension: 0.4, fill: true }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                });
            }

            const latestWrap = document.getElementById('latestComments');
            if (latestWrap) {
                const sorted = (comments || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);
                latestWrap.innerHTML = sorted.map(c => `
                    <div class="border-b border-gray-200 py-5 hover:bg-gray-50 transition-colors rounded-lg px-4">
                        <div class="flex items-start">
                            <div class="h-12 w-12 rounded-full mr-4 border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                                <i class="fas fa-user text-gray-500"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="font-semibold text-gray-800 text-lg">${c.author_name || 'Anonymous'}</h4>
                                    <span class="text-sm text-gray-500">${new Date(c.created_at).toLocaleString()}</span>
                                </div>
                                <p class="text-gray-600">${c.content}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (e) {
            // silently ignore
        }
    })();

    // charts now built from real data above

    // rating trend chart removed (no mock data)

    const animateElements = document.querySelectorAll('.stat-card, .dashboard-card');
    animateElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in');
        }, 100 * index);
    });
});
