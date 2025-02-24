<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1><?= $title ?></h1>
        <a href="<?= UrlHelper::url('reports') ?>" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Reports
        </a>
    </div>

    <div class="card">
        <div class="card-body">
            <p>Detailed <?= strtolower($title) ?> will be displayed here.</p>
        </div>
    </div>
</div> 