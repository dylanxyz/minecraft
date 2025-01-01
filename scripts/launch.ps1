$PACKWIZ_DOWNLOAD_URL = "https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar"

$java = $env:INST_JAVA
$link = $env:SOURCE

if (Test-Path -Path "packwiz-installer-bootstrap.jar") {
    Write-Output "Packwiz installer already downloaded..."
}

else {
    Write-Output "Downloading packwiz installer..."
    Invoke-WebRequest -Uri $PACKWIZ_DOWNLOAD_URL -OutFile "packwiz-installer-bootstrap.jar"
}

$process = Start-Process -PassThru -Wait -FilePath $java -ArgumentList "-jar packwiz-installer-bootstrap.jar $link"

if ($process.ExitCode -ne 0) {
    exit $process.ExitCode
}

$options = @{}

foreach ($line in Get-Content "options.txt") {
    $trimmedLine = $line.Trim()

    if ($trimmedLine -ne "") {
        $index = $trimmedLine.IndexOf(":")
        $key = $trimmedLine.Substring(0, $index).Trim()
        $val = $trimmedLine.Substring($index + 1).Trim()

        if ($key -ne "") {
            $options[$key] = $val
        }
    }
}

foreach ($line in Get-Content "keys.txt") {
    $trimmedLine = $line.Trim()

    if ($trimmedLine -ne "") {
        $idx = $trimmedLine.IndexOf(":")
        $key = $trimmedLine.Substring(0, $idx).Trim()
        $val = $trimmedLine.Substring($idx + 1).Trim()

        if ($options.ContainsKey($key) -ne $true) {
            $options[$key] = $val
        }
    }
}

Set-Content -Path "options.txt" -Value $(
    $options.GetEnumerator() | ForEach-Object {
        "$($_.Key):$($_.Value)"
    }
)
