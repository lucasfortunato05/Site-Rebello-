param(
    [string]$OutDir
)

$ErrorActionPreference = 'Stop'

if (-not $OutDir) {
    $OutDir = Join-Path (Split-Path $PSScriptRoot -Parent) 'assets\favicon'
}

Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function New-Point {
    param(
        [double]$X,
        [double]$Y
    )

    return [System.Drawing.PointF]::new([float]$X, [float]$Y)
}

function New-InfinityPath {
    param(
        [int]$Size
    )

    $scale = $Size / 1024.0
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()

    $path.AddBezier(
        (New-Point (512 * $scale) (512 * $scale)),
        (New-Point (432 * $scale) (324 * $scale)),
        (New-Point (240 * $scale) (324 * $scale)),
        (New-Point (128 * $scale) (512 * $scale))
    )
    $path.AddBezier(
        (New-Point (128 * $scale) (512 * $scale)),
        (New-Point (240 * $scale) (700 * $scale)),
        (New-Point (432 * $scale) (700 * $scale)),
        (New-Point (512 * $scale) (512 * $scale))
    )
    $path.AddBezier(
        (New-Point (512 * $scale) (512 * $scale)),
        (New-Point (592 * $scale) (324 * $scale)),
        (New-Point (784 * $scale) (324 * $scale)),
        (New-Point (896 * $scale) (512 * $scale))
    )
    $path.AddBezier(
        (New-Point (896 * $scale) (512 * $scale)),
        (New-Point (784 * $scale) (700 * $scale)),
        (New-Point (592 * $scale) (700 * $scale)),
        (New-Point (512 * $scale) (512 * $scale))
    )

    return $path
}

function New-MetalBrush {
    param(
        [int]$Size
    )

    $scale = $Size / 1024.0
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        (New-Point (128 * $scale) (512 * $scale)),
        (New-Point (896 * $scale) (512 * $scale)),
        [System.Drawing.Color]::FromArgb(255, 122, 83, 6),
        [System.Drawing.Color]::FromArgb(255, 125, 132, 141)
    )

    $blend = [System.Drawing.Drawing2D.ColorBlend]::new()
    $blend.Colors = [System.Drawing.Color[]]@(
        [System.Drawing.Color]::FromArgb(255, 122, 83, 6),
        [System.Drawing.Color]::FromArgb(255, 196, 143, 32),
        [System.Drawing.Color]::FromArgb(255, 245, 213, 106),
        [System.Drawing.Color]::FromArgb(255, 255, 244, 202),
        [System.Drawing.Color]::FromArgb(255, 215, 187, 115),
        [System.Drawing.Color]::FromArgb(255, 246, 249, 252),
        [System.Drawing.Color]::FromArgb(255, 199, 204, 210),
        [System.Drawing.Color]::FromArgb(255, 125, 132, 141)
    )
    $blend.Positions = [single[]]@(0.0, 0.12, 0.24, 0.34, 0.47, 0.63, 0.79, 1.0)
    $brush.InterpolationColors = $blend

    return $brush
}

function New-HighlightBrush {
    param(
        [int]$Size
    )

    $scale = $Size / 1024.0
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        (New-Point (220 * $scale) (300 * $scale)),
        (New-Point (804 * $scale) (748 * $scale)),
        [System.Drawing.Color]::FromArgb(0, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(0, 255, 255, 255)
    )

    $blend = [System.Drawing.Drawing2D.ColorBlend]::new()
    $blend.Colors = [System.Drawing.Color[]]@(
        [System.Drawing.Color]::FromArgb(0, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(188, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(86, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(0, 255, 255, 255)
    )
    $blend.Positions = [single[]]@(0.0, 0.22, 0.58, 1.0)
    $brush.InterpolationColors = $blend

    return $brush
}

function Set-Quality {
    param(
        [System.Drawing.Graphics]$Graphics
    )

    $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $Graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $Graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
}

function Draw-Favicon {
    param(
        [int]$Size,
        [string]$Destination
    )

    $bitmap = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    $path = $null
    $outlinePen = $null
    $mainPen = $null
    $highlightPen = $null
    $metalBrush = $null
    $highlightBrush = $null

    try {
        Set-Quality -Graphics $graphics
        $graphics.Clear([System.Drawing.Color]::Transparent)

        $scale = $Size / 1024.0
        $path = New-InfinityPath -Size $Size

        $outlinePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(72, 33, 24, 11), [single](176 * $scale))
        $outlinePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $outlinePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $outlinePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

        $metalBrush = New-MetalBrush -Size $Size
        $mainPen = [System.Drawing.Pen]::new($metalBrush, [single](136 * $scale))
        $mainPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $mainPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $mainPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

        $highlightBrush = New-HighlightBrush -Size $Size
        $highlightPen = [System.Drawing.Pen]::new($highlightBrush, [single](38 * $scale))
        $highlightPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $highlightPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $highlightPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

        $graphics.DrawPath($outlinePen, $path)
        $graphics.DrawPath($mainPen, $path)
        $graphics.DrawPath($highlightPen, $path)

        $bitmap.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        if ($highlightPen) { $highlightPen.Dispose() }
        if ($mainPen) { $mainPen.Dispose() }
        if ($outlinePen) { $outlinePen.Dispose() }
        if ($highlightBrush) { $highlightBrush.Dispose() }
        if ($metalBrush) { $metalBrush.Dispose() }
        if ($path) { $path.Dispose() }
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}

$targets = [ordered]@{
    'rebello-infinity-4096.png' = 4096
    'rebello-infinity-1024.png' = 1024
    'android-chrome-512x512.png' = 512
    'android-chrome-192x192.png' = 192
    'apple-touch-icon.png' = 180
    'favicon-96x96.png' = 96
    'favicon-64x64.png' = 64
    'favicon-32x32.png' = 32
    'favicon-16x16.png' = 16
}

foreach ($target in $targets.GetEnumerator()) {
    Draw-Favicon -Size $target.Value -Destination (Join-Path $OutDir $target.Key)
}

Write-Output "Favicons gerados em $OutDir"
