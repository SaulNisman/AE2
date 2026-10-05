// src/Simulador.ts
import { Proceso, EstadoProceso } from './Proceso';
import { Memoria } from './Memoria';
import { Planificador } from './Planificador';

export class Simulador {
    private _memoria: Memoria;
    private _planificador: Planificador;
    private _procesos: Proceso[] = [];
    private _tickActual: number = 0;
    private _ticksCpuOcupada: number = 0;

    constructor(tamanoMemoria: number, quantum: number) {
        this._memoria = new Memoria(tamanoMemoria);
        this._planificador = new Planificador(quantum);
    }

    get tickActual(): number { return this._tickActual; }
    get procesos(): Proceso[] { return [...this._procesos]; }

    admitirProceso(proceso: Proceso): void {
        if (this._procesos.some(p => p.pid === proceso.pid)) {
            throw new Error("No se pueden registrar procesos con PID duplicado.");
        }
        if (proceso.memoriaRequerida > this._memoria.tamanoTotal) {
            throw new Error("El proceso requiere más memoria que el total disponible.");
        }
        
        proceso.setEstado(EstadoProceso.EsperandoMemoria);
        this._procesos.push(proceso);
    }

    avanzarTick(): void {
        // 1. Admisión e intento de asignación de memoria (RF06)
        for (const p of this._procesos) {
            if (p.estado === EstadoProceso.EsperandoMemoria) {
                if (this._memoria.asignarFirstFit(p)) {
                    this._planificador.agregarProceso(p);
                }
            }
        }

        // 2. Despacho y ejecución Round-Robin
        this._planificador.ejecutarTick();

        // 3. Actualización de terminados y liberación de recursos
        for (const p of this._procesos) {
            if (p.estado === EstadoProceso.Terminado) {
                this._memoria.liberar(p);
            }
        }

        // 4. Actualización del reloj y contadores para métricas
        this._tickActual++;
        if (this._planificador.procesoEnCpu) {
            this._ticksCpuOcupada++;
        }
    }

    obtenerMetricas() {
        const memLibreTotal = this._memoria.bloques.filter(b => b.libre).reduce((acc, b) => acc + b.tamano, 0);
        const memOcupada = this._memoria.tamanoTotal - memLibreTotal;
        const ocupacionMemoria = (memOcupada / this._memoria.tamanoTotal) * 100;
        
        const utilizacionCpu = this._tickActual === 0 ? 0 : (this._ticksCpuOcupada / this._tickActual) * 100;
        
        const libres = this._memoria.bloques.filter(b => b.libre).map(b => b.tamano);
        const mayorBloqueLibre = libres.length > 0 ? Math.max(...libres) : 0;
        
        // Cálculo de fragmentación externa (RF09)
        let fragmentacionExterna = 0;
        if (memLibreTotal > 0) {
            fragmentacionExterna = (1 - (mayorBloqueLibre / memLibreTotal)) * 100;
        }

        return {
            ocupacionMemoria,
            utilizacionCpu,
            cambiosContexto: this._planificador.cambiosDeContexto,
            memoriaLibreTotal: memLibreTotal,
            mayorBloqueLibre,
            fragmentacionExterna
        };
    }
}