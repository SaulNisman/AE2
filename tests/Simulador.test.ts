import { describe, it, expect } from 'vitest';
import { Simulador } from '../src/Simulador';
import { Proceso, EstadoProceso } from '../src/Proceso';

describe('Entidad Simulador [RF01, RF06, RF08, RF09]', () => {
    it('debe iniciar correctamente y rechazar PIDs duplicados o memoria excesiva', () => {
        const sim = new Simulador(1024, 2);
        expect(sim.tickActual).toBe(0);
        
        const p1 = new Proceso(1, 200, 5);
        sim.admitirProceso(p1);
        
        expect(() => sim.admitirProceso(new Proceso(1, 300, 2))).toThrowError(); 
        expect(() => sim.admitirProceso(new Proceso(2, 2048, 2))).toThrowError(); 
    });

    it('debe avanzar un tick, integrar memoria y CPU, y calcular métricas', () => {
        const sim = new Simulador(1024, 2);
        const p1 = new Proceso(1, 512, 3);
        
        sim.admitirProceso(p1);
        sim.avanzarTick(); 
        
        expect(sim.tickActual).toBe(1);
        expect(p1.estado).toBe(EstadoProceso.Ejecutando);
        
        const metricas = sim.obtenerMetricas();
        expect(metricas.utilizacionCpu).toBe(100);
        expect(metricas.ocupacionMemoria).toBe(50); 
        expect(metricas.memoriaLibreTotal).toBe(512);
        expect(metricas.fragmentacionExterna).toBe(0); 
    });

    it('debe bloquear por E/S, reducir temporizador y retomar ejecución [RF08]', () => {
        const sim = new Simulador(1024, 3);
        const p = new Proceso(1, 100, 5);
        p.configurarES(2, 2); // A los 2 ticks de CPU consumidos, se bloquea por 2 ticks
        
        sim.admitirProceso(p);
        
        sim.avanzarTick(); // P lleva 1 tick
        sim.avanzarTick(); // P lleva 2 ticks -> ¡Se bloquea!
        expect(p.estado).toBe(EstadoProceso.Bloqueado);
        
        sim.avanzarTick(); // Bloqueado (le queda 1 tick de bloqueo)
        expect(p.estado).toBe(EstadoProceso.Bloqueado);
        
        sim.avanzarTick(); // Bloqueado llega a 0 -> Pasa a Listo y se despacha en el mismo tick
        expect(p.estado).toBe(EstadoProceso.Ejecutando);
    });
});