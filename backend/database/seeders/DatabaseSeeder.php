<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        // Create a test user with a specific role
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::factory()->create([
                'email' => 'admin@example.com',
            ])->assignRole('admin');
        }
    }
}
