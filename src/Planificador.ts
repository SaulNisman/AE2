import { Proceso, EstadoProceso } from './Proceso';

export class Planificador {
    private _colaListos: Proceso[] = [];
    private _quantum: number;
    private _procesoEnCpu: Proceso | null = null;
    private _quantumRestanteActual: number = 0;
    private _cambiosDeContexto: number = 0;

    constructor(quantum: number) {
        if (quantum <= 0) throw new Error("El quantum debe ser mayor a 0");
        this._quantum = quantum;
    }

    get colaListos(): Proceso[] { return [...this._colaListos]; }
    get procesoEnCpu(): Proceso | null { return this._procesoEnCpu; }
    get cambiosDeContexto(): number { return this._cambiosDeContexto; }

    agregarProceso(proceso: Proceso): void {
        proceso.setEstado(EstadoProceso.Listo);
        this._colaListos.push(proceso);
    }

    ejecutarTick(): void {
        if (!this._procesoEnCpu && this._colaListos.length > 0) {
            this._despachar();
        }

        if (this._procesoEnCpu) {
            this._procesoEnCpu.ejecutarUnTick();
            this._quantumRestanteActual--;

            if (this._procesoEnCpu.estado === EstadoProceso.Bloqueado) {
                this._procesoEnCpu = null;
                this._cambiosDeContexto++;
            } else if (this._procesoEnCpu.cpuRestante === 0) {
                this._procesoEnCpu.setEstado(EstadoProceso.Terminado);
                this._procesoEnCpu = null;
            } else if (this._quantumRestanteActual === 0) {
                if (this._colaListos.length > 0) {
                    this._procesoEnCpu.setEstado(EstadoProceso.Listo);
                    this._colaListos.push(this._procesoEnCpu);
                    this._procesoEnCpu = null;
                    this._cambiosDeContexto++;
                } else {
                    this._quantumRestanteActual = this._quantum;
                }
            }
        }
    }

    private _despachar(): void {
        this._procesoEnCpu = this._colaListos.shift()!;
        this._procesoEnCpu.setEstado(EstadoProceso.Ejecutando);
        this._quantumRestanteActual = this._quantum;
    }
}