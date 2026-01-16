<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This route serves the React application.
| The Home page ("/") loads first,
| and React Router handles the rest.
|
*/

Route::get('/', function () {
    return view('welcome');
});

/* Catch-all for React routes */
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
