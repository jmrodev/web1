import os
import re

def generate_links_for_index_html(root_dir=".", start_marker="<!-- START_LINKS -->", end_marker="<!-- END_LINKS -->"):
    """
    Genera dinámicamente enlaces a los archivos index.html de las subcarpetas
    y reemplaza el bloque de enlaces en el index.html principal.
    """
    main_index_path = os.path.join(root_dir, "index.html")
    links_html = []

    # Recorrer los elementos en el directorio raíz
    for item_name in sorted(os.listdir(root_dir)):
        item_path = os.path.join(root_dir, item_name)
        # Verificar si es un directorio, no está oculto y no es parte de la infraestructura de GH
        if os.path.isdir(item_path) and not item_name.startswith('.') and item_name not in ['.git', '.github']:
            subfolder_index_path = os.path.join(item_path, "index.html")
            if os.path.exists(subfolder_index_path):
                display_name = item_name.replace("_", " ").replace("-", " ").title()
                links_html.append(f'        <li><a href="./{item_name}/">{display_name}</a></li>')

    # Construir la lista HTML de enlaces. Si no hay enlaces, la lista estará vacía.
    links_list_str = "<ul>\n" + "\n".join(links_html) + "\n    </ul>"

    # Leer el contenido actual del index.html principal
    try:
        with open(main_index_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {main_index_path}")
        return

    # Construir el bloque de reemplazo completo
    replacement_block = f"{start_marker}\n    {links_list_str}\n    {end_marker}"

    # Usar una expresión regular para encontrar y reemplazar el bloque entre los marcadores
    pattern = re.compile(f"{re.escape(start_marker)}.*?{re.escape(end_marker)}", re.DOTALL)

    if pattern.search(content):
        new_content, num_replacements = pattern.subn(replacement_block, content)
        if num_replacements > 0 and new_content != content:
            print(f"index.html actualizado con éxito. Se insertaron/actualizaron {len(links_html)} enlaces.")
            with open(main_index_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
        else:
            print("No se necesitaron cambios en index.html.")
    else:
        print(f"Advertencia: No se encontraron los marcadores '{start_marker}' y '{end_marker}' en {main_index_path}.")
        print("Por favor, asegúrate de que tu index.html principal los contenga.")
        return

if __name__ == "__main__":
    project_root = "."
    generate_links_for_index_html(project_root)