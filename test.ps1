$ErrorActionPreference = 'Stop'

function Request($method, $url, $body) {
    $params = @{
        Uri = "http://localhost:8080/api/$url"
        Method = $method
        ContentType = "application/json"
    }
    if ($body) { $params.Body = $body }
    try {
        $result = Invoke-RestMethod @params
        Write-Host "Success $method $url"
        return $result
    } catch {
        Write-Host "Error $method $url : $($_.Exception.Message)"
        return $_.ErrorDetails
    }
}

Write-Host "--- Health Check ---"
Request "GET" "health" | ConvertTo-Json

Write-Host "--- Create Movie ---"
$movie = Request "POST" "movies" '{"title": "Inception", "price": 10.0}'
$movieId = $movie.id
Write-Host "Movie ID: $movieId"

Write-Host "--- Create Theatre ---"
$theatre = Request "POST" "theatres" '{"theatreName": "PVR Cinemas", "city": "Mumbai"}'
$theatreId = $theatre.theatreId
Write-Host "Theatre ID: $theatreId"

Write-Host "--- Create Screen ---"
$screen = Request "POST" "screens" "{""theatreId"": $theatreId, ""screenName"": ""Screen 1"", ""capacity"": 50, ""screenType"": ""IMAX""}"
$screenId = $screen.screenId
Write-Host "Screen ID: $screenId"

Write-Host "--- Create Show ---"
# Need to set price inside show since we defined it there, and startTime
$show = Request "POST" "shows" "{""movieId"": $movieId, ""screenId"": $screenId, ""startTime"": ""2026-10-01T18:00:00"", ""price"": 15.00}"
$showId = $show.showId
Write-Host "Show ID: $showId"

Write-Host "--- Verify GET Shows ---"
Request "GET" "shows" | ConvertTo-Json -Depth 4
