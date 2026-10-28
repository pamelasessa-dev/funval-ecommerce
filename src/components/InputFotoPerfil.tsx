import { useEffect, useState } from "react";

interface Props {
  fotoActual?: string | null;
  iniciales: string;
  onChange: (file: File | undefined) => void;
}

export function InputFotoPerfil({ fotoActual, iniciales, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Selecciona un archivo de imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert("La imagen no debe superar los 5 MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };
  const remove = () => {
    setPreview(null);
    onChange(undefined);
  };
  const image = preview ?? fotoActual;
  return (
    <div className="flex flex-col items-center gap-2">
      <label
        className="group relative cursor-pointer"
        title="Cambiar foto de perfil"
      >
        <div className="relative size-28 overflow-hidden rounded-full border-4 border-violet-500 bg-violet-50 shadow-lg shadow-violet-200">
          {image ? (
            <img
              src={image}
              alt="Previsualización de avatar"
              className="size-full object-cover"
            />
          ) : (
            <span className="grid size-full place-items-center text-2xl font-bold text-violet-800">
              {iniciales}
            </span>
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/45 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
            Cambiar foto
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
          aria-label="Seleccionar foto de perfil"
        />
      </label>
      {preview && (
        <button
          type="button"
          onClick={remove}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
        >
          Quitar foto seleccionada
        </button>
      )}
    </div>
  );
}
