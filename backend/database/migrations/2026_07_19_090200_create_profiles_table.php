<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->nullable();
            $table->string('display_name')->nullable();
            $table->string('professional_title')->nullable();
            $table->text('short_bio')->nullable();
            $table->longText('full_bio')->nullable();
            $table->string('hero_heading')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('about_image')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('availability_status')->nullable();
            $table->string('availability_text')->nullable();
            $table->date('birth_date')->nullable();
            $table->unsignedSmallInteger('years_experience')->nullable();
            $table->unsignedInteger('projects_completed')->nullable();
            $table->unsignedInteger('clients_served')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
