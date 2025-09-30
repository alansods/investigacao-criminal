# Sistema de Investigação Criminal

Um aplicativo moderno para organização e visualização de investigações criminais usando React, TypeScript, Tailwind CSS, shadcn/ui, React Flow e React DnD Kit.

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI modernos
- **React Flow** - Biblioteca para fluxos e diagramas
- **React DnD Kit** - Drag and drop funcionalidade
- **Lucide React** - Biblioteca de ícones

## ✨ Funcionalidades

### 🎯 Gestão de Categorias
- **Drag & Drop de Categorias**: Arraste categorias da toolbox para o canvas
- **4 Tipos de Categorias**:
  - 📄 Evidências Físicas (vermelho)
  - 🔊 Depoimentos (azul)
  - 👤 Suspeitos (amarelo)
  - 🎬 Cronologia (verde)
- **Posicionamento Livre**: Organize as categorias visualmente no canvas

### 🔍 Sistema de Pistas
- **Adicionar Pistas**: Cada categoria pode conter múltiplas pistas
- **Tipos de Mídia**: Suporte para texto, imagem, vídeo e áudio
- **Edição Completa**: Edite título, conteúdo, tipo e URL de mídia
- **Drag & Drop de Pistas**: 
  - Reordene pistas dentro da mesma categoria
  - Mova pistas entre categorias diferentes
- **Exclusão**: Remova pistas individualmente

### 🔗 Conexões Inteligentes
- **Conexões Direcionais**: Conecte categorias através de pontos de conexão
- **4 Pontos por Categoria**: Esquerda, direita, topo e base
- **Validação de Duplicatas**: Impede conexões duplicadas entre as mesmas categorias
- **Conexões Bidirecionais**: Conecte em qualquer direção
- **Exclusão de Conexões**: Clique na conexão para removê-la

### 💾 Persistência de Dados
- **Salvamento Local**: Dados salvos no localStorage do navegador
- **Botão Salvar**: Salve manualmente seu progresso
- **Carregamento Automático**: Retome de onde parou
- **Limpar Dados**: Função para resetar toda a investigação

### 📱 Interface Responsiva
- **Design Adaptativo**: Funciona em desktop, tablet e mobile
- **Viewport Dinâmico**: Ajuste automático para diferentes tamanhos de tela
- **Touch Friendly**: Otimizado para dispositivos touch

### 🎨 Navegação e Visualização
- **Zoom e Pan**: Navegação fluida no canvas
- **Mini Mapa**: Visualização geral da investigação
- **Controles de Zoom**: Controles visuais para zoom in/out
- **Background com Grid**: Guias visuais para organização

### ℹ️ Sistema de Ajuda
- **Modal de Instruções**: Guia completo de uso
- **6 Seções Detalhadas**: Passo a passo de todas as funcionalidades
- **Regras e Dicas**: Orientações importantes e boas práticas
- **Acesso Fácil**: Botão "Ajuda" sempre visível na barra lateral

### 🔔 Modais Informativos
- **Confirmação de Exclusão**: Para categorias e conexões
- **Aviso de Duplicatas**: Impede conexões repetidas
- **Confirmação de Limpeza**: Proteção contra perda acidental de dados

## 🛠️ Instalação

```bash
# Instalar dependências
pnpm install

# Executar em modo de desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview do build
pnpm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                      # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── InvestigationCanvas.tsx  # Canvas principal com React Flow
│   ├── InvestigationNode.tsx    # Componente de categoria/card
│   ├── InvestigationToolbox.tsx # Item draggable da toolbox
│   ├── AddClueModal.tsx         # Modal para adicionar/editar pistas
│   ├── ConfirmDeleteModal.tsx   # Modal de confirmação de exclusão
│   ├── DeleteConnectionModal.tsx # Modal para excluir conexões
│   ├── DuplicateConnectionModal.tsx # Aviso de conexão duplicada
│   ├── HelpModal.tsx            # Modal de ajuda e instruções
│   └── MediaIcon.tsx            # Ícones de tipo de mídia
├── types/
│   └── investigation.ts         # Tipos TypeScript
├── lib/
│   └── utils.ts                 # Utilitários (cn function)
├── App.tsx                      # Componente principal
└── main.tsx                     # Entry point
```

## 🎯 Como Usar

### 1. Adicionar Categorias
- Clique e arraste uma categoria da barra lateral esquerda para o canvas
- Solte na posição desejada
- Você pode adicionar quantas categorias quiser

