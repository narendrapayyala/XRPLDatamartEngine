module.exports = {
  entity_model: [
    // account_nfts fields
    {
      field: "Account",
      display_name: "Account",
      field_normalized: "account",
      type: "String",
      method: "account_nfts",
      description: "The account that owns the list of NFTs",
    },
    {
      field: "Flags",
      display_name: "Flags",
      field_normalized: "account_nfts.Flags",
      type: "Number",
      method: "account_nfts",
      description: "A bit-map of boolean flags enabled for this NFToken.",
    },
    {
      field: "Issuer",
      display_name: "Issuer",
      field_normalized: "account_nfts.Issuer",
      type: "String",
      method: "account_nfts",
      description: "The account that issued this NFToken.",
    },
    {
      field: "NFTokenID",
      display_name: "NFTokenID",
      field_normalized: "account_nfts.NFTokenID",
      type: "String",
      method: "account_nfts",
      description: "The unique identifier of this NFToken, in hexadecimal.",
    },
    {
      field: "NFTokenTaxon",
      display_name: "NFTokenTaxon",
      field_normalized: "account_nfts.NFTokenTaxon",
      type: "Number",
      method: "account_nfts",
      description:
        "The unscrambled version of this token's taxon. Several tokens with the same taxon might represent instances of a limited series.",
    },
    {
      field: "URI",
      display_name: "URI",
      field_normalized: "account_nfts.URI",
      type: "String",
      method: "account_nfts",
      description: "The URI data associated with this NFToken, in hexadecimal.",
    },
    {
      field: "nft_serial",
      display_name: "nft_serial",
      field_normalized: "account_nfts.nft_serial",
      type: "Number",
      method: "account_nfts",
      description:
        "The token sequence number of this NFToken, which is unique for its issuer.",
    },
    {
      field: "ledger_hash",
      display_name: "ledger_hash",
      field_normalized: "ledger_hash",
      type: "String",
      method: "account_nfts",
      description:
        "(May be omitted) The identifying hash of the ledger that was used to generate this response.",
    },
    {
      field: "ledger_current_index",
      display_name: "ledger_current_index",
      field_normalized: "ledger_current_index",
      type: "Integer",
      method: "account_nfts",
      description:
        "(May be omitted) The ledger index of the current in-progress ledger version, which was used to generate this response.",
    },
    {
      field: "ledger_index",
      display_name: "ledger_index",
      field_normalized: "ledger_index",
      type: "Integer",
      method: "account_nfts",
      description:
        "(May be omitted) The ledger index of the ledger that was used to generate this response.",
    },
    {
      field: "validated",
      display_name: "validated",
      field_normalized: "validated",
      type: "Boolean",
      method: "account_nfts",
      description:
        "If included and set to true, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change.",
    },
  ],

  req_parameters: [
    {
      name: "account",
      type: "string",
      required: true,
      method: "account_nfts",
      description:
        "The unique identifier of an account, typically the account's Address. The request returns a list of NFTs owned by this account.",
    },
    {
      name: "command",
      type: "number",
      required: true,
      method: "account_nfts",
      description: "",
    },
    {
      name: "ledger_hash",
      type: "string",
      required: false,
      method: "account_nfts",
      description: "A 20-byte hex string for the ledger version to use.",
    },
    {
      name: "ledger_index",
      type: "LedgerIndex",
      required: false,
      method: "account_nfts",
      description:
        "The ledger index of the ledger to use, or a shortcut string to choose a ledger automatically.",
    },
  ],
};
