---
title: Command Line
category: setup
tags:
- azure
- api
- setup
last_updated: null
source_file: Shell and the CLI.md
---
# Command Line

## bash

```bash
echo "hello world"
cd ~
```

## powershell

[operators](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators?view=powershell-7.1)

[sub-expression](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators?view=powershell-7.1#subexpression-operator--)

```powershell
write-host "hello world"
```

```powershell
"Today is $(Get-Date)"
```

> Today is 12/02/2019 13:15:20

## github cli

To create a clone of your fork, use the --clone flag.

```shell
# set the destination folder
gh_repo_dest="searchdocs"

# set the repo to fork
gh_repo="algolia/docsearch"

# change to the home directory

cd ~
mkdir github
cd github
gh repo fork $gh_repo --clone=true --fork-name $gh_repo_dest
```

wmic 
/output:C:\Temp\list.txt product get name, version
exit

```powershell

Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force

Install-Script -Name Get-RemoteProgram

cd ~\OneDrive\dev\os\win

Export-StartLayout -UseDesktopApplicationID -Path layout.xml

```