### 2. Adicionar Pistas
- Clique no botão "+" dentro de uma categoria
- Preencha o título e conteúdo da pista
- Escolha o tipo de mídia (texto, imagem, vídeo ou áudio)
- Adicione uma URL de mídia se necessário
- Clique em "Adicionar Pista"

### 3. Criar Conexões
- Clique e arraste de um dos pontos de conexão (círculos roxos) de uma categoria
- Arraste até o ponto de conexão de outra categoria
- Solte para criar a conexão
- As conexões mostram o relacionamento entre diferentes categorias

### 4. Organizar Pistas
- **Reordenar**: Clique no ícone de arrastar (≡) e mova para cima ou para baixo
- **Mover entre categorias**: Arraste uma pista para outra categoria
- **Editar**: Clique no ícone de lápis para editar
- **Excluir**: Clique no ícone de lixeira para remover

### 5. Navegação
- **Mover canvas**: Clique e arraste em um espaço vazio
- **Zoom**: Use a roda do mouse ou os controles no canto inferior esquerdo
- **Mover categoria**: Clique e arraste o cabeçalho da categoria
- **Minimapa**: Use o minimapa no canto inferior direito para navegar

### 6. Salvar e Gerenciar
- **Salvar**: Clique no botão "Salvar" no topo da página
- **Limpar**: Use o botão "Limpar" para resetar toda a investigação (requer confirmação)
- **Ajuda**: Clique no botão "Ajuda" na barra lateral para ver as instruções completas

## 🎨 Categorias Disponíveis

### 📄 Evidências Físicas
Categoria para evidências materiais encontradas na cena do crime
- Cor: Vermelho
- Ícone: Documento
- Exemplos: Impressões digitais, fios de cabelo, objetos

### 🔊 Depoimentos
Categoria para relatos de testemunhas e envolvidos
- Cor: Azul
- Ícone: Volume
- Exemplos: Testemunhos, entrevistas, declarações

### 👤 Suspeitos
Categoria para pessoas de interesse na investigação
- Cor: Amarelo
- Ícone: Usuário
- Exemplos: Suspeitos principais, pessoas relacionadas, históricos

### 🎬 Cronologia
Categoria para organizar eventos temporalmente
- Cor: Verde
- Ícone: Vídeo
- Exemplos: Linha do tempo, sequência de eventos, horários

## ⚠️ Regras Importantes

1. **Conexões Únicas**: Não é permitido conectar as mesmas categorias mais de uma vez, mesmo por lados diferentes
2. **Salvamento Manual**: Use o botão "Salvar" regularmente para não perder seu progresso
3. **Limpar Dados**: O botão "Limpar" remove permanentemente todos os dados salvos
4. **Dados Locais**: Todas as informações são armazenadas localmente no navegador

## 💡 Dicas Úteis

- Organize suas categorias da esquerda para a direita seguindo a cronologia dos eventos
- Use cores diferentes para identificar tipos de evidências rapidamente
- Salve regularmente para não perder seu trabalho
- Use conexões para mostrar relações entre evidências, testemunhos e suspeitos
- O botão "Ajuda" na barra lateral contém todas as instruções detalhadas

## 🔧 Configuração

O projeto está configurado com:
- **Path aliases** (`@/` para `src/`)
- **Tailwind CSS** com tema customizado
- **shadcn/ui** com componentes prontos
- **TypeScript** com configuração estrita
- **ESLint** para qualidade de código
- **React Flow** para gestão de canvas
- **DnD Kit** para drag and drop

## 📝 Scripts Disponíveis

- `pnpm run dev` - Servidor de desenvolvimento
- `pnpm run build` - Build para produção
- `pnpm run preview` - Preview do build
- `pnpm run lint` - Linting do código

## 🌐 Compatibilidade

- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Tablets iOS/Android
- ✅ Dispositivos móveis (com limitações de espaço)

## 🚀 Melhorias Futuras

- [ ] Export/Import de investigações em JSON
- [ ] Impressão de relatórios
- [ ] Modo escuro
- [ ] Compartilhamento de investigações
- [ ] Histórico de alterações (undo/redo)
- [ ] Busca e filtros de pistas
- [ ] Tags e categorização adicional
- [ ] Anexos de arquivos reais

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido com

- React Flow para visualização de grafos
- DnD Kit para interações de drag and drop
- shadcn/ui para componentes de interface
- Tailwind CSS para estilização
- TypeScript para type safety