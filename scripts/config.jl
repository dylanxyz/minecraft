using SHA
using TOML

const URL = "https://raw.githubusercontent.com/dylanxyz/minecraft/optimized/external"
const ROOT = dirname(@__DIR__)
const EXTERNAL = joinpath(ROOT, "external")

function metafile(name, filename, url, hash)
    return Dict(
        "name" => name,
        "filename" => filename,
        "download" => Dict(
            "url" => url,
            "hash" => hash,
            "hash-format" => "sha256"
        )
    )
end

function main()
    for (root, dirs, files) in walkdir(EXTERNAL)
        for file in files
            filepath = joinpath(root, file)
            basepath = replace(filepath, EXTERNAL * "\\" => "")
            download = URL * "/" * replace(basepath, "\\" => "/")
            checksum = bytes2hex(sha256(read(filepath, String)))
            output = joinpath(ROOT, basepath) * ".pw.toml"
            filename = file

            if file == "options.txt"
                filename = "../" * file
                output = joinpath(ROOT, "config", "options.txt.pw.toml")
            end

            if isfile(output)
                try
                    meta = TOML.parsefile(output)
                    if meta["download"]["hash"] == checksum
                        @info "Skipping file (not modified)" file
                        continue
                    end
                catch e
                    # pass
                end
            end

            mkpath(dirname(output))
            open(output, "w") do io
                @info "Writing meta file" output
                TOML.print(io, metafile(file, filename, download, checksum))
            end
        end
    end
end

main()
