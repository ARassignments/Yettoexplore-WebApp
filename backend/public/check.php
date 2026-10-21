<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/plain; charset=utf-8');

echo "========================================\n";
echo "   Yettoexplore Laravel Diagnostics     \n";
echo "========================================\n\n";

// 1. PHP Version
echo "1. PHP Version: " . PHP_VERSION . "\n";
echo "   PHP SAPI: " . PHP_SAPI . "\n\n";

// 2. Critical Files Check
$backendRoot = realpath(__DIR__ . '/..');
echo "2. Backend Root: " . ($backendRoot ?: 'Could not resolve parent directory') . "\n";

$autoloadPath = __DIR__ . '/../vendor/autoload.php';
echo "   vendor/autoload.php: " . (file_exists($autoloadPath) ? "EXISTS (" . realpath($autoloadPath) . ")" : "MISSING!") . "\n";

$envPath = __DIR__ . '/../.env';
echo "   .env file: " . (file_exists($envPath) ? "EXISTS" : "MISSING! (.env file not found in root)") . "\n";

$appBootstrap = __DIR__ . '/../bootstrap/app.php';
echo "   bootstrap/app.php: " . (file_exists($appBootstrap) ? "EXISTS" : "MISSING!") . "\n\n";

// 3. Writable Directories
echo "3. Writable Permissions:\n";
$storageDir = __DIR__ . '/../storage';
$cacheDir = __DIR__ . '/../bootstrap/cache';
echo "   storage/: " . (is_writable($storageDir) ? "WRITABLE" : "NOT WRITABLE (Fix permissions to 775/777)") . "\n";
echo "   bootstrap/cache/: " . (is_writable($cacheDir) ? "WRITABLE" : "NOT WRITABLE (Fix permissions to 775/777)") . "\n\n";

// 4. Critical Extensions Check
echo "4. PHP Extensions:\n";
$extensions = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'bcmath', 'curl', 'fileinfo'];
foreach ($extensions as $ext) {
    echo "   $ext: " . (extension_loaded($ext) ? "OK" : "MISSING!") . "\n";
}
echo "\n";

// 5. Try Bootstrapping Laravel
echo "5. Attempting to Bootstrap Laravel:\n";
if (!file_exists($autoloadPath)) {
    echo "   ABORTED: Cannot bootstrap because vendor/autoload.php does not exist.\n";
} else {
    try {
        require_once $autoloadPath;
        echo "   Autoloader loaded successfully.\n";

        if (!file_exists($appBootstrap)) {
            echo "   ABORTED: bootstrap/app.php not found.\n";
        } else {
            $app = require_once $appBootstrap;
            echo "   Application instance created.\n";

            // Test kernel handling
            $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
            echo "   HTTP Kernel created successfully.\n";
            echo "   >>> LARAVEL BOOTED WITHOUT FATAL ERRORS! <<<\n";
        }
    } catch (\Throwable $e) {
        echo "   FATAL ERROR CAUGHT:\n";
        echo "   Class: " . get_class($e) . "\n";
        echo "   Message: " . $e->getMessage() . "\n";
        echo "   File: " . $e->getFile() . ":" . $e->getLine() . "\n";
        echo "   Trace:\n" . $e->getTraceAsString() . "\n";
    }
}
echo "\n";

// 6. Check error_log and laravel.log
echo "6. Recent storage/logs/laravel.log:\n";
$laravelLog = __DIR__ . '/../storage/logs/laravel.log';
if (file_exists($laravelLog) && is_readable($laravelLog)) {
    $lines = file($laravelLog);
    $lastLines = array_slice($lines, -35);
    echo implode("", $lastLines);
} else {
    echo "   laravel.log does not exist or is not readable.\n";
}

echo "\n7. Recent PHP error_log entries:\n";
$errorLogFile = __DIR__ . '/error_log';
if (file_exists($errorLogFile) && is_readable($errorLogFile)) {
    $lines = file($errorLogFile);
    $lastLines = array_slice($lines, -15);
    echo implode("", $lastLines);
} else {
    echo "   No readable error_log in public directory.\n";
}


echo "\n========================================\n";
