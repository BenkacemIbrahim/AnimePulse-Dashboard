document.addEventListener('DOMContentLoaded', function () {

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
