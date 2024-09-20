const ROOT = dirname(@__DIR__)
const CONFIG = joinpath(ROOT, "config")
const EXTERNAL = joinpath(ROOT, "external")

function main(dir)
    for (root, dirs, files) in walkdir(CONFIG)
        for file in files
            filepath = joinpath(root, file)
            basepath = replace(filepath, ROOT * "\\" => "", ".pw.toml" => "")

            # meta file
            if endswith(file, ".pw.toml")
                filepath = joinpath(EXTERNAL, basepath)
            end

            linkpath = joinpath(dir, basepath)

            if !isdir(dirname(linkpath))
                mkpath(dirname(linkpath))
            end

            if !isfile(linkpath)
                run(`cmd.exe /C "mklink $(linkpath) $(filepath)"`)
            end
        end
    end
end

main(ARGS[1])
