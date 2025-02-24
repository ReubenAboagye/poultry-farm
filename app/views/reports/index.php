<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Reports</h1>
        <div>
            <a href="<?= UrlHelper::url('reports/export') ?>" class="btn btn-success">
                <i class="fas fa-file-export"></i> Export Report
            </a>
        </div>
    </div>

    <div class="row">
        <!-- Weekly Report Card -->
        <div class="col-md-6 mb-4">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Weekly Report</h5>
                    <a href="<?= UrlHelper::url('reports/weekly') ?>" class="btn btn-sm btn-primary">View Details</a>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 text-center">
                            <h6>Sales</h6>
                            <p class="text-success h4">GHS <?= number_format($reports['weekly']['sales']) ?></p>
                        </div>
                        <div class="col-md-4 text-center">
                            <h6>Expenses</h6>
                            <p class="text-danger h4">GHS <?= number_format($reports['weekly']['expenses']) ?></p>
                        </div>
                        <div class="col-md-4 text-center">
                            <h6>Profit</h6>
                            <p class="text-primary h4">GHS <?= number_format($reports['weekly']['profit']) ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Monthly Report Card -->
        <div class="col-md-6 mb-4">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Monthly Report</h5>
                    <a href="<?= UrlHelper::url('reports/monthly') ?>" class="btn btn-sm btn-primary">View Details</a>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 text-center">
                            <h6>Sales</h6>
                            <p class="text-success h4">GHS <?= number_format($reports['monthly']['sales']) ?></p>
                        </div>
                        <div class="col-md-4 text-center">
                            <h6>Expenses</h6>
                            <p class="text-danger h4">GHS <?= number_format($reports['monthly']['expenses']) ?></p>
                        </div>
                        <div class="col-md-4 text-center">
                            <h6>Profit</h6>
                            <p class="text-primary h4">GHS <?= number_format($reports['monthly']['profit']) ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 