$commonJsContent = @'
{
  "type": "commonjs"
}
'@

$moduleContent = @'
{
  "type": "module"
}
'@

# Write the content to the files
$commonJsContent | Out-File -FilePath "dist/cjs/package.json" -Force
$moduleContent | Out-File -FilePath "dist/mjs/package.json" -Force