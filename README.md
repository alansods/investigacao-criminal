# Workflow Builder

Um aplicativo moderno de construção de workflows usando React, TypeScript, Tailwind CSS, shadcn/ui, React Flow e React DnD Kit.

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI modernos
- **React Flow** - Biblioteca para fluxos e diagramas
- **React DnD Kit** - Drag and drop funcionalidade

## ✨ Funcionalidades

- **Drag & Drop**: Arraste componentes da toolbox para o canvas
- **Nós Conectáveis**: Crie conexões entre diferentes nós
- **Interface Moderna**: Design limpo e responsivo
- **Componentes Reutilizáveis**: Biblioteca de nós customizáveis
- **Zoom e Pan**: Navegação fluida no canvas
- **Mini Mapa**: Visualização geral do workflow

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   ├── CustomNode.tsx # Nó customizado do React Flow
│   ├── NodeToolbox.tsx # Toolbox com drag and drop
│   └── FlowCanvas.tsx # Canvas principal
├── lib/
│   └── utils.ts      # Utilitários (cn function)
└── App.tsx           # Componente principal
```

## 🎯 Como Usar

1. **Adicionar Nós**: Arraste componentes da toolbox lateral para o canvas
2. **Conectar Nós**: Clique e arraste das handles dos nós para criar conexões
3. **Editar Nós**: Clique nos nós para selecioná-los e editar
4. **Navegar**: Use zoom e pan para navegar pelo canvas
5. **Salvar**: Use os botões do header para salvar ou exportar

## 🎨 Componentes Disponíveis

- **Documento**: Para representar arquivos e documentos
- **Banco de Dados**: Para operações de dados
- **Usuário**: Para interações humanas
- **Processo**: Para operações automatizadas

## 🔧 Configuração

O projeto está configurado com:
- **Path aliases** (`@/` para `src/`)
- **Tailwind CSS** com tema customizado
- **shadcn/ui** com componentes prontos
- **TypeScript** com configuração estrita

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.