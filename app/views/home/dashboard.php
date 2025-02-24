<div class="row mb-4">
    <div class="col-md-3">
        <div class="card stats-card primary">
            <div class="card-body">
                <h5 class="card-title">Total Birds</h5>
                <h2 class="card-text"><?= number_format($stats['total_birds']) ?></h2>
                <p class="text-muted mb-0">Current Stock</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card stats-card success">
            <div class="card-body">
                <h5 class="card-title">Healthy Birds</h5>
                <h2 class="card-text"><?= number_format($stats['healthy_birds']) ?></h2>
                <p class="text-muted mb-0">Active Stock</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card stats-card warning">
            <div class="card-body">
                <h5 class="card-title">Sick Birds</h5>
                <h2 class="card-text"><?= number_format($stats['sick_birds']) ?></h2>
                <p class="text-muted mb-0">Needs Attention</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card stats-card danger">
            <div class="card-body">
                <h5 class="card-title">Total Batches</h5>
                <h2 class="card-text"><?= number_format($stats['total_batches']) ?></h2>
                <p class="text-muted mb-0">Active Batches</p>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Recent Sales</h5>
                <a href="<?= UrlHelper::url('sales') ?>" class="btn btn-sm btn-primary">View All</a>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Items Sold</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recent_sales as $sale): ?>
                            <tr>
                                <td><?= date('M d, Y', strtotime($sale['date'])) ?></td>
                                <td><?= number_format($sale['items']) ?></td>
                                <td>GHS <?= number_format($sale['amount'], 2) ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <a href="<?= UrlHelper::url('batches/create') ?>" class="btn btn-outline-primary w-100">
                            <i class="fas fa-plus-circle"></i> New Batch
                        </a>
                    </div>
                    <div class="col-md-6">
                        <a href="<?= UrlHelper::url('sales/create') ?>" class="btn btn-outline-success w-100">
                            <i class="fas fa-cash-register"></i> Record Sale
                        </a>
                    </div>
                    <div class="col-md-6">
                        <a href="<?= UrlHelper::url('expenses/create') ?>" class="btn btn-outline-warning w-100">
                            <i class="fas fa-file-invoice"></i> Record Expense
                        </a>
                    </div>
                    <div class="col-md-6">
                        <a href="<?= UrlHelper::url('reports') ?>" class="btn btn-outline-info w-100">
                            <i class="fas fa-chart-bar"></i> Generate Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Upcoming Vaccinations</h5>
                <a href="<?= UrlHelper::url('vaccination-schedule') ?>" class="btn btn-sm btn-primary">View All</a>
            </div>
            <div class="card-body">
                <?php if (!empty($upcoming_vaccinations)): ?>
                    <div class="list-group">
                        <?php foreach ($upcoming_vaccinations as $vaccination): ?>
                            <div class="list-group-item">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1"><?= $vaccination['vaccine'] ?></h6>
                                    <small class="text-muted"><?= date('M d', strtotime($vaccination['date'])) ?></small>
                                </div>
                                <p class="mb-1">Batch: <?= $vaccination['batch'] ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <p class="text-muted mb-0">No upcoming vaccinations</p>
                <?php endif; ?>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">System Status</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span>Feed Stock</span>
                        <span class="text-success">85%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 85%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span>Vaccine Stock</span>
                        <span class="text-warning">45%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-warning" role="progressbar" style="width: 45%"></div>
                    </div>
                </div>
                <div>
                    <div class="d-flex justify-content-between mb-1">
                        <span>Space Utilization</span>
                        <span class="text-info">60%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 60%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 