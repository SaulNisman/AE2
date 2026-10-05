import { describe, it, expect } from 'vitest';
import { Memoria } from '../src/Memoria';
import { Proceso } from '../src/Proceso';

describe('Entidad Memoria [RF04, RF05]', () => {
    it('debe inicializarse con un único bloque libre del tamaño total', () => {
        const mem = new Memoria(1024);
        expect(mem.bloques.length).toBe(1);
        expect(mem.bloques[0].tamano).toBe(1024);
        expect(mem.bloques[0].libre).toBe(true);
    });

    it('debe asignar memoria mediante First-Fit y dividir el bloque cuando sobre espacio', () => {
        const mem = new Memoria(1024);
        const p1 = new Proceso(1, 200, 5);
        
        const exito = mem.asignarFirstFit(p1);
        
        expect(exito).toBe(true);
        expect(mem.bloques.length).toBe(2);
        expect(mem.bloques[0].tamano).toBe(200);
        expect(mem.bloques[0].libre).toBe(false);
        expect(mem.bloques[1].tamano).toBe(824);
        expect(mem.bloques[1].libre).toBe(true);
    });

    it('debe liberar memoria y realizar coalescencia automática de bloques contiguos', () => {
        const mem = new Memoria(1024);
        const p1 = new Proceso(1, 200, 5);
        const p2 = new Proceso(2, 300, 5);
        
        mem.asignarFirstFit(p1);
        mem.asignarFirstFit(p2);
        expect(mem.bloques.length).toBe(3); // p1 (200), p2 (300), Libre (524)
        
        mem.liberar(p1);
        expect(mem.bloques.length).toBe(3); // p1 libre, p2 ocupado, resto libre. No se pueden fusionar.
        
        mem.liberar(p2);
        expect(mem.bloques.length).toBe(1); // p2 se libera, conectando el primer bloque con el último. Fusión total.
        expect(mem.bloques[0].tamano).toBe(1024);
    });
});