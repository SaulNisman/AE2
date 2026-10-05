import { describe, it, expect } from 'vitest';
import { Planificador } from '../src/Planificador';
import { Proceso, EstadoProceso } from '../src/Proceso';

describe('Entidad Planificador (Round-Robin) [RF07]', () => {
    it('debe rechazar un quantum inválido y permitir consultar la cola de listos', () => {
        expect(() => new Planificador(0)).toThrowError();
        expect(() => new Planificador(-2)).toThrowError();
        
        const planificador = new Planificador(2);
        const p1 = new Proceso(1, 100, 3);
        planificador.agregarProceso(p1);
        
        expect(planificador.colaListos.length).toBe(1);
        expect(planificador.colaListos[0].pid).toBe(1);
    });

    it('debe ejecutar un proceso hasta que termine si es el único en la cola', () => {
        const planificador = new Planificador(2);
        const p1 = new Proceso(1, 100, 3);
        
        planificador.agregarProceso(p1);
        planificador.ejecutarTick(); 
        expect(planificador.procesoEnCpu?.pid).toBe(1);
        expect(p1.cpuRestante).toBe(2);
        
        planificador.ejecutarTick(); 
        expect(planificador.procesoEnCpu?.pid).toBe(1);
        expect(p1.cpuRestante).toBe(1);
        expect(planificador.cambiosDeContexto).toBe(0);

        planificador.ejecutarTick(); 
        expect(p1.cpuRestante).toBe(0);
        expect(p1.estado).toBe(EstadoProceso.Terminado);
        expect(planificador.procesoEnCpu).toBeNull();
    });

    it('debe alternar procesos al agotar el quantum registrando cambios de contexto', () => {
        const planificador = new Planificador(2);
        const p1 = new Proceso(1, 100, 3);
        const p2 = new Proceso(2, 100, 2);
        
        planificador.agregarProceso(p1);
        planificador.agregarProceso(p2);
        
        planificador.ejecutarTick(); 
        planificador.ejecutarTick(); 
        
        expect(p1.estado).toBe(EstadoProceso.Listo);
        expect(planificador.cambiosDeContexto).toBe(1);
        
        planificador.ejecutarTick(); 
        expect(planificador.procesoEnCpu?.pid).toBe(2);
        expect(p2.estado).toBe(EstadoProceso.Ejecutando);
    });
});