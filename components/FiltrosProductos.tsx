'use client';

interface Props {
  total: number;
  filtrados: number;
  soloConFoto: boolean;
  setSoloConFoto: (v: boolean) => void;
  busqueda: string;
  setBusqueda: (v: string) => void;
}

export default function FiltrosProductos({
  total,
  filtrados,
  soloConFoto,
  setSoloConFoto,
  busqueda,
  setBusqueda,
}: Props) {
  return (
    <div className="filtros">
      <label>
        <input
          type="checkbox"
          checked={soloConFoto}
          onChange={e => setSoloConFoto(e.target.checked)}
        />
        Sólo con foto
      </label>

      <input
        type="text"
        placeholder="Filtrar por código o nombre..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{ minWidth: 240 }}
      />

      <span className="contador">
        {filtrados} de {total} productos
      </span>
    </div>
  );
}
