export enum EstadoProceso {
    Nuevo = 'Nuevo',
    EsperandoMemoria = 'Esperando Memoria',
    Listo = 'Listo',
    Ejecutando = 'Ejecutando',
    Bloqueado = 'Bloqueado',
    Terminado = 'Terminado'
}

export class Proceso {
    private _pid: number;
    private _memoriaRequerida: number;
    private _tiempoTotalCpu: number;
    private _cpuRestante: number;
    private _estado: EstadoProceso;
    private _quantumConsumido: number = 0;
    private _tiempoBloqueoRestante: number = 0;

    constructor(pid: number, memoriaRequerida: number, tiempoTotalCpu: number) {
        if (pid <= 0 || memoriaRequerida <= 0 || tiempoTotalCpu <= 0) {
            throw new Error("El PID, memoria y tiempo de CPU deben ser enteros positivos.");
        }
        this._pid = pid;
        this._memoriaRequerida = memoriaRequerida;
        this._tiempoTotalCpu = tiempoTotalCpu;
        this._cpuRestante = tiempoTotalCpu;
        this._estado = EstadoProceso.Nuevo;
    }

    get pid(): number { return this._pid; }
    get memoriaRequerida(): number { return this._memoriaRequerida; }
    get cpuRestante(): number { return this._cpuRestante; }
    get estado(): EstadoProceso { return this._estado; }
    
    setEstado(nuevoEstado: EstadoProceso): void {
        this._estado = nuevoEstado;
    }
}