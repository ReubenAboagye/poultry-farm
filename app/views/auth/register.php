<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
            <div class="card shadow-sm mt-5">
                <div class="card-body p-5">
                    <h1 class="h3 mb-4 text-center">Register</h1>
                    
                    <form method="POST" action="<?= UrlHelper::url('register') ?>">
                        <div class="mb-3">
                            <label for="name" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>

                        <div class="mb-3">
                            <label for="confirm_password" class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">Register</button>
                        
                        <div class="text-center mt-3">
                            <span>Already have an account? </span>
                            <a href="<?= UrlHelper::url('login') ?>" class="text-decoration-none">
                                Login here
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div> 