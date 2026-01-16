<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kraven Portfolio</title>

  <!-- ✅ Tab icon / favicon (PNG) -->
  <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

  <!-- (Optional but nice) iPhone / iPad home screen icon -->
  <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">

  <!-- One-font setup: Inter only -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
  <div id="app"></div>
</body>
</html>
