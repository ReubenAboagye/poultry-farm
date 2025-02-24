<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Set New Password</h5>
            </div>
            <div class="card-body">
                <form method="post" action="/password/reset" class="needs-validation" novalidate>
                    <input type="hidden" name="identifier" value="<?= htmlspecialchars($email) ?>">
                    <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">

                    <div class="mb-3">
                        <label for="password" class="form-label">New Password</label>
                        <div class="input-group">
                            <input type="password" class="form-control" id="password" name="password" required 
                                   minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="invalid-feedback">
                            Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="confirm_password" class="form-label">Confirm Password</label>
                        <div class="input-group">
                            <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
                            <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="invalid-feedback">
                            Passwords do not match.
                        </div>
                    </div>

                    <div class="password-strength mb-3">
                        <small class="d-block mb-2">Password must contain:</small>
                        <div class="requirements">
                            <small class="requirement" data-requirement="length">
                                <i class="fas fa-times text-danger"></i> At least 8 characters
                            </small><br>
                            <small class="requirement" data-requirement="lowercase">
                                <i class="fas fa-times text-danger"></i> One lowercase letter
                            </small><br>
                            <small class="requirement" data-requirement="uppercase">
                                <i class="fas fa-times text-danger"></i> One uppercase letter
                            </small><br>
                            <small class="requirement" data-requirement="number">
                                <i class="fas fa-times text-danger"></i> One number
                            </small>
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary">
                            Reset Password
                        </button>
                        <a href="<?= UrlHelper::url('login') ?>" class="btn btn-link">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const requirements = document.querySelectorAll('.requirement');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Check password requirements
    password.addEventListener('input', function() {
        const value = this.value;
        
        // Check length
        const lengthReq = document.querySelector('[data-requirement="length"]');
        if (value.length >= 8) {
            lengthReq.querySelector('i').className = 'fas fa-check text-success';
        } else {
            lengthReq.querySelector('i').className = 'fas fa-times text-danger';
        }

        // Check lowercase
        const lowercaseReq = document.querySelector('[data-requirement="lowercase"]');
        if (/[a-z]/.test(value)) {
            lowercaseReq.querySelector('i').className = 'fas fa-check text-success';
        } else {
            lowercaseReq.querySelector('i').className = 'fas fa-times text-danger';
        }

        // Check uppercase
        const uppercaseReq = document.querySelector('[data-requirement="uppercase"]');
        if (/[A-Z]/.test(value)) {
            uppercaseReq.querySelector('i').className = 'fas fa-check text-success';
        } else {
            uppercaseReq.querySelector('i').className = 'fas fa-times text-danger';
        }

        // Check number
        const numberReq = document.querySelector('[data-requirement="number"]');
        if (/\d/.test(value)) {
            numberReq.querySelector('i').className = 'fas fa-check text-success';
        } else {
            numberReq.querySelector('i').className = 'fas fa-times text-danger';
        }
    });

    // Check password match
    confirmPassword.addEventListener('input', function() {
        if (this.value === password.value) {
            this.setCustomValidity('');
        } else {
            this.setCustomValidity('Passwords do not match');
        }
    });
});
</script> 