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
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        }
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (!passwordInput || !toggleIcon) return;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const button = form.querySelector('button[type="submit"]');
        if (!button) return;

        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';
        API.apiPost('/auth/login', { email, password })
            .then((data) => {
                API.setToken(data.token);
                button.innerHTML = '<i class="fas fa-check mr-2"></i> Success!';
                setTimeout(() => { window.location.href = 'home.html'; }, 500);
            })
            .catch((err) => {
                button.disabled = false;
                button.innerHTML = originalText;
                alert('Login failed');
            });
    });
});
