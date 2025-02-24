# Poultry Farm Management System

A comprehensive web application for managing poultry farm operations, built with PHP and MySQL.

## Features

- User Authentication
  - Secure login and registration
  - Password reset functionality
  - Session management

- Dashboard
  - Real-time statistics
  - Quick action buttons
  - System status indicators

- Poultry Management
  - Track total birds
  - Monitor bird health
  - Manage batches
  - Vaccination schedules

- Financial Management
  - Sales tracking
  - Expense recording
  - Financial reporting
  - Revenue analytics

- Reporting System
  - Weekly reports
  - Monthly summaries
  - Export functionality
  - Data visualization

## Requirements

- PHP 8.0+
- MySQL 5.7+
- Apache with mod_rewrite
- Composer (for future updates)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ReubenAboagye/poultry-farm.git
cd poultry-farm
```

2. Set up your database:
   - Create a new MySQL database
   - Import `database/schema.sql`
   - Update database credentials in `app/config/database.php`

3. Configure web server:
   - Point document root to the `public` directory
   - Ensure mod_rewrite is enabled
   - Set proper directory permissions

4. Access the application:
   - Visit: `http://localhost/farm/public`
   - Default login:
     - Email: admin@poultryfarm.com
     - Password: password

## Project Structure

```
poultry-farm/
├── app/
│   ├── config/      # Configuration files
│   ├── controllers/ # Controllers
│   ├── core/        # Framework core
│   ├── models/      # Database models
│   └── views/       # View templates
├── database/        # Database files
├── public/          # Public assets
└── README.md        # This file
```

## Security Features

- Password hashing
- SQL injection prevention
- XSS protection
- CSRF protection
- Input validation
- Secure session handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Reuben Akwasi Aboagye
- Email: reubenaboagye@hotmail.com
- GitHub: [@ReubenAboagye](https://github.com/ReubenAboagye)

## Acknowledgments

- Bootstrap for UI components
- Font Awesome for icons
- PHP community for inspiration
