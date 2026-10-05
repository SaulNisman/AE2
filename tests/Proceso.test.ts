// tests/Proceso.test.ts
import { describe, it, expect } from 'vitest';
import { Proceso, EstadoProceso } from '../src/Proceso';

describe('Entidad Proceso [RF02, RF03]', () => {
    it('debe crearse correctamente con valores válidos y estado Nuevo', () => {
        const p = new Proceso(1, 200, 5);
        expect(p.pid).toBe(1);
        expect(p.memoriaRequerida).toBe(200);
        expect(p.cpuRestante).toBe(5);
        expect(p.estado).toBe(EstadoProceso.Nuevo);
    });