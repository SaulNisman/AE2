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
});