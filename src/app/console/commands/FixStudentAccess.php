<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class FixStudentAccess extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'students:fix-access';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualizar payment_verified = true para todos los estudiantes existentes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Actualizando acceso de estudiantes...');

        // Actualizar todos los estudiantes existentes
        $updated = User::where('role', 'student')
            ->update(['payment_verified' => true]);

        $this->info("✅ {$updated} estudiantes actualizados con acceso habilitado");

        // Mostrar resumen
        $totalStudents = User::where('role', 'student')->count();
        $totalAdmins = User::where('role', 'admin')->count();

        $this->newLine();
        $this->table(
            ['Rol', 'Total', 'Con Acceso'],
            [
                ['Estudiantes', $totalStudents, User::where('role', 'student')->where('payment_verified', true)->count()],
                ['Admins', $totalAdmins, User::where('role', 'admin')->where('payment_verified', true)->count()],
            ]
        );

        return 0;
    }
}