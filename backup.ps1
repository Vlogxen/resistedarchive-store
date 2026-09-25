# Автоматический бекап на конец дня
# Запускай этот скрипт каждый вечер: .\backup.ps1

# Получаем текущую дату
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH-mm"

# Путь к проекту
$projectPath = Get-Location

# Путь к папке бекапов
$backupRoot = "..\backups"
$backupPath = "$backupRoot\backup_$date`_$time"

Write-Host "🔄 Начинаем создание бекапа..." -ForegroundColor Cyan

# Создаем папку для бекапов если её нет
if (-not (Test-Path $backupRoot)) {
    New-Item -ItemType Directory -Path $backupRoot | Out-Null
    Write-Host "✅ Создана папка для бекапов: $backupRoot" -ForegroundColor Green
}

# Копируем весь проект
Copy-Item -Path $projectPath -Destination $backupPath -Recurse -Force

Write-Host "✅ Бекап успешно создан!" -ForegroundColor Green
Write-Host "📁 Расположение: $backupPath" -ForegroundColor Yellow
Write-Host "⏰ Время: $date $time" -ForegroundColor Yellow

# Показываем размер бекапа
$size = (Get-ChildItem $backupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "💾 Размер: $([math]::Round($size, 2)) MB" -ForegroundColor Yellow

# Проверяем установлен ли Git
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host ""
    Write-Host "📝 Делаем Git коммит..." -ForegroundColor Cyan
    
    # Добавляем все изменения
    git add .
    
    # Создаем коммит
    $commitMessage = "Бекап: $date $time"
    git commit -m $commitMessage
    
    Write-Host "✅ Git коммит создан: $commitMessage" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Git не установлен. Установи Git для версионного контроля:" -ForegroundColor Yellow
    Write-Host "   https://git-scm.com/download/win" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Все готово! Можешь закрывать проект на сегодня." -ForegroundColor Green
