<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Reset Password</h5>
            </div>
            <div class="card-body">
                <form method="post" action="/password/forgot" class="needs-validation" novalidate>
                    <div class="mb-4">
                        <label class="form-label">How would you like to reset your password?</label>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="reset_type" id="resetEmail" value="email" checked>
                            <label class="form-check-label" for="resetEmail">
                                Via Email
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="reset_type" id="resetPhone" value="phone">
                            <label class="form-check-label" for="resetPhone">
                                Via SMS
                            </label>
                        </div>
                    </div>

                    <div id="emailField" class="mb-3">
                        <label for="email" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <div class="invalid-feedback">
                            Please enter a valid email address.
                        </div>
                    </div>

                    <div id="phoneField" class="mb-3" style="display: none;">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phone" name="phone" pattern="[0-9]{10}" placeholder="0XXXXXXXXX">
                        <div class="invalid-feedback">
                            Please enter a valid phone number.
                        </div>
                        <small class="text-muted">Enter your 10-digit phone number</small>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary">
                            Send Reset Instructions
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
    const emailField = document.getElementById('emailField');
    const phoneField = document.getElementById('phoneField');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    document.querySelectorAll('input[name="reset_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'email') {
                emailField.style.display = 'block';
                phoneField.style.display = 'none';
                emailInput.required = true;
                phoneInput.required = false;
            } else {
                emailField.style.display = 'none';
                phoneField.style.display = 'block';
                emailInput.required = false;
                phoneInput.required = true;
            }
        });
    });
});
</script>

<div class="text-center mt-3">
    <a href="<?= UrlHelper::url('login') ?>" class="text-decoration-none">
        Back to Login
    </a>
</div> 