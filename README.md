# REVOLUIR — Site editado

Alterações desta versão:

1. Os métodos de pagamento aparecem inicialmente apenas como opções. Os números PayPay, Express e o IBAN só aparecem depois de clicar no método escolhido.
2. Ao escolher PayPay, Express ou Transferência bancária, o método fica automaticamente selecionado no bloco de confirmação.
3. O bloco de confirmação de pagamento só aparece depois de escolher um método.
4. A escolha da rede social agora vem antes do campo do utilizador. Só depois de selecionar a rede aparece o campo específico para o nome de utilizador real.
5. O placeholder `Ex.:` foi uniformizado em cinzento, sem qualquer letra vermelha isolada.
6. O visual foi refinado para ficar mais consistente com preto/branco/vermelho REVOLUIR, com menos elementos pesados e melhor hierarquia no telemóvel.
7. O formulário continua a abrir o WhatsApp com os dados preenchidos.
8. A confirmação de pagamento abre o WhatsApp com o nome verdadeiro usado no pagamento e o método escolhido.

## Configuração

Editar no topo de `script.js`:

- `whatsappNumber`
- `payment.paypay`
- `payment.express`
- `payment.iban`
- `payment.accountName`

Os dados PayPay, Express e IBAN presentes nesta versão foram os dados visíveis na referência fornecida. Confirma-os antes da publicação.

## Refinamento visual (v3)

Estrutura, textos e funcionalidades mantidos. Alterações:

- **Cores:** preto/branco com o vermelho REVOLUIR só em títulos (barra sob cada título e palavra em destaque no hero), preço, números de pagamento, botões e elementos de interesse.
- **Formulários e seleções:** campos, selects, listas de escolha e áreas de pagamento sempre em tons escuros (inclui lista nativa do select e preenchimento automático do navegador).
- **Geometria:** campos, cartões, opções (formato pílula) e botões com cantos muito mais arredondados.
- **Botões:** brilho que segue o dedo/rato, leve deslocamento magnético e efeito ao premir. Respeita `prefers-reduced-motion`.
- **Logo oficial:** punho REVOLUIR no cabeçalho, rodapé, hero (com inclinação suave) e favicon. Ficheiros de imagem na mesma pasta do `index.html`.
- **Pagamentos:** logos oficiais PayPay e Express. Os dados continuam ocultos até clicar no método. A Transferência bancária usa a logo IBAN fornecida (mosaico claro, porque a marca é azul).
- **Redes sociais:** mantidas fechadas; o campo de utilizador só aparece depois de escolher a rede.
- **Livros (`#livros`):** secção preparada para vários livros. Para adicionar um, copia o bloco `<article class="book-card">` dentro de `#bookGrid` e troca capa, título, descrição e link. O botão **Ver mais** fica oculto enquanto houver apenas 1 livro (`data-visible="1"` em `#bookGrid`) e aparece sozinho quando houver mais.
  - A capa atual é desenhada em CSS segundo a capa oficial. Para usar a imagem real, substitui o `<div class="book-cover">…</div>` por `<img class="book-cover" src="capa-revoluir.jpg" alt="Capa do livro REVOLUIR">`.
  - O botão **Comprar** ainda tem `href="#"`: troca pelo link de compra.

Ficheiros novos: `refinamentos.js` (interações dos botões, logo e “Ver mais”) e as imagens (logos).

## Código organizado

`index.html`, `style.css`, `refinamentos.js` e `script.js` estão organizados, uma instrução por linha, com indentação e comentários de secção no CSS.
A organização não altera o resultado: a página renderiza pixel a pixel igual e as 213 regras CSS são equivalentes.

## script.js (novo)

O `script.js` original não foi enviado, por isso este foi escrito de novo a partir do HTML e das regras descritas acima. Se tiveres o original, podes usá-lo no lugar deste.

- **Obrigatório:** definir `whatsappNumber` no topo (só dígitos, com indicativo, ex.: `244900000000`). Enquanto estiver vazio, os botões de WhatsApp mostram um aviso.
- Os dados PayPay, Express, IBAN e nome da conta também se editam no topo, em `payment`.
- Faz: animação de entrada ao rolar, listas recolhíveis (rede social e área), campo do utilizador só depois de escolher a rede, campo “Qual é a tua área?” só com “Outro”, validação do formulário, abertura do WhatsApp com os dados, métodos de pagamento (um aberto de cada vez, com botão Copiar), confirmação que só aparece depois de escolher o método e abre o WhatsApp.

Tudo está numa única pasta, sem subpastas.
