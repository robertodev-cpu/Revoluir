# REVOLUIR — Site de Comprometimento

Estrutura:

- index.html
- style.css
- script.js

## Antes de publicar

Abra `script.js` e altere apenas o bloco:

```js
const REVOLUIR_CONFIG = {
  whatsappNumber: "244000000000",

  payment: {
    paypay: "INSERE O NÚMERO PAYPAY",
    express: "INSERE O NÚMERO EXPRESS",
    iban: "AO00 0000 0000 0000 0000 0000 0",
    accountName: "REVOLUIR"
  },

  price: "2.000 Kz"
};
```

### WhatsApp

Use o número no formato internacional, sem `+`, espaços ou traços.

Exemplo:

`2449XXXXXXXX`

### Fluxo

1. Visitante preenche o formulário.
2. O site valida os campos.
3. O site abre o WhatsApp com uma mensagem pronta contendo os dados.
4. Visitante volta ao site e realiza o pagamento.
5. Na área de confirmação, informa o nome verdadeiro utilizado no pagamento e o método.
6. O site abre novamente o WhatsApp com uma mensagem pronta.
7. O visitante pode anexar o comprovativo diretamente na conversa, se solicitado.
8. A REVOLUIR confere manualmente o nome/pagamento e confirma o registro.

## Importante

O HTML/JavaScript não confirma automaticamente se um pagamento aconteceu.
A confirmação real deve ser feita pela REVOLUIR através da conferência do pagamento.

Também não há upload automático do comprovativo para um servidor neste esboço.
O comprovativo é enviado diretamente pelo WhatsApp quando o membro abre a conversa.

## Privacidade

Este front-end guarda temporariamente os dados do formulário no `localStorage`
do navegador para manter o contexto entre o registro e a confirmação.

Se o projeto for colocado em produção com dados pessoais, recomenda-se criar
uma política de privacidade e, se necessário, trocar o armazenamento local
por um backend seguro.
