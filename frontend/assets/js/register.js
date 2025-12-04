$(document).ready(function () {
    let baseURL = 'http://localhost/proyecto/backend';
    let emailAvailable = false;


    $('#passwordToggle1').on('click', function () {
        const passwordInput = $('#password');
        const toggleIcon = $(this).find('.toggle-icon');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        toggleIcon.toggleClass('show-password');
    });

    $('#passwordToggle2').on('click', function () {
        const passwordInput = $('#password_confirmation');
        const toggleIcon = $(this).find('.toggle-icon');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        toggleIcon.toggleClass('show-password');
    });


    $('#email').on('blur', function () {
        const email = $(this).val();
        const formGroup = $(this).closest('.form-group');

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            $('#emailError').text('Por favor ingresa un email valido');
            formGroup.addClass('error');
        } else {
            formGroup.removeClass('error');
            $('#emailError').text('');
        }
    });


    $('#registerForm').submit(function (e) {
        e.preventDefault();
        emailAvailable = false;

        const email = $('#email').val();

        if (!validateEmail(email)) {
            validateForm();
            return;
        }

        checkEmailAvailability().done(function (response) {

            const isAvailable = response.available === true;

            if (!isAvailable) {
                $('#emailError').text('El correo electrónico ya está registrado');
                $('#email').closest('.form-group').addClass('error');
                return;
            }

            emailAvailable = true;
            if (validateForm()) {
                registerUser();
            }
        });
    });

    $('#email').keyup(function () {
        const email = $(this).val();

        if (email && validateEmail(email)) {
            checkEmailAvailability(email).done(function (response) {
                const isAvailable = response.available === true;
                emailAvailable = isAvailable;

                if (!isAvailable) {
                    $('#emailError').text('El correo electrónico ya está registrado');
                    $('#email').closest('.form-group').addClass('error');
                } else {
                    $('#emailError').text('');
                    $('#email').closest('.form-group').removeClass('error');
                }
            });
        } else {
            emailAvailable = false;
            $('#emailError').text('');
            $('#email').closest('.form-group').removeClass('error');
        }
    });

    $('#password_confirmation').keyup(function () {
        const password = $('#password').val();
        const confirmPassword = $(this).val();

        if (confirmPassword !== "") {
            if (password !== confirmPassword) {
                $('#passwordConfirmError').text('Las contraseñas no coinciden');
                $('#password_confirmation').closest('.form-group').addClass('error');
            } else {
                $('#passwordConfirmError').text('');
                $('#password_confirmation').closest('.form-group').removeClass('error');
            }
        }
    });

    function checkEmailAvailability(email = null) {
        const emailToCheck = email || $('#email').val();

        return $.ajax({
            url: baseURL + '/auth/validate-email',
            type: 'GET',
            data: { email: emailToCheck }
        });
    }

    function validateForm() {
        let isValid = true;
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#password_confirmation').val();

        $('.form-group').removeClass('error');
        $('.error-message').text('');

        if (!validateEmail(email)) {
            $('#emailError').text('Por favor ingresa un email válido');
            $('#email').closest('.form-group').addClass('error');
            isValid = false;
        }
        else if (!emailAvailable) {
            $('#emailError').text('El correo electrónico ya está registrado');
            $('#email').closest('.form-group').addClass('error');
            isValid = false;
        }

        if (!validatePassword(password)) {
            $('#passwordError').text('La contraseña debe tener al menos 8 caracteres y contener al menos una mayúscula, una minúscula y un número');
            $('#password').closest('.form-group').addClass('error');
            isValid = false;
        }

        if (password !== confirmPassword) {
            $('#passwordConfirmError').text('Las contraseñas no coinciden');
            $('#password_confirmation').closest('.form-group').addClass('error');
            isValid = false;
        }

        if ($('#username').length) {
            const username = $('#username').val();
            if (!username) {
                $('#usernameError').text('Por favor ingresa un nombre de usuario');
                $('#username').closest('.form-group').addClass('error');
                isValid = false;
            }
        }

        return isValid;
    }

    function registerUser() {
        const submitBtn = $('#registerForm').find('.login-btn');
        submitBtn.addClass('loading');

        const userData = {
            email: $('#email').val(),
            name: $('#username').val(),
            password: $('#password').val(),
            password_confirmation: $('#password_confirmation').val()
        };

        $.ajax({
            url: baseURL + '/auth/signup',
            type: 'POST',
            data: userData,
            success: function (response) {
                submitBtn.removeClass('loading');
                if (response.status === 'success') {
                    $('#successMessage').addClass('show');
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    console.log('Error:', response);
                }
            },
            error: function (xhr) {
                submitBtn.removeClass('loading');
                console.log('Error ajax:', xhr);
            }
        });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }
});