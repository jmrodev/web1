import os

def generate_links_for_index_html(root_dir, placeholder="<!-- LINKS_PLACEHOLDER -->"):
    """
    Genera dinámicamente enlaces a los archivos index.html de las subcarpetas
    y los inserta en el index.html principal.
    """
    main_index_path = os.path.join(root_dir, "index.html")
    links_html = []

    # Recorrer los elementos en el directorio raíz
    for item_name in sorted(os.listdir(root_dir)):
        item_path = os.path.join(root_dir, item_name)
        # Verificar si es un directorio y no es el directorio .git ni .github
        if os.path.isdir(item_path) and not item_name.startswith('.') and item_name != 'etapa_3': # Excluir etapa_3 por ahora, ya que está vacía
            # Verificar si existe un index.html dentro de la subcarpeta
            subfolder_index_path = os.path.join(item_path, "index.html")
            if os.path.exists(subfolder_index_path):
                links_html.append(f'    <li><a href="./{item_name}/index.html">{item_name.replace("_", " ").title()}</a></li>')

    if not links_html:
        print("No se encontraron subcarpetas con index.html para enlazar.")
        return

    # Leer el contenido actual del index.html principal
    try:
        with open(main_index_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {main_index_path}")
        return

    # Construir la lista HTML de enlaces
    new_links_block = "<ul>\n" + "\n".join(links_html) + "\n</ul>"

    # Reemplazar el marcador de posición
    if placeholder in content:
        new_content = content.replace(placeholder, new_links_block)
        with open(main_index_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"index.html actualizado con éxito. Se insertaron {len(links_html)} enlaces.")
    else:
        print(f"Advertencia: No se encontró el marcador de posición '{placeholder}' en {main_index_path}. El archivo no fue modificado.")
        print("Por favor, añade el marcador de posición en tu index.html principal donde quieras que aparezcan los enlaces.")

if __name__ == "__main__":
    # El directorio raíz del proyecto es el directorio donde se ejecuta el script
    project_root = os.path.dirname(os.path.abspath(__file__))
    generate_links_for_index_html(project_root)
