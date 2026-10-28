interface EncabezadoPaginaProps {
  titulo: string;
  descripcion: string;
  className?: string;
  tituloClassName?: string;
}

export function EncabezadoPagina({
  titulo,
  descripcion,
  className = "",
  tituloClassName = "",
}: EncabezadoPaginaProps) {
  return (
    <header className={className}>
      <h1
        className={`text-3xl font-bold tracking-tight text-slate-950 ${tituloClassName}`}
      >
        {titulo}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
        {descripcion}
      </p>
    </header>
  );
}
