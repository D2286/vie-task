import os

# Obtiene el directorio donde está el script
current_directory = os.path.dirname(os.path.realpath(__file__))

# Nombre del archivo de resultado
nombre_archivo_resultado = "resultado.txt"

# Lista para almacenar el contenido de los archivos
contenido_archivos = []

# Extensiones de archivos que quieres procesar
extensiones = (".js", ".css", ".html", ".json", ".jsx", ".ts", ".tsx")

# Recorre todas las carpetas y archivos desde el directorio actual
for root, dirs, files in os.walk(current_directory):
    for archivo in files:
        if archivo.endswith(extensiones):
            ruta_archivo = os.path.join(root, archivo)

            # Imprime la ruta del archivo para depuración
            print(f"Procesando archivo: {ruta_archivo}")

            try:
                # Abre el archivo en modo lectura
                with open(ruta_archivo, "r", encoding="utf-8") as archivo_abierto:
                    contenido = archivo_abierto.read()
                    # Agrega el contenido del archivo a la lista
                    contenido_archivos.append(
                        f"Contenido de {ruta_archivo}:\n{contenido}\n\n"
                    )
            except Exception as e:
                print(f"⚠️ No se pudo leer {ruta_archivo}: {e}")

# Ruta completa del archivo de resultado
ruta_resultado = os.path.join(current_directory, nombre_archivo_resultado)

# Escribe todo en el archivo de resultado
with open(ruta_resultado, "w", encoding="utf-8") as archivo_resultado:
    archivo_resultado.writelines(contenido_archivos)

print("✅ Se ha creado el archivo de resultado con el contenido de los archivos.")







""" import os

# Obtiene el directorio de trabajo actual donde se encuentra el script
current_directory = os.path.dirname(os.path.realpath(__file__))

# Nombre del archivo de resultado
nombre_archivo_resultado = "resultado.txt"

# Lista para almacenar el contenido de los archivos .js
contenido_archivos_js = []

# Recorre todos los archivos en el directorio actual
for archivo in os.listdir(current_directory):
    if archivo.endswith(".js") or archivo.endswith(".css") or archivo.endswith(".html") or archivo.endswith(".json") or archivo.endswith(".jsx"):
        # Ruta completa del archivo .js
        ruta_archivo_js = os.path.join(current_directory, archivo)

        # Imprime la ruta del archivo para depuración
        print(f"Procesando archivo: {ruta_archivo_js}")

        # Abre el archivo .js en modo lectura
        with open(ruta_archivo_js, "r", encoding="utf-8") as archivo_js:
            contenido_js = archivo_js.read()
            # Agrega el contenido del archivo a la lista
            contenido_archivos_js.append(f"Contenido de {archivo}:\n{contenido_js}\n")

# Ruta completa del archivo de resultado
ruta_resultado = os.path.join(current_directory, nombre_archivo_resultado)

# Abre el archivo de resultado en modo escritura
with open(ruta_resultado, "w", encoding="utf-8") as archivo_resultado:
    # Escribe el contenido de los archivos .js en el archivo de resultado
    archivo_resultado.writelines(contenido_archivos_js)

print("Se ha creado el archivo de resultado con el contenido de los archivos .js.")


 """