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
        Write-Host "Error $method $url : $($_.Exception.Response.StatusCode) - $($_.ErrorDetails)"
        return $_.ErrorDetails
    }
}

Write-Host "--- Book Seats ---"
$booking = Request "POST" "bookings" '{"userId": 1, "showId": 1, "selectedSeats": ["A1", "A2"], "totalAmount": 30.00}'
$bookingId = $booking.bookingId
Write-Host "Booking ID: $bookingId"

Write-Host "--- Verify Seats Occupied ---"
Request "GET" "shows/1/seats" | ConvertTo-Json -Depth 4

Write-Host "--- Try Booking A1 Again ---"
Request "POST" "bookings" '{"userId": 1, "showId": 1, "selectedSeats": ["A1"], "totalAmount": 15.00}'

Write-Host "--- Cancel Booking ---"
Request "DELETE" "bookings/$bookingId" | Out-Null

Write-Host "--- Verify Seats Available ---"
Request "GET" "shows/1/seats" | ConvertTo-Json -Depth 4

Write-Host "--- Verify Booking Soft Deleted ---"
Request "GET" "bookings/$bookingId" | ConvertTo-Json -Depth 4
