# Fix Nginx Configuration Script
$password = "J@nineJ@nine9560"
$server = "root@116.203.229.47"

Write-Host "Step 1: Checking current Nginx status..."
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($server, $securePassword)

# Commands to execute
$commands = @(
    "# Restore backup if needed",
    "cp /etc/nginx/sites-enabled/idealcar.backup /etc/nginx/sites-enabled/idealcar 2>/dev/null || echo 'Backup restored or not needed'",
    "",
    "# Create new config with uploads location",
    "sed -i '/location \/ {/i\    location /uploads/ {\n        alias /var/www/idealcar/frontend/public/uploads/;\n        expires 30d;\n        add_header Cache-Control \"public, immutable\";\n    }\n' /etc/nginx/sites-enabled/idealcar",
    "",
    "# Test configuration",
    "nginx -t",
    "",
    "# Reload if test passes",
    "systemctl reload nginx",
    "",
    "# Show status",
    "systemctl status nginx --no-pager"
)

$commandString = $commands -join "`n"
Write-Host "Executing commands on server..."
Write-Host $commandString
