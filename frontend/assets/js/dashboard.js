const baseURL = 'http://localhost/tecweb-proyecto/backend';

$(document).ready(function () {
    getUserID();
    $('#sidebarToggle').click(function () {
        $('.sidebar').toggleClass('active');
    });

    // Load initial data
    loadDashboardStats();
    loadTopResources();
    loadCharts();

    $('#logoutBtn').on('click', function (e) {
        e.preventDefault();

        if (!confirm("¿Estas seguro de que deseas cerrar sesión?")) return;

        $.ajax({
            url: baseURL + '/auth/logout',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    window.location.href = 'logout.html';
                } else {
                    alert('No se pudo cerrar sesión correctamente: ' + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al intentar cerrar sesión:', error);
                alert('Error de conexión al cerrar sesión: ' + xhr.status + ' ' + error);
            }
        });
    });
});

function loadDashboardStats() {
    $.ajax({
        url: `${baseURL}/stats/counts`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            animateValue('totalUsers', 0, data.users, 1000);
            animateValue('totalResources', 0, data.resources, 1000);
            animateValue('totalDownloads', 0, data.downloads, 1000);
        },
        error: function (xhr, status, error) {
            console.error("Error loading stats:", error);
        }
    });
}

function getUserID() {
    let user_id = null;
    $.ajax({
        url: `${baseURL}/auth/status`,
        type: 'GET',
        dataType: 'json',
        success: function (authData) {
            if (authData.is_logged_in) {
                user_id = authData.user.id;
                user_name = authData.user.name;
                $('.user-name').text(user_name);
            } else {
                alert("Debes iniciar sesión");
                window.location.href = '../views/announcement.html'; // Redirect
                return;
            }
        },
        error: function (xhr, status, error) {
            console.error("Error checking auth status:", error);
        }
    });
}

function loadTopResources() {
    $.ajax({
        url: `${baseURL}/stats/top-resources`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const ctx = document.getElementById('topResourcesChart').getContext('2d');

            const labels = data.map(item => item.name);
            const values = data.map(item => item.total_downloads);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Descargas',
                        data: values,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.7)',  // Blue
                            'rgba(16, 185, 129, 0.7)',  // Green
                            'rgba(245, 158, 11, 0.7)',  // Orange
                            'rgba(139, 92, 246, 0.7)',  // Purple
                            'rgba(239, 68, 68, 0.7)'    // Red
                        ],
                        borderColor: [
                            '#1e40af',
                            '#047857',
                            '#b45309',
                            '#7c3aed',
                            '#b91c1c'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                borderDash: [2, 4]
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error loading top resources:", error);
        }
    });
}

function loadCharts() {
    // this is for ctivity chart, downloads by date
    $.ajax({
        url: `${baseURL}/stats/by-date`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const ctx = document.getElementById('activityChart').getContext('2d');

            const labels = data.map(item => item.fecha);
            const values = data.map(item => item.cantidad);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Descargas',
                        data: values,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                borderDash: [2, 4]
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error loading activity chart:", error);
        }
    });

    // types chart, resources by type
    $.ajax({
        url: `${baseURL}/stats/type-abs`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const ctx = document.getElementById('typesChart').getContext('2d');

            const labels = data.map(item => item.type);
            const values = data.map(item => item.cantidad);

            const colors = [
                '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2'
            ];

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error loading types chart:", error);
        }
    });
}

function animateValue(id, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const obj = document.getElementById(id);

    // range, if the number is too large
    if (range > 100) {
        obj.innerHTML = end;
        return;
    }

    const timer = setInterval(function () {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}
