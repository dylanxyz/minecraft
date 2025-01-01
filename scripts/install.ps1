$filename = ""
$source = $args[0]
$type = $args[1]
$url = $args[2]

if (Test-Path ".temp") {
    Remove-Item -Recurse -Force -Path ".temp"
}

New-Item -ItemType Directory -Path ".temp" -Force

if ($type -ne "resourcepacks" -and $type -ne "shaderpacks" -and $type -ne "datapacks") {
    packwiz.exe -y $source add $url --meta-folder ".temp"

    foreach ($file in Get-ChildItem -Path ".temp" -File) {
        $modname = $file.Name -replace ".pw.toml",""

        if ($url -Match $modname) {
            $filename = $file.Name
        }

        (Get-Content $file.FullName) -replace
            'filename\s*=\s*"(?!\.\.)',"filename = `"../"
            | Set-Content -Path $file.FullName
    }

    if ($filename -eq "") {
        Write-Error "Mod not found"
        exit 1
    }

    Move-Item -Force -Path ".temp\$filename" -Destination "mods\$type\$filename"

    foreach ($file in Get-ChildItem -Path ".temp" -File) {
        $libpath = "mods\library\$($file.Name)"

        if (!(Test-Path -Path $libpath)) {
            Move-Item -Path $file.FullName -Destination $libpath
        }
    }
}

else {
    packwiz.exe -y $source add $url --meta-folder $type
}

if (Test-Path ".temp") {
    Remove-Item -Recurse -Force -Path ".temp"
}
