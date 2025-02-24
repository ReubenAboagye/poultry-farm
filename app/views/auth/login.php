<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
            <div class="card shadow-sm mt-5">
                <div class="card-body p-5">
                    <h1 class="h3 mb-4 text-center">Login</h1>
                    
                    <form method="POST" action="<?= UrlHelper::url('login') ?>" class="needs-validation" novalidate>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        
                        <div class="mb-3">
                            <a href="<?= UrlHelper::url('password/forgot') ?>" class="text-decoration-none">
                                Forgot Password?
                            </a>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                        
                        <div class="text-center mt-3">
                            <span>Don't have an account? </span>
                            <a href="<?= UrlHelper::url('register') ?>" class="text-decoration-none">
                                Register here
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div> 