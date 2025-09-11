# 🔧 Configuración de Linting para ActivaChain

## Problema
Los errores de linting CSS que aparecen son normales y se deben a que el linter CSS nativo de VS Code no reconoce las directivas de Tailwind CSS (`@tailwind`, `@apply`, etc.).

## Solución

### 1. Instalar Extensiones de VS Code
Asegúrate de tener instaladas las siguientes extensiones:

```bash
# Extensiones recomendadas (ya configuradas en .vscode/extensions.json)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- Prettier - Code formatter (esbenp.prettier-vscode)
- TypeScript Importer (pmneo.tsimporter)
- Auto Rename Tag (formulahendry.auto-rename-tag)
- Path Intellisense (christian-kohler.path-intellisense)
```

### 2. Configuración Automática
Los archivos de configuración ya están creados:

- `.vscode/settings.json` - Configuración principal de VS Code
- `.vscode/css_custom_data.json` - Definiciones personalizadas para CSS
- `.prettierrc` - Configuración de Prettier
- `.stylelintrc.json` - Configuración de Stylelint

### 3. Verificar Configuración
1. Reinicia VS Code después de instalar las extensiones
2. Abre el archivo `styles/globals.css`
3. Los errores de linting deberían desaparecer

### 4. Si los errores persisten

#### Opción A: Deshabilitar validación CSS
```json
// En .vscode/settings.json
{
  "css.validate": false,
  "scss.validate": false,
  "less.validate": false
}
```

#### Opción B: Usar Stylelint
```bash
npm install --save-dev stylelint stylelint-config-standard
```

#### Opción C: Configurar CSS Custom Data
El archivo `.vscode/css_custom_data.json` ya está configurado para reconocer las directivas de Tailwind.

## Estado Actual
✅ Configuración de VS Code creada
✅ Extensiones recomendadas configuradas
✅ Prettier configurado
✅ Tailwind CSS configurado
✅ CSS Custom Data configurado

## Nota Importante
Los errores de linting CSS que aparecen son **advertencias** y no afectan la funcionalidad del proyecto. El marketplace funciona perfectamente con todos los efectos glassmorphism y neurales implementados.

## Comandos Útiles
```bash
# Formatear código
npm run format

# Linting
npm run lint

# Desarrollo
npm run dev
```

---
**ActivaChain Marketplace** - Configuración de desarrollo optimizada 🚀
